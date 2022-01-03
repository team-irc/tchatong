import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Streamer {
  @PrimaryColumn('int')
  @Field((type) => Int)
  id: number;

  @Column('varchar', { length: 32 })
  @Field()
  streamer_id: string;

  @Column('varchar', { length: 32 })
  @Field()
  streamer_login: string;

  @Column('varchar', { length: 32 })
  @Field()
  nick: string;

  @Column('varchar', { length: 256 })
  @Field()
  image_url: string;
}
