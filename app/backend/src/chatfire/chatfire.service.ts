import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatfire } from '../entities/chatfire.entity';
import { StreamerService } from 'src/streamer/streamer.service';
import { Legend } from 'src/entities/legend.entity';
import { UserInputError } from 'apollo-server-express';

@Injectable()
export class ChatfireService {
  constructor(
    @InjectRepository(Chatfire)
    private chatFireRepository: Repository<Chatfire>,
    @InjectRepository(Legend)
    private legendRepository: Repository<Legend>,
    @Inject(forwardRef(() => StreamerService))
    private streamerService: StreamerService
  ) {}

  async findAll(): Promise<Chatfire[]> {
    return this.chatFireRepository.find();
  }

  async findOneByNick(nick: string): Promise<Chatfire[]> {
    const streamer = await this.streamerService.findOneByNick(nick);
    return this.chatFireRepository.find({ streamer_id: streamer.streamer_id });
  }

  private async getChatfiresAfterDate(streamer_id: string, date: Date): Promise<Chatfire[]> {
    const sql = `SELECT * FROM chatfire WHERE (streamer_id = '${streamer_id}' AND date >= '${date}');`;
    return (await this.chatFireRepository.query(sql));
  }

  private async initHighestChatfire(): Promise<Chatfire> {
    const highest_chatfire = new Chatfire();
    highest_chatfire.streamer_id = '';
    highest_chatfire.id = 0;
    highest_chatfire.date = new Date();
    highest_chatfire.count = 0;
    return (highest_chatfire);
  }

  private async getHighestCountFromChatfires(chatfires: Chatfire[]): Promise<Chatfire> {
    let highest_chatfire = await this.initHighestChatfire();
    for (let chatfire of chatfires) {
      if (chatfire.count > highest_chatfire.count) {
        highest_chatfire = chatfire;
        highest_chatfire.count = chatfire.count;
      }
    }
    return (highest_chatfire);
  }

  async findDayTop(streamer_nick: string): Promise<Chatfire> {
    const a_day_ago = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    const streamer = await this.streamerService.findOneByNick(streamer_nick);
    const chatfires = await this.getChatfiresAfterDate(streamer.streamer_id, a_day_ago);
    return (this.getHighestCountFromChatfires(chatfires));
  }

  private async getLastEntireTop(streamer_id: string): Promise<Legend> {
    return (this.legendRepository.findOne({ streamer_id: streamer_id }));
  }

  private async saveEntireTopOfStreamer(entire_top: Chatfire) {
    const legend = this.legendRepository.findOne({ streamer_id: entire_top.streamer_id });
    if (!legend) {
      this.legendRepository.save({
        streamer_id: entire_top.streamer_id,
        chatfire_id: entire_top.id,
        last_update_date: new Date(),
      });
    } else {
      this.legendRepository.update({ streamer_id: entire_top.streamer_id }, {
        streamer_id: entire_top.streamer_id,
        chatfire_id: entire_top.id,
        last_update_date: new Date(),
      });
    }
  }

  private async findEntireTopChatfireById(chatfire_id: number): Promise<Chatfire> {
    const last_entire_top_chatfire = await this.chatFireRepository.findOne({ id: chatfire_id });
    if (!last_entire_top_chatfire) {
      throw new InternalServerErrorException("해당 chatfire_id를 chatfire 테이블 내에서 찾을 수 없습니다.");
    }
    return (last_entire_top_chatfire);
  }

  private async getEntireTop(streamer_id: string): Promise<Chatfire> {
    const last_entire_top = await this.getLastEntireTop(streamer_id);
    if (!last_entire_top) { // 첫 생성
      const chatfires = await this.chatFireRepository.find({ streamer_id: streamer_id });
      const entire_top = await this.getHighestCountFromChatfires(chatfires);
      this.saveEntireTopOfStreamer(entire_top);
      return (entire_top);
    } else { // 업데이트
      const last_entire_top_chatfire = await this.findEntireTopChatfireById(last_entire_top.chatfire_id);
      const chatfires = await this.getChatfiresAfterDate(streamer_id, last_entire_top.last_update_date);
      chatfires.push(last_entire_top_chatfire);
      const entire_top = await this.getHighestCountFromChatfires(chatfires);
      this.saveEntireTopOfStreamer(entire_top);
      return (entire_top);
    }
  }

  async findEntireTop(streamer_nick: string): Promise<Chatfire> {
    const streamer = await this.streamerService.findOneByNick(streamer_nick);
    return (await this.getEntireTop(streamer.streamer_id));
  }
}
