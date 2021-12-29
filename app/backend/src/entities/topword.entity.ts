import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Topword {
  @PrimaryColumn('int')
  @Field((type) => Int)
  id: number;

  @Column('varchar', { length: 32 })
  @Field((type) => String)
  streamer_id: string;

  @Column('timestamp')
  @Field((type) => Date)
  date: Date;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top1: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top2: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top3: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top4: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top5: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top6: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top7: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top8: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top9: string;

  @Column('varchar', {length: 16})
  @Field((type) => String)
  top10: string;
}
