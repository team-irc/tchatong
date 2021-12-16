import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { StreamerService } from './streamer.service';
import { Streamer } from './streamer.entity';
import { CreateOneArgs } from './dto/create-one.args';

@Resolver()
export class StreamerResolver {
  constructor(private readonly streamerService: StreamerService) {}

  @Query((returns) => [Streamer], {
    name: 'Streamer_getAll',
    description: 'get all of Streamer',
  })
  async getAll(): Promise<Streamer[]> {
    return this.streamerService.findAll();
  }

  @Query((returns) => Streamer, {
    name: 'Streamer_getOneByNick',
    description: 'get one of Streamer by streamer nickname',
  })
  async getOneByNick(@Args('nick') nick: string): Promise<Streamer> {
    return this.streamerService.findOneByNick(nick);
  }

  @Mutation((returns) => Streamer, {
    name: 'Streamer_createOne',
    description: 'add Streamer field',
  })
  async createOne(@Args() streamerInfo: CreateOneArgs) {
    return this.streamerService.addNewStreamer({
      id: 0,
      ...streamerInfo,
    });
  }

  @Mutation((returns) => [Streamer], {
    name: 'Streamer_deleteOne',
    description: 'delete Streamer field',
  })
  async deleteOne(@Args('streamer_id') streamer_id: string) {
    return this.streamerService.deleteStreamerById(streamer_id);
  }
}
