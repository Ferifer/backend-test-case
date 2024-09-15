import { Inject, Injectable } from '@nestjs/common';
import { BooksEntity } from '../books/entities/book.entity';
import { MembersEntity, statusMember } from '../members/entities/member.entity';
import { Between, Repository } from 'typeorm';

import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { BorrowEntity } from '../borrow/entities/borrow.entity';

@Injectable()
export class CronjobService {
  constructor(
    @Inject('MEMBERS_REPOSITORY')
    private readonly memberRepo: Repository<MembersEntity>,
    @Inject('BOOKS_REPOSITORY')
    private readonly bookRepo: Repository<BooksEntity>,
    @Inject('BORROW_REPOSITORY')
    private readonly borrowRepo: Repository<BorrowEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePenalized() {
    const currentDate = moment();
    const dueDateMonthly = moment(currentDate).subtract(3, 'days');
    const startDate = moment(dueDateMonthly).startOf('day').toDate();
    const endDate = moment(dueDateMonthly).endOf('day').toDate();
    const queryMember = await this.memberRepo.find({
      where: {
        status: statusMember.penalized,
        updatedAt: Between(startDate, endDate),
      },
    });

    const memberIds = queryMember.map((item) => item.id);

    await this.memberRepo
      .createQueryBuilder()
      .update()
      .set({ status: statusMember.active })
      .whereInIds(memberIds)
      .execute();

    console.log('Cronjob Successfully');
  }
}
