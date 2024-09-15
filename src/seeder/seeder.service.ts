import { Inject, Injectable } from '@nestjs/common';
import { BooksEntity } from '../books/entities/book.entity';
import { generate_password } from '../common/util/security';
import { MembersEntity } from '../members/entities/member.entity';
import { Repository } from 'typeorm';
import { UpdateSeederDto } from './dto/update-seeder.dto';

@Injectable()
export class SeederService {
  constructor(
    @Inject('BOOKS_REPOSITORY')
    private readonly bookRepo: Repository<BooksEntity>,
    @Inject('MEMBERS_REPOSITORY')
    private membersRepo: Repository<MembersEntity>,
  ) {}
  async createSeederBooks() {
    const booksValue = [
      {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
      },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 1,
      },
      {
        code: 'TW-11',
        title: 'Twilight',
        author: 'Stephenie Meyer',
        stock: 1,
      },
      {
        code: 'HOB-83',
        title: 'The Hobbit, or There and Back Again',
        author: 'J.R.R. Tolkien',
        stock: 1,
      },
      {
        code: 'NRN-7',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        stock: 1,
      },
    ];

    const createBooks = await this.bookRepo
      .createQueryBuilder()
      .insert()
      .values(booksValue)
      .execute();

    return {
      status: 200,
      message: 'Successfully Create Book Data',
      data: createBooks,
    };
  }

  async createSeederMember() {
    const generatePassword = await generate_password('12345');

    const membersValue = [
      {
        code: 'M001',
        name: 'Angga',
        password: generatePassword,
      },
      {
        code: 'M002',
        name: 'Ferry',
        password: generatePassword,
      },
      {
        code: 'M003',
        name: 'Putri',
        password: generatePassword,
      },
    ];

    const createMember = await this.membersRepo
      .createQueryBuilder()
      .insert()
      .values(membersValue)
      .execute();

    return {
      status: 200,
      message: 'Successfully Create Member Data',
      data: createMember,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} seeder`;
  }

  update(id: number, updateSeederDto: UpdateSeederDto) {
    return `This action updates a #${id} seeder`;
  }

  remove(id: number) {
    return `This action removes a #${id} seeder`;
  }
}
