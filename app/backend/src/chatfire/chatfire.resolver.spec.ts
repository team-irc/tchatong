import { Test, TestingModule } from '@nestjs/testing';
import { ChatfireResolver } from './chatfire.resolver';

describe('ChatfireResolver', () => {
  let resolver: ChatfireResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatfireResolver],
    }).compile();

    resolver = module.get<ChatfireResolver>(ChatfireResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
