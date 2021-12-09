import { Test, TestingModule } from '@nestjs/testing';
import { ChatfireService } from './chatfire.service';

describe('ChatfireService', () => {
  let service: ChatfireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatfireService],
    }).compile();

    service = module.get<ChatfireService>(ChatfireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
