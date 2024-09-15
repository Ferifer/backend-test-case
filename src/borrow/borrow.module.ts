import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { booksProviders } from '../books/books.provider';
import { DatabaseModule } from '../database/database.module';
import { MembersModule } from '../members/members.module';
import { memberProviders } from '../members/members.provider';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { borrowProviders } from './borrow.provider';

@Module({
  imports: [DatabaseModule, BooksModule, MembersModule],
  controllers: [BorrowController],
  providers: [
    BorrowService,
    ...borrowProviders,
    ...memberProviders,
    ...booksProviders,
  ],
})
export class BorrowModule {}
