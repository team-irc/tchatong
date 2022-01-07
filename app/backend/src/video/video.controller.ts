import { Controller, Get, Query } from '@nestjs/common';
import { GetVideoDto } from './video.dto';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
	constructor(
		private videoService: VideoService
	) {}

	@Get()
	async getTwitchVideoUrl(@Query() getVideoDto: GetVideoDto) {
		return this.videoService.getVideoUrl(getVideoDto.streamer_login, getVideoDto.time);
	}
}
