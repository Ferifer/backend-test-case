import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { memberProviders } from '../members/members.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, ...memberProviders],
})
export class AuthModule {}
