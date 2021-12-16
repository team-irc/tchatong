import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatfire } from './chatfire.entity';
import { Streamer } from '../streamer/streamer.entity';

@Injectable()
export class ChatfireService {
  constructor(
    @InjectRepository(Chatfire)
    private chatFireRepository: Repository<Chatfire>,
    @InjectRepository(Streamer)
    private streamerRepository: Repository<Streamer>,
  ) {}

  async findAll(): Promise<Chatfire[]> {
    return this.chatFireRepository.find();
  }

  async findOneByNick(nick: string): Promise<Chatfire[]> {
    const streamer = await this.streamerRepository.findOne({ nick });
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

  async findDayTop(streamer_id: string): Promise<Chatfire> {
    const a_day_ago = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    const chatfires = await this.getChatfiresAfterDate(streamer_id, a_day_ago);
    return (this.getHighestCountFromChatfires(chatfires));
  }
}
