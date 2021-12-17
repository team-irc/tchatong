import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatfireResolver } from './chatfire.resolver';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from '../entities/chatfire.entity';
import { Streamer } from '../entities/streamer.entity';
import { StreamerService } from 'src/streamer/streamer.service';
import { Legend } from 'src/entities/legend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chatfire, Streamer, Legend])],
  providers: [ChatfireResolver, ChatfireService, StreamerService],
})
export class ChatfireModule {}
