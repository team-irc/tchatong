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

  private async requestTwitchApi(url: string): Promise<any> {
    const header = {
      Authorization: `Bearer ${process.env.TWITCH_API_CLIENT_TOKEN}`,
      "Client-Id": `${process.env.TWITCH_API_CLIENT_ID}`,
    }; // key값에 -가 들어가는 경우 double quote로 감싸줘야한다.
    const option = {
      method: 'GET',
      headers: header,
    }
    return await fetch(url, option);
  }

  private async getOnAirByBroadcasterId(broadcaster_id: string): Promise<boolean> {
    const request_url = `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcaster_id}`;
    const channel_info = await this.requestTwitchApi(request_url);
    return channel_info["data"].length != 0 ? true : false;
  }
  
  private async getViewersByBroadcasterId(broadcaster_id: string): Promise<number> {
    const request_url = `https://api.twitch.tv/helix/streams/followed?user_id=${process.env.TWITCH_API_CLIENT_ID}`;
    const stream_info = await this.requestTwitchApi(request_url);
    while (stream_info["pagination"]["cursor"] != undefined) {
      const request_url = `https://api.twitch.tv/helix/streams/followed?user_id=${process.env.TWITCH_API_CLIENT_ID}&cursor=${stream_info["pagination"]["cursor"]}`;
      const stream_info = await this.requestTwitchApi(request_url);
      for (let stream of stream_info["data"]) {
        if (stream.user_id == broadcaster_id) {
          return stream.viewer_count;
        }
      }
    }
    return 0;
  }
  
  private async getFollowersByBroadcasterId(broadcaster_id: string): Promise<number> {
    const request_url = `https://api.twitch.tv/helix/follows?to_id=${broadcaster_id}`;
    const follow_info = await this.requestTwitchApi(request_url);
    return follow_info["data"].total;
  }  

  async findOneByNick(nick: string): Promise<Streamer> {
    const streamer = await this.streamerRepository.findOne({ nick: nick });
    if (!streamer) {
      throw new UserInputError('Streamer Nickname Not Found');
    }
    streamer.onAir = await this.getOnAirByBroadcasterId(streamer.streamer_id);
    streamer.viewers = await this.getViewersByBroadcasterId(streamer.streamer_id);
    streamer.followers = await this.getFollowersByBroadcasterId(streamer.streamer_id);
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
