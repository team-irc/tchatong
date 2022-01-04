import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from '../entities/chatfire.entity';
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
    name: 'Chatfire_getAverageOfaMinuteIntervalsForOneDayByNick',
    description: 'get Average of 1 minute intervals for a day',
  })
  async getAverageOfaMinuteIntervalsByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<ChatfireAverage[]> {
    return this.chatfireService.getAverageOfIntervals(streamer_nick, 1);
  }

  @Query((returns) => [ChatfireAverage], {
    name: 'Chatfire_getAverageOfFiveMinuteIntervalsForOneDayByNick',
    description: 'get Average of 5 minute intervals for a day',
  })
  async getAverageOfFiveMinuteIntervalsByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<ChatfireAverage[]> {
    return this.chatfireService.getAverageOfIntervals(streamer_nick, 5);
  }

  @Query((returns) => [ChatfireAverage], {
    name: 'Chatfire_getAverageOfTenMinuteIntervalsForOneDayByNick',
    description: 'get Average of 10 minute intervals for a day',
  })
  async getAverageOfTenMinuteIntervalsByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<ChatfireAverage[]> {
    return this.chatfireService.getAverageOfIntervals(streamer_nick, 10);
  }

  @Query((returns) => [ChatfireAverage], {
    name: 'Chatfire_getAverageOfOneHourIntervalsForOneDayByNick',
    description: 'get Average of 1 hour intervals for a day',
  })
  async getAverageOfHalfHourIntervalsByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<ChatfireAverage[]> {
    return this.chatfireService.getAverageOfIntervals(streamer_nick, 30);
  }

  @Query((returns) => [ChatfireAverage], {
    name: 'Chatfire_getAverageOfOneHourIntervalsForOneDayByNick',
    description: 'get Average of 1 hour intervals for a day',
  })
  async getAverageOfOneHourIntervalsByNick(
    @Args('nick') streamer_nick: string,
  ): Promise<ChatfireAverage[]> {
    return this.chatfireService.getAverageOfIntervals(streamer_nick, 60);
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
