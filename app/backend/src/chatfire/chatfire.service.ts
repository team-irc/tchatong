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
}
