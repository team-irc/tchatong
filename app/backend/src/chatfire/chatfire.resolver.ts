import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from './chatfire.entity';

@Resolver()
export class ChatfireResolver {
  constructor(private readonly chatfireService: ChatfireService) {}

  @Query((returns) => [Chatfire])
  async Chatfire_all(): Promise<Chatfire[]> {
    return this.chatfireService.findAll();
  }

  /*
   @brief 스트리머별 분당 채팅 수
  */
  @Query((returns) => [Chatfire])
  async Chatfire_streamerNick(@Args('nick') nick: string): Promise<Chatfire[]> {
    return this.chatfireService.findOneByNick(nick);
  }

  @Query((returns) => Chatfire)
  async Chatfire_dayTop(@Args('streamer_id') streamer_id: string): Promise<Chatfire> {
    return this.chatfireService.findDayTop(streamer_id);
  }
}
