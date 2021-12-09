import { Query } from '@nestjs/graphql';
import { Resolver, Args, Int } from '@nestjs/graphql';
import { Statistics } from './statistics.entity';
import { StatisticsService } from './statistics.service';

@Resolver()
export class StatisticsResolver {
  constructor(private statisticsService: StatisticsService) {}

  @Query((returns) => [Statistics])
  async statisticsAll(): Promise<Statistics[]> {
    return this.statisticsService.findAll();
  }

  @Query((returns) => Statistics)
  async statisticsOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Statistics> {
    return this.statisticsService.findOneById(id);
  }
}
