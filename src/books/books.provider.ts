import { DataSource } from 'typeorm';
import { BooksEntity } from './entities/book.entity';

export const booksProviders = [
    {
        provide: 'BOOKS_REPOSITORY',
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(BooksEntity),
        inject: ['DATA_SOURCE'],
    }
];