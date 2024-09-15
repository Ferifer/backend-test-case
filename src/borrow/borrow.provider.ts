import { DataSource } from 'typeorm';
import { BorrowEntity } from './entities/borrow.entity';

export const borrowProviders = [
  {
    provide: 'BORROW_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BorrowEntity),
    inject: ['DATA_SOURCE'],
  },
];
