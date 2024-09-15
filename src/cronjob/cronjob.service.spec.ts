import { Test, TestingModule } from '@nestjs/testing';
import { CronjobService } from './cronjob.service';
import { memberProviders } from '../members/members.provider';
import { borrowProviders } from '../borrow/borrow.provider';
import { booksProviders } from '../books/books.provider';

describe('CronjobService', () => {
  let service: CronjobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronjobService,
        ...memberProviders,
        ...borrowProviders,
        ...booksProviders,
      ],
    }).compile();

    service = module.get<CronjobService>(CronjobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
