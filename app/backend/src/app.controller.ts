import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NewIssue } from './new-issue.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/issue')
  async newIssue(@Body() newIssue: NewIssue) {
    return await this.appService.createNewIssue(newIssue);
  }
}
