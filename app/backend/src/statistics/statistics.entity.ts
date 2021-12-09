import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Statistics {
  @Field((types) => Int)
  id: number;
  @Field()
  name: string;
  @Field({ nullable: true })
  type?: string;

  constructor(id: number, name: string, type?: string) {
    this.id = id;
    this.name = name;
    this.type = type ?? '';
  }
}
