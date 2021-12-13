import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Streamer } from './streamer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StreamerService {
  constructor(
    @InjectRepository(Streamer)
    private streamerRepository: Repository<Streamer>,
  ) {}

  async getStreamerList(): Promise<Streamer[]> {
    return this.streamerRepository.find();
  }
}
