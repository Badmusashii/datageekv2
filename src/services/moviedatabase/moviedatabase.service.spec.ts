import { Test, TestingModule } from '@nestjs/testing';
import { MoviedatabaseService } from './moviedatabase.service';

describe('MoviedatabaseService', () => {
  let service: MoviedatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviedatabaseService],
    }).compile();

    service = module.get<MoviedatabaseService>(MoviedatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
