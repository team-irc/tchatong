import { Injectable } from '@nestjs/common';
import { Statistics } from './statistics.entity';

@Injectable()
export class StatisticsService {
  private readonly data: Statistics[] = [
    new Statistics(1, 'asdf', 'dog'),
    new Statistics(2, 'hello'),
    new Statistics(3, 'world'),
  ];

  async findAll(): Promise<Statistics[]> {
    return this.data;
  }

  async findOneById(id: number): Promise<Statistics> {
    return this.data.find((ele) => ele.id === id);
  }
}
