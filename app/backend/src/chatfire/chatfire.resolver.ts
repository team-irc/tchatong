import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from './chatfire.entity';

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
}
