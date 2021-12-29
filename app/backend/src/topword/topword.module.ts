import { Module } from '@nestjs/common';
import { TopwordService } from './topword.service';
import { TopwordResolver } from './topword.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topword } from 'src/entities/topword.entity';
import { StreamerService } from 'src/streamer/streamer.service';
import { Streamer } from 'src/entities/streamer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topword, Streamer])],
  providers: [TopwordResolver ,TopwordService, StreamerService]
})
export class TopwordModule {}
