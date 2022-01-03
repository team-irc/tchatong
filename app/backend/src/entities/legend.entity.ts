import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, Timestamp, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Legend {
  @Column('varchar', { length: 32 })
  @Field()
  streamer_login: string;

  @Column('timestamp')
  @Field((type) => Date)
  last_update_date: Date;

  @Column('int')
  @Field((type) => Int)
  chatfire_id: number;

  @PrimaryColumn('int')
  @Field((type) => Int)
  id: number;
}
