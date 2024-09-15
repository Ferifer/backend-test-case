import { Test, TestingModule } from '@nestjs/testing';
import { AlgoritmaController } from './algoritma.controller';
import { AlgoritmaService } from './algoritma.service';

describe('AlgoritmaController', () => {
  let controller: AlgoritmaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlgoritmaController],
      providers: [AlgoritmaService],
    }).compile();

    controller = module.get<AlgoritmaController>(AlgoritmaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
