import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateOneArgs {
  @Field()
  streamer_login: string;
}
