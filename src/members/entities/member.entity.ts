import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BorrowEntity } from '../../borrow/entities/borrow.entity';

export enum statusMember {
  penalized = 'penalized',
  active = 'active',
}

@Entity('members')
export class MembersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'memberId_pk',
  })
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 10,
  })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ default: 0 })
  borrowedBooksCount: number;

  @Column({
    type: 'enum',
    enum: statusMember,
    default: statusMember.active,
  })
  status: statusMember;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'date', nullable: true })
  penaltyEndDate: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  // relation
  @OneToMany(() => BorrowEntity, (borrow) => borrow.member)
  borrows?: BorrowEntity[];
}
