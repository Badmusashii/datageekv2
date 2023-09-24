import { Test, TestingModule } from '@nestjs/testing';
import { UserdgService } from './userdg.service';

describe('UserdgService', () => {
  let service: UserdgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserdgService],
    }).compile();

    service = module.get<UserdgService>(UserdgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
