import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BooksEntity } from '../../books/entities/book.entity';
import { MembersEntity } from '../../members/entities/member.entity';

export enum statusBorrowEnum {
  active = 'active',
  returned = 'returned',
}

@Entity('borrow')
export class BorrowEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'borrowingId_pk',
  })
  id: string;

  @Column({
    type: 'enum',
    enum: statusBorrowEnum,
    default: statusBorrowEnum.active,
  })
  status: statusBorrowEnum;

  @Column({ type: 'uuid', nullable: true })
  memberId: string;

  @Column({ type: 'uuid', nullable: true })
  bookId: string;

  @Column({ type: 'date' })
  borrowedDate: Date;

  @Column({ type: 'date', nullable: true })
  returnedDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  //relation
  @ManyToOne(() => MembersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId', referencedColumnName: 'id' })
  member: MembersEntity;

  @ManyToOne(() => BooksEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId', referencedColumnName: 'id' })
  book: BooksEntity;
}
