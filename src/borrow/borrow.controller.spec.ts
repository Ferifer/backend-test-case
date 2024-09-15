import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { booksProviders } from '../books/books.provider';
import { BooksEntity } from '../books/entities/book.entity';
import { DatabaseModule } from '../database/database.module';

import { memberProviders } from '../members/members.provider';

import { MembersEntity } from '../members/entities/member.entity';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { borrowProviders } from './borrow.provider';
import { CreateBorrowDto } from './dto/create-borrow.dto';

describe('BorrowController', () => {
  let controller: BorrowController;
  let service: BorrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        BorrowService,
        {
          provide: getRepositoryToken(MembersEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BooksEntity),
          useClass: Repository,
        },
        ...memberProviders,
        ...booksProviders,
        ...borrowProviders,
      ],
    }).compile();

    controller = module.get<BorrowController>(BorrowController);
    service = module.get<BorrowService>(BorrowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it.skip('should create borrowing successfully', async () => {
      const userId = 'user001';
      const dto: CreateBorrowDto = { code: 'Code1' };
      const expectedResult = {
        status: 200,
        message: 'Success',
        data: { id: 'borrowingId' },
      };
      jest.spyOn(service, 'createBorrow').mockResolvedValueOnce(expectedResult);

      const result = await controller.create(userId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.createBorrow).toHaveBeenCalledWith(userId, dto);
    });
  });
});
