import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Streamer } from '../entities/streamer.entity';
import { Repository } from 'typeorm';
import { UserInputError } from 'apollo-server-express';
import { StreamerInsertInfoDto } from './dto/insert-info.dto';
import axios from 'axios';

@Injectable()
export class StreamerService {
  constructor(
    @InjectRepository(Streamer)
    private streamerRepository: Repository<Streamer>,
  ) {}

  async findAll(): Promise<Streamer[]> {
    return this.streamerRepository.find();
  }

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

  private async getOnAirByBroadcasterId(broadcaster_id: string): Promise<boolean> {
    const request_url = `https://api.twitch.tv/helix/streams?user_id=${broadcaster_id}`;
    const channel_info = await this.requestTwitchApi(request_url);
    return channel_info["data"].length != 0 ? true : false;
  }
  
  private async getViewersByBroadcasterId(broadcaster_id: string): Promise<number> {
    let request_url = `https://api.twitch.tv/helix/streams?user_id=${broadcaster_id}`;
    let stream_info = await this.requestTwitchApi(request_url);
    if (stream_info["data"].length == 0)
      return 0;
    return stream_info["data"][0]["viewer_count"];
  }
  
  private async getFollowersByBroadcasterId(broadcaster_id: string): Promise<number> {
    const request_url = `https://api.twitch.tv/helix/users/follows?to_id=${broadcaster_id}`;
    const follow_info = await this.requestTwitchApi(request_url);
    return follow_info.total;
  }

  /*
   @todo 지금은 streamer테이블에 streamer_id값이 없어서 getUserInfoByLoginId를 통해 streamer_id를 받아오는데
         나중에 스트리머 추가 부분이 개선이 되면 바로 streamer.streamer_id 를 사용하도록 변경해야함
  */
  async findOneByNick(nick: string): Promise<Streamer> {
    const streamer = await this.streamerRepository.findOne({ nick: nick });
    if (!streamer) {
      throw new UserInputError('Streamer Nickname Not Found');
    }
    const streamer_info = await this.getUserInfoByLoginId(streamer.streamer_login);
    streamer.onAir = await this.getOnAirByBroadcasterId(streamer_info["id"]);
    streamer.viewers = await this.getViewersByBroadcasterId(streamer_info["id"]);
    streamer.followers = await this.getFollowersByBroadcasterId(streamer_info["id"]);
    return streamer;
  }

  private async getUserInfoByLoginId(streamer_login: string): Promise<Object> {
    const request_url = `https://api.twitch.tv/helix/users?login=${streamer_login}`;
    const user_info = await this.requestTwitchApi(request_url);
    if (user_info["data"][0] == undefined) {
      console.error("[-] Twitch Api Error Response", user_info);
      throw new UserInputError(`Twitch api return error code`);
    }
    return user_info["data"][0];
  }

  async getInsertInfoByLoginId(streamer_login: string): Promise<StreamerInsertInfoDto> {
    const user_info = await this.getUserInfoByLoginId(streamer_login);
    return {
      streamer_id: user_info["id"],
      streamer_login: user_info["login"],
      nick: user_info["display_name"],
      image_url: user_info["profile_image_url"]
    }
  }

  async deleteStreamerById(streamer_login: string): Promise<Streamer[]> {
    const targetToDelete: Streamer = await this.streamerRepository.findOne({
      streamer_login,
    });
    return this.streamerRepository.remove([targetToDelete]);
  }
}
