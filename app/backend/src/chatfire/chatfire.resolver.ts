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

  @Query((returns) => [Chatfire])
  async Chatfire_streamerNick(@Args('nick') nick: string): Promise<Chatfire[]> {
    return this.chatfireService.findOneByNick(nick);
  }
}
