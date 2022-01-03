import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, Timestamp, PrimaryColumn } from 'typeorm';
import { Streamer } from './streamer.entity';

@ObjectType()
@Entity()
export class Chatfire {
  @Column('varchar', { length: 32 })
  @Field()
  streamer_login: string;

  @Column('timestamp')
  @Field((type) => Date)
  date: Date;

  @Column('int')
  @Field((type) => Int)
  count: number;

  @PrimaryColumn('int')
  @Field((type) => Int)
  id: number;

  @Field((type) => Streamer)
  streamer: Streamer;
}
