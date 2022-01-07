import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import axios from 'axios';
import { create } from 'domain';
import { StreamerService } from 'src/streamer/streamer.service';

@Injectable()
export class VideoService {
	constructor (
    @Inject(forwardRef(() => StreamerService))
    private streamerService: StreamerService
	) {}

	private async requestTwitchApi(url: string): Promise<any> {
    const header = {
      Authorization: `Bearer ${process.env.TWITCH_API_ACCESS_TOKEN}`,
      "Client-Id": `${process.env.TWITCH_API_CLIENT_ID}`,
    }; // key값에 -가 들어가는 경우 double quote로 감싸줘야한다.
    try {
      const res = await axios.get(url, {
        method: 'GET',
        headers: header
      });
      return res.data;
    }
    catch (err) {
      console.log(err);
    }
  }

  private async getTwitchVideo(streamer_id: string, target_time: Date): Promise<string> {
    const request_url = `https://api.twitch.tv/helix/videos?user_id=${streamer_id}`;
    const video_info = await this.requestTwitchApi(request_url);
		if (video_info["data"].length == 0) {
			throw new UserInputError("Video Not Found");
		}
		let created_at;
		let created_date;
		let duration;
		let hour;
		let min;
		let sec;
		let ended_date;
		let interval;
		for (let i = 0; i < video_info["data"].length; i++) {
			created_at = video_info["data"][0]["created_at"];
			created_date = new Date(created_at);
			duration = video_info["data"][0]["duration"];
			hour = Number(duration.split('h')[0]);
			duration = duration.split('h')[1];
			min = Number(duration.split('m')[0]);
			duration = duration.split('m')[1];
			sec = Number(duration.split('s')[0]);
			ended_date = new Date(created_date);
			ended_date.setSeconds(ended_date.getSeconds() + sec);
			ended_date.setMinutes(ended_date.getMinutes() + min);
			ended_date.setHours(ended_date.getHours() + hour);
			// console.log("created_date:", created_date);
			// console.log("ended_date:", ended_date);
			// console.log("target_time:", target_time);
			if (target_time >= created_date && target_time <= ended_date) {
				// console.log("if in!");
				interval = target_time.getTime() - created_date.getTime();
				// console.log("interval:", interval)
				hour = Math.floor(interval / (60 * 60 * 1000));
				interval = interval % (60 * 60 * 1000);
				min = Math.floor(interval / (60 * 1000));
				interval = interval % (60 * 1000);
				sec = Math.floor(interval / (1000));
				const ret = `${video_info["data"][i]["url"]}?t=${hour}h${min}m${sec}s`;
				// console.log(ret);
				return ret;
			}
		}
		throw new UserInputError("Video Not Found");
  }

	/*
		@todo 1. streamer 비디오 정보를 조회하기 위해서 streamer_id 를 가져오는 부분에서,
					지금은 트위치 api를 호출해서 가져오지만, 이를 db에서 가져오도록 수정해야함
	*/
	async getVideoUrl(streamer_login: string, time: number) {
		const streamer_info = await this.streamerService.getInsertInfoByLoginId(streamer_login);
		try {
			// console.log('time:', time);
			const date = new Date(time - 1);
			// console.log('date:', date);
			return await this.getTwitchVideo(streamer_info["streamer_id"], date);
		}
		catch (e) {
			// console.log(e);
			return `https://www.twitch.tv/${streamer_info.streamer_login}`;
		}
	}
}
