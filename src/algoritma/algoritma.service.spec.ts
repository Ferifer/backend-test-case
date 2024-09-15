import { Test, TestingModule } from '@nestjs/testing';
import { AlgoritmaService } from './algoritma.service';

describe('AlgoritmaService', () => {
  let service: AlgoritmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlgoritmaService],
    }).compile();

    service = module.get<AlgoritmaService>(AlgoritmaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
