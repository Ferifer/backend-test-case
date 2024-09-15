import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { DatabaseModule } from '../database/database.module';
import { memberProviders } from './members.provider';
import { borrowProviders } from '../borrow/borrow.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [MembersController],
  providers: [MembersService, ...memberProviders, ...borrowProviders],
})
export class MembersModule {}
