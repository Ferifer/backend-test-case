import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { CronjobController } from './cronjob.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';
import { memberProviders } from '../members/members.provider';
import { booksProviders } from '../books/books.provider';
import { borrowProviders } from '../borrow/borrow.provider';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  controllers: [CronjobController],
  providers: [
    CronjobService,
    ...memberProviders,
    ...booksProviders,
    ...borrowProviders,
  ],
})
export class CronjobModule {}
