import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksEntity } from './entities/book.entity';
import { BorrowEntity } from '../borrow/entities/borrow.entity';
import { HttpStatus } from '@nestjs/common';
import { GetListBookDto } from './dto/get-book.dto';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const books = [
  {
    id: uuidv4(),
    code: 'B001',
    title: 'Book One',
    author: 'Author One',
    stock: 10,
  },
  {
    id: uuidv4(),
    code: 'B002',
    title: 'Book Two',
    author: 'Author Two',
    stock: 5,
  },
];

const borrowedBooks = [{ book_id: books[0].id }];

describe('BooksService', () => {
  let service: BooksService;
  let bookRepo: Repository<BooksEntity>;
  let borrowRepo: Repository<BorrowEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(BooksEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BorrowEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepo = module.get<Repository<BooksEntity>>(
      getRepositoryToken(BooksEntity),
    );
    borrowRepo = module.get<Repository<BorrowEntity>>(
      getRepositoryToken(BorrowEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all books excluding borrowed ones with correct stock count', async () => {
      const reqDto: GetListBookDto = { title: '', page: 1, per_page: 10 };

      (borrowRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(borrowedBooks),
      });

      (bookRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([books.slice(1), 1]), // Excluding the borrowed book
      });

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: [
            {
              id: books[1].id,
              code: 'B002',
              title: 'Book Two',
              author: 'Author Two',
              stock: 5,
            },
          ],
          metadata: {
            page: 1,
            per_page: 10,
            total: 1,
          },
        },
      });
    });

    it('should handle no borrowed books', async () => {
      const reqDto: GetListBookDto = { title: '', page: 1, per_page: 10 };

      (borrowRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      });

      (bookRepo.createQueryBuilder as jest.Mock).mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([books, books.length]),
      });

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: books,
          metadata: {
            page: 1,
            per_page: 10,
            total: 2,
          },
        },
      });
    });
  });
});
