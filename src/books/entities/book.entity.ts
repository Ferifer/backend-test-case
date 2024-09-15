import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BorrowEntity } from '../../borrow/entities/borrow.entity';

@Entity('books')
export class BooksEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    primaryKeyConstraintName: 'bookId_pk',
  })
  id: string;

  @Column({ unique: true, type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'integer' })
  stock: number;

  //Relation
  @OneToMany(() => BorrowEntity, (borrow) => borrow.book)
  borrows: BorrowEntity[];
}
