import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Topword {
  constructor() {
    this.id = 0;
    this.streamer_login = '';
    this.date = new Date();
    this.top1 = '';
    this.top2 = '';
    this.top3 = '';
    this.top4 = '';
    this.top5 = '';
    this.top6 = '';
    this.top7 = '';
    this.top8 = '';
    this.top9 = '';
    this.top10 = '';
  }

  @PrimaryColumn('int')
  @Field((type) => Int)
  id: number;

  @Column('varchar', { length: 32 })
  @Field((type) => String)
  streamer_login: string;

  @Column('timestamp')
  @Field((type) => Date)
  date: Date;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top1: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top2: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top3: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top4: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top5: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top6: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top7: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top8: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top9: string;

  @Column('varchar', { length: 16 })
  @Field((type) => String)
  top10: string;
}
