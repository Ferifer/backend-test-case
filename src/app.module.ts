import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AlgoritmaModule } from './algoritma/algoritma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { BorrowModule } from './borrow/borrow.module';
import { AllExceptionFilter } from './common/filter/allexception.filter';
import { CronjobModule } from './cronjob/cronjob.module';
import { GlobalModule } from './global/global.module';
import { MembersModule } from './members/members.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    GlobalModule,
    BooksModule,
    MembersModule,
    BorrowModule,
    SeederModule,
    AuthModule,
    CronjobModule,
    AlgoritmaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
