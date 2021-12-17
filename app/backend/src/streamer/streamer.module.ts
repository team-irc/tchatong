import { Module } from '@nestjs/common';
import { StreamerResolver } from './streamer.resolver';
import { StreamerService } from './streamer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Streamer } from '../entities/streamer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Streamer])],
  providers: [StreamerResolver, StreamerService],
})
export class StreamerModule {}
