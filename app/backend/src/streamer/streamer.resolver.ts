import { Query, Resolver } from '@nestjs/graphql';
import { StreamerService } from './streamer.service';
import { Streamer } from './streamer.entity';

@Resolver()
export class StreamerResolver {
  constructor(private readonly streamerService: StreamerService) {}

  @Query((returns) => [Streamer])
  async streamer(): Promise<Streamer[]> {
    return this.streamerService.getStreamerList();
  }
}
