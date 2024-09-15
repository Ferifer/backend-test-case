import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { MoreThan, Repository } from 'typeorm';
import { BooksEntity } from '../books/entities/book.entity';
import { MembersEntity, statusMember } from '../members/entities/member.entity';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { BorrowEntity, statusBorrowEnum } from './entities/borrow.entity';
@Injectable()
export class BorrowService {
  constructor(
    @Inject('MEMBERS_REPOSITORY')
    private readonly memberRepo: Repository<MembersEntity>,
    @Inject('BOOKS_REPOSITORY')
    private readonly bookRepo: Repository<BooksEntity>,
    @Inject('BORROW_REPOSITORY')
    private readonly borrowRepo: Repository<BorrowEntity>,
  ) {}

  async validateMember(userId: string): Promise<MembersEntity> {
    const member = await this.memberRepo.findOne({ where: { id: userId } });

    if (!member) {
      throw new NotFoundException('Member does not exist.');
    }

    if (member.status === statusMember.penalized) {
      throw new ForbiddenException('Member is currently penalized.');
    }

    return member;
  }

  /**
   * Validates if the book exists and has stock available.
   */
  async validateBook(code: string): Promise<BooksEntity> {
    const book = await this.bookRepo.findOne({
      where: { code, stock: MoreThan(0) },
    });

    if (!book) {
      throw new NotFoundException('Book does not exist or is out of stock.');
    }

    return book;
  }

  /**
   * Handles book borrowing logic, ensuring the member and book are valid,
   * and updating the book stock accordingly.
   */
  async createBorrow(userId: string, createBorrowDto: CreateBorrowDto) {
    const member = await this.validateMember(userId);
    const book = await this.validateBook(createBorrowDto.code);

    const newBorrow = this.borrowRepo.create({
      bookId: book.id,
      memberId: member.id,
      borrowedDate: new Date(),
    });

    await this.borrowRepo.save(newBorrow);

    book.stock -= 1;
    await this.bookRepo.save(book);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      data: { id: newBorrow.id },
    };
  }

  /**
   * Handles the return of a borrowed book, including checking penalties
   * and updating the book stock and member's penalty status.
   */
  async createReturn(userId: string, createBorrowingDto: CreateBorrowDto) {
    const member = await this.validateMember(userId);

    const borrowedRecord = await this.borrowRepo.findOne({
      where: {
        memberId: member.id,
        book: { code: createBorrowingDto.code },
      },
      relations: { book: true },
    });

    if (!borrowedRecord) {
      throw new NotFoundException('Borrowed book record not found.');
    }

    const daysBorrowed = moment().diff(
      moment(borrowedRecord.createdAt),
      'days',
    );

    if (daysBorrowed > 7) {
      member.status = statusMember.penalized;
      member.penaltyEndDate = member.penaltyEndDate = moment()
        .add(7, 'days')
        .toDate();
    } else {
      member.status = statusMember.active;
    }

    await this.memberRepo.save(member);

    borrowedRecord.book.stock += 1;
    borrowedRecord.status = statusBorrowEnum.returned;
    borrowedRecord.returnedDate = new Date();

    await this.bookRepo.save(borrowedRecord.book);
    const savedReturn = await this.borrowRepo.save(borrowedRecord);

    return {
      status: HttpStatus.OK,
      message: 'Success',
      data: { id: savedReturn.id },
    };
  }
}
