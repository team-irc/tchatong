import { Args, Query, Resolver } from '@nestjs/graphql';
import { TopwordService } from './topword.service';
import { Topword } from '../entities/topword.entity';

@Resolver()
export class TopwordResolver {
  constructor(private readonly topwordService: TopwordService) {}

  @Query((returns) => Topword, {
    name: 'Topword_getTopwordByNick',
    description: 'get Top 10 words by streamer nick',
  })
  async getTopwordByNick(@Args('nick') nick: string): Promise<Topword> {
    return this.topwordService.findTopword(nick);
  }
}