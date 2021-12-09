import { Query, Resolver } from '@nestjs/graphql';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from './chatfire.entity';

@Resolver()
export class ChatfireResolver {
  constructor(private readonly chatfireService: ChatfireService) {}

  @Query((returns) => [Chatfire])
  async chatfire(): Promise<Chatfire[]> {
    console.log('resolver');
    return this.chatfireService.getStreamerId();
  }
}
