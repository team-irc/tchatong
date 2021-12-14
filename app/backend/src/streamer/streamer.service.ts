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

  async findAll(): Promise<Streamer[]> {
    return this.streamerRepository.find();
  }

  async findOneByNick(nick: string): Promise<Streamer> {
    return this.streamerRepository.findOne({ nick });
  }

  async addNewStreamer(newStreamerInfo: Streamer): Promise<Streamer> {
    return this.streamerRepository.save(newStreamerInfo);
  }

  async deleteStreamerById(streamer_id: string): Promise<Streamer[]> {
    const targetToDelete: Streamer = await this.streamerRepository.findOne({
      streamer_id,
    });
    return this.streamerRepository.remove([targetToDelete]);
  }
}
