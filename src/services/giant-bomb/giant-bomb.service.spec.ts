import { Test, TestingModule } from '@nestjs/testing';
import { GiantBombService } from './giant-bomb.service';

describe('GiantBombService', () => {
  let service: GiantBombService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiantBombService],
    }).compile();

    service = module.get<GiantBombService>(GiantBombService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
