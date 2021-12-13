import { Test, TestingModule } from '@nestjs/testing';
import { StreamerService } from './streamer.service';

describe('StreamerService', () => {
  let service: StreamerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamerService],
    }).compile();

    service = module.get<StreamerService>(StreamerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
