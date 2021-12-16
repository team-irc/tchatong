import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateOneArgs {
  @Field()
  streamer_id: string;

  @Field()
  nick: string;

  @Field()
  image_url: string;
}
