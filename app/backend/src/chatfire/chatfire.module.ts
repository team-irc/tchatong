import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatfireResolver } from './chatfire.resolver';
import { ChatfireService } from './chatfire.service';
import { Chatfire } from './chatfire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chatfire])],
  providers: [ChatfireResolver, ChatfireService],
})
export class ChatfireModule {}
