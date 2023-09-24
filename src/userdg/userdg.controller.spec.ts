import { Test, TestingModule } from '@nestjs/testing';
import { UserdgController } from './userdg.controller';
import { UserdgService } from './userdg.service';

describe('UserdgController', () => {
  let controller: UserdgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserdgController],
      providers: [UserdgService],
    }).compile();

    controller = module.get<UserdgController>(UserdgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
