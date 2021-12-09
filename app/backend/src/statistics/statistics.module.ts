import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsResolver } from './statistics.resolver';

@Module({
  providers: [StatisticsService, StatisticsResolver]
})
export class StatisticsModule {}
