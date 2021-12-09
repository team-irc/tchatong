import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, Timestamp, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Chatfire {
  @Column('varchar', { length: 32 })
  @Field()
  streamer_id: string;

  @Column('timestamp')
  @Field((type) => Date)
  date: Date;

  @Column('int')
  @Field((type) => Int)
  count: number;

  @PrimaryColumn('int')
  @Field((type) => Int)
  id: number;
}
