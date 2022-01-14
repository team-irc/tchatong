import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { StreamerService } from './streamer.service';
import { Streamer } from '../entities/streamer.entity';
import { StreamerInsertInfoDto } from './dto/insert-info.dto';

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

  @Query((returns) => StreamerInsertInfoDto, {
    name: 'Streamer_getInsertInfoByLoginId',
    description:
      'get streamers infomation to insert database by streamer login id',
  })
  async getInsertInfoByLoginId(
    @Args('streamer_login') streamer_login: string,
  ): Promise<StreamerInsertInfoDto> {
    return await this.streamerService.getInsertInfoByLoginId(streamer_login);
  }

  @Mutation((returns) => [Streamer], {
    name: 'Streamer_deleteOne',
    description: 'delete Streamer field',
  })
  async deleteOne(@Args('streamer_login') streamer_login: string) {
    return this.streamerService.deleteStreamerById(streamer_login);
  }
}
