import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { BooksEntity } from '../books/entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { memberProviders } from '../members/members.provider';
import { booksProviders } from '../books/books.provider';
import { DatabaseModule } from '../database/database.module';
import { v4 as uuidv4 } from 'uuid';
import { MembersEntity, statusMember } from '../members/entities/member.entity';
import * as moment from 'moment';
import { BorrowService } from './borrow.service';
import { BorrowEntity, statusBorrowEnum } from './entities/borrow.entity';
import { borrowProviders } from './borrow.provider';
import { CreateBorrowDto } from './dto/create-borrow.dto';

describe('BorrowingService', () => {
  let service: BorrowService;
  let memberRepo: Repository<MembersEntity>;
  let bookRepo: Repository<BooksEntity>;
  let borrowRepo: Repository<BorrowEntity>;

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
        {
          provide: getRepositoryToken(BorrowEntity),
          useClass: Repository,
        },
        ...memberProviders,
        ...booksProviders,
        ...borrowProviders,
      ],
    }).compile();

    service = module.get<BorrowService>(BorrowService);
    memberRepo = module.get<Repository<MembersEntity>>(
      getRepositoryToken(MembersEntity),
    );
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

  const uuid = uuidv4();

  describe('validateMember', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      memberRepo.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.validateMember('user123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is penalized', async () => {
      const mockedUser = { id: uuid, status: statusMember.penalized };
      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      await expect(service.validateMember(uuid)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return user data if user is valid', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      expect(await service.validateMember(uuid)).toEqual(mockedUser);
    });
  });

  describe('validateBook', () => {
    it('should throw NotFoundException if book does not exist', async () => {
      bookRepo.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.validateBook('book456')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if book stock is 0', async () => {
      const mockedBook = { code: 'book456', stock: 0 };
      bookRepo.findOne = jest.fn().mockResolvedValue(mockedBook);
      await expect(service.validateBook('book456')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return book data if book is valid', async () => {
      const mockedBook = { code: 'book456', stock: 1 };
      bookRepo.findOne = jest.fn().mockResolvedValue(mockedBook);
      expect(await service.validateBook('book456')).toEqual(mockedBook);
    });
  });

  describe('create', () => {
    it('should throw ForbiddenException if member already borrowed 2 books', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const mockedBook = { code: 'book456', stock: 1 };
      const dto: CreateBorrowDto = { code: 'book456' };

      borrowRepo.count = jest.fn().mockResolvedValue(2); // Simulate member has 2 books borrowed

      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      bookRepo.findOne = jest.fn().mockResolvedValue(mockedBook);

      await expect(service.createBorrow(uuid, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if book is currently borrowed by another member', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const mockedBook = { code: 'book456', stock: 1 };
      const dto: CreateBorrowDto = { code: 'book456' };

      borrowRepo.findOne = jest.fn().mockResolvedValue({}); // Simulate book is already borrowed

      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      bookRepo.findOne = jest.fn().mockResolvedValue(mockedBook);

      await expect(service.createBorrow(uuid, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should create borrow and return success message', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const mockedBook = { code: 'book456', stock: 1 };
      const dto: CreateBorrowDto = { code: 'book456' };
      const newBorrow = { id: uuid };

      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      bookRepo.findOne = jest.fn().mockResolvedValue(mockedBook);
      borrowRepo.create = jest.fn().mockReturnValue(borrowRepo);
      borrowRepo.save = jest.fn().mockResolvedValue(newBorrow);

      const result = await service.createBorrow(uuid, dto);
      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: { id: uuid },
      });
    });

    it('should decrement book stock by 1', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const mockedBook = { code: 'book456', stock: 1 };
      const dto: CreateBorrowDto = { code: 'book456' };

      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      bookRepo.findOne = jest.fn().mockResolvedValue(mockedBook);
      borrowRepo.create = jest.fn().mockReturnValue(borrowRepo);
      borrowRepo.save = jest.fn();

      await service.createBorrow(uuid, dto);
      expect(mockedBook.stock).toBe(0);
      expect(bookRepo.save).toHaveBeenCalledWith(mockedBook);
    });
  });

  describe('createReturned', () => {
    it('should throw NotFoundException if the book was not borrowed by the user', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const dto: CreateBorrowDto = { code: 'book456' };

      borrowRepo.findOne = jest.fn().mockResolvedValue(null);

      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);

      await expect(service.createReturn(uuid, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should penalize the user if book is returned after more than 7 days', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const mockedBook = { id: 'book456', stock: 0 };
      const dto: CreateBorrowDto = { code: 'book456' };
      const borrow = {
        created_at: moment().subtract(8, 'days').toDate(), // 8 days ago
        status: statusBorrowEnum.active,
        book: mockedBook,
      };

      borrowRepo.findOne = jest.fn().mockResolvedValue(borrow);
      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      memberRepo.save = jest.fn();

      await service.createReturn(uuid, dto);
      expect(mockedUser.status).toBe(statusMember.penalized);
      expect(memberRepo.save).toHaveBeenCalledWith(mockedUser);
    });

    it('should update the book stock and mark borrow as returned', async () => {
      const mockedUser = { id: uuid, status: statusMember.active };
      const mockedBook = { id: 'book456', stock: 0 };
      const dto: CreateBorrowDto = { code: 'book456' };
      const borrow = {
        created_at: moment().subtract(5, 'days').toDate(), // 5 days ago
        status: statusBorrowEnum.active,
        book: mockedBook,
      };

      borrowRepo.findOne = jest.fn().mockResolvedValue(borrow);
      memberRepo.findOne = jest.fn().mockResolvedValue(mockedUser);
      bookRepo.save = jest.fn();
      borrowRepo.save = jest.fn();

      await service.createReturn(uuid, dto);
      expect(mockedBook.stock).toBe(1);
      expect(borrowRepo.save).toHaveBeenCalledWith({
        ...borrow,
        status: statusBorrowEnum.returned,
      });
    });
  });
});
