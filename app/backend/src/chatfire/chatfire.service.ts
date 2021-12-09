import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatfire } from './chatfire.entity';

@Injectable()
export class ChatfireService {
  constructor(
    @InjectRepository(Chatfire)
    private chatFireRepository: Repository<Chatfire>,
  ) {}

  async getStreamerId(): Promise<Chatfire[]> {
    console.log('getStreamer id');
    const res = this.chatFireRepository.find();
    console.log('res: ' + res);
    return this.chatFireRepository.find();
  }
}
