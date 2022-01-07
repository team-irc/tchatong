import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetVideoDto } from './video.dto';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
	constructor(
		private videoService: VideoService
	) {}

	@Get()
	async getTwitchVideoUrl(@Query() getVideoDto: GetVideoDto, @Res() res: Response) {
		const ret = await this.videoService.getVideoUrl(getVideoDto.streamer_login, getVideoDto.time);
		if (ret.length != 0)
			res.send(ret);
		else
			res.status(404).send("Video Not Found");
	}
}
