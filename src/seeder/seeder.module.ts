import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { DatabaseModule } from '../database/database.module';
import { memberProviders } from '../members/members.provider';
import { booksProviders } from '../books/books.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SeederController],
  providers: [SeederService, ...memberProviders, ...booksProviders],
})
export class SeederModule {}
