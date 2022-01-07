import { forwardRef, Module } from '@nestjs/common';
import { StreamerModule } from 'src/streamer/streamer.module';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [forwardRef(() => StreamerModule)],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
