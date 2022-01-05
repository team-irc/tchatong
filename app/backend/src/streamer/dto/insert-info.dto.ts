import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class StreamerInsertInfoDto {
  @Field()
  streamer_id: string;

  @Field()
  streamer_login: string;

  @Field()
  nick: string;

  @Field()
  image_url: string;
}