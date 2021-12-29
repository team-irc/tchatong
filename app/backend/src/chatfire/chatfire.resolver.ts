import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from '../entities/chatfire.entity';
import { Any } from 'typeorm';
import { ChatfireAverage } from 'src/entities/chatfire-average.entity';

@Resolver()
export class ChatfireResolver {
  constructor(private readonly chatfireService: ChatfireService) {}

  @Query((returns) => [Chatfire], {
    name: 'Chatfire_getAll',
    description: 'get all of Chatfire',
  })
  async getAll(): Promise<Chatfire[]> {
    return this.chatfireService.findAll();
  }

  @Query((returns) => [Chatfire], {
    name: 'Chatfire_getOneByNick',
    description: 'get one of Chatfire by streamer nickname',
  })
  async getOneByNick(@Args('nick') nick: string): Promise<Chatfire[]> {
    return this.chatfireService.findOneByNick(nick);
  }

  @Query((returns) => [ChatfireAverage], {
    name: 'Chatfire_getDayAverageByNick',
    description: 'get 24 hour average chatfire',
  })
  async getDayAverageByNick(@Args('nick') streamer_nick: string) {
    return this.chatfireService.getDayAverageByNick(streamer_nick);
  }

  @Query((returns) => Chatfire, {
    name: 'Chatfire_getDayTopByNick',
    description: 'get day top chatfire count by streamer nickname',
  })
  async getDayTopByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<Chatfire> {
    return this.chatfireService.findDayTop(streamer_nick);
  }

  @Query((returns) => Chatfire, {
    name: 'Chatfire_getEntireTopByNick',
    description: 'get entire top chatfire count by streamer nickname',
  })
  async getEntireTopByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<Chatfire> {
    return this.chatfireService.findEntireTop(streamer_nick);
  }

  @Query((returns) => Chatfire, {
    name: 'Chatfire_getCurrentByNick',
    description: 'get current chatfire by streamer nickname',
  })
  async getCurrentByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<Chatfire> {
    return this.chatfireService.getCurrent(streamer_nick);
  }
}
