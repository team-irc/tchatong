import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { StreamerService } from './streamer.service';
import { Streamer } from './streamer.entity';

@Resolver()
export class StreamerResolver {
  constructor(private readonly streamerService: StreamerService) {}

  @Query((returns) => [Streamer])
  async Streamer_all(): Promise<Streamer[]> {
    return this.streamerService.findAll();
  }

  @Query((returns) => Streamer)
  async Streamer_nick(@Args('nick') nick: string): Promise<Streamer> {
    return this.streamerService.findOneByNick(nick);
  }

  @Mutation((returns) => Streamer)
  async Streamer_new(
    @Args('streamer_id') streamer_id: string,
    @Args('nick') nick: string,
    @Args('image_url') image_url: string,
  ) {
    return this.streamerService.addNewStreamer({
      id: 0,
      streamer_id,
      nick,
      image_url,
    });
  }

  @Mutation((returns) => [Streamer])
  async Streamer_delete(@Args('streamer_id') streamer_id: string) {
    return this.streamerService.deleteStreamerById(streamer_id);
  }
}
