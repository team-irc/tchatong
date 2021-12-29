import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChatfireAverage {
  @Field((type) => String)
  time: string;

  @Field((type) => Int)
  count: number;
}
