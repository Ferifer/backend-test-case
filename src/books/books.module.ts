import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { booksProviders } from './books.provider';
import { DatabaseModule } from '../database/database.module';
import { borrowProviders } from '../borrow/borrow.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [BooksController],
  providers: [BooksService, ...booksProviders, ...borrowProviders],
})
export class BooksModule {}
