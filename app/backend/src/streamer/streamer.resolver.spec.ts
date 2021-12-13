import { Test, TestingModule } from '@nestjs/testing';
import { StreamerResolver } from './streamer.resolver';

describe('StreamerResolver', () => {
  let resolver: StreamerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamerResolver],
    }).compile();

    resolver = module.get<StreamerResolver>(StreamerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
