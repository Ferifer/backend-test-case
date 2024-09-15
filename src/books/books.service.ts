import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { BorrowEntity } from '../borrow/entities/borrow.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { GetListBookDto } from './dto/get-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksEntity } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY')
    private readonly bookRepo: Repository<BooksEntity>,
  ) {}

  async findAll(reqDto: GetListBookDto) {
    const page = +reqDto.page || 1;
    const take = +reqDto.per_page || 10;
    const skip = (page - 1) * take;

    const query = this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.borrows', 'borrow')
      .orderBy('book.code', 'ASC');

    if (reqDto.title) {
      query.andWhere('book.title LIKE :title', { title: `%${reqDto.title}%` });
    }

    if (reqDto.author) {
      query.andWhere('book.author LIKE :author', {
        author: `%${reqDto.author}%`,
      });
    }

    const [data, total] = await query.take(take).skip(skip).getManyAndCount();

    const result = data.map((book) => ({
      id: book.id,
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
    }));

    return {
      status: HttpStatus.OK,
      message: 'Success',
      data: {
        list: result,
        metadata: {
          page,
          per_page: take,
          total,
        },
      },
    };
  }
  async createBook(dto: CreateBookDto): Promise<BooksEntity> {
    const book = this.bookRepo.create(dto);
    return await this.bookRepo.save(book);
  }

  async getBookDetail(id: string): Promise<BooksEntity> {
    const data = await this.bookRepo.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('Data Book Not Found');
    }
    return data;
  }

  async updateBook(id: string, dto: UpdateBookDto): Promise<BooksEntity> {
    const data = await this.bookRepo.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('Data Book Not Found');
    }
    await this.bookRepo.update(id, dto);
    return this.getBookDetail(id);
  }

  async deleteBook(id: string): Promise<void> {
    const data = await this.bookRepo.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('Data Book Not Found');
    }
    await this.bookRepo.delete(id);
  }

  async getBorrowHistory(id: string): Promise<BorrowEntity[]> {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: { borrows: { member: true } },
    });
    return book.borrows;
  }
}
