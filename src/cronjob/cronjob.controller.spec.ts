import { Test, TestingModule } from '@nestjs/testing';
import { CronjobController } from './cronjob.controller';
import { CronjobService } from './cronjob.service';
import { memberProviders } from '../members/members.provider';
import { booksProviders } from '../books/books.provider';
import { borrowProviders } from '../borrow/borrow.provider';

describe('CronjobController', () => {
  let controller: CronjobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronjobController],
      providers: [
        CronjobService,
        ...memberProviders,
        ...booksProviders,
        ...borrowProviders,
      ],
    }).compile();

    controller = module.get<CronjobController>(CronjobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
