import { Test, TestingModule } from '@nestjs/testing';
import { CertGenerateService } from './cert-generate.service';

describe('CertGenerateService', () => {
  let service: CertGenerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertGenerateService],
    }).compile();

    service = module.get<CertGenerateService>(CertGenerateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
