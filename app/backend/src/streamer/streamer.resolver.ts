import { Args, Query, Resolver } from '@nestjs/graphql';
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
}
