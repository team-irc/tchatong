import { Injectable } from '@nestjs/common';
import { Octokit } from 'octokit';
import { NewIssue } from './new-issue.dto';

@Injectable()
export class AppService {
  async createNewIssue(newIssue: NewIssue) {
    const oc = new Octokit({ auth: process.env.OCTOKIT_AUTH });
    return await oc.rest.issues.create({
      owner: 'team-irc',
      repo: 'twitch-chat-analyzer-config',
      title: `[${newIssue.issueType}] ${newIssue.body.slice(0, 10)}...`,
      body: `
      문의 종류: ${newIssue.issueType}
      작성자 성함: ${newIssue.name}
      작성자 이메일: ${newIssue.email}
      본문: ${newIssue.body}
      `,
    });
  }
}
