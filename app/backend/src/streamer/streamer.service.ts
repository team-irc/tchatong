import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Streamer } from '../entities/streamer.entity';
import { Repository } from 'typeorm';
import { UserInputError } from 'apollo-server-express';

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
    const streamer = await this.streamerRepository.findOne({ nick: nick });
    if (!streamer) {
      throw new UserInputError('Streamer Nickname Not Found');
    }
    return streamer;
  }

  async addNewStreamer(newStreamerInfo: Streamer): Promise<Streamer> {
    return this.streamerRepository.save(newStreamerInfo);
  }

  async deleteStreamerById(streamer_login: string): Promise<Streamer[]> {
    const targetToDelete: Streamer = await this.streamerRepository.findOne({
      streamer_login,
    });
    return this.streamerRepository.remove([targetToDelete]);
  }
}
