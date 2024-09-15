import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';

import { GetListMemberDto } from './dto/get-members.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersEntity } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { generate_password } from '../common/util/security';

@Injectable()
export class MembersService {
  constructor(
    @Inject('MEMBERS_REPOSITORY')
    private readonly memberRepo: Repository<MembersEntity>,
  ) {}

  async findAll(reqDto: GetListMemberDto) {
    const page = +reqDto.page || 1;
    const take = +reqDto.per_page || 10;
    const skip = (page - 1) * take;

    const queryOptions: any = {
      // where:{
      //   stock: MoreThan(0)
      // },
      relations: {
        borrows: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        borrows: {
          id: true,
        },
      },
      order: {
        code: 'ASC',
      },
    };

    if (reqDto.name) {
      queryOptions.where = {
        name: ILike(`%${reqDto.name}%`),
      };
    }

    if (reqDto.code) {
      queryOptions.where = {
        code: reqDto.code,
      };
    }

    const [data, total] = await this.memberRepo.findAndCount({
      ...queryOptions,
      take,
      skip,
    });

    const result = data.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      total_borrowed_books: item.borrows.length,
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

  async createMember(createMemberDto: CreateMemberDto): Promise<MembersEntity> {
    const generatedPassword = await generate_password(createMemberDto.password);
    const newMember = this.memberRepo.create({
      ...createMemberDto,
      password: generatedPassword,
    });
    return await this.memberRepo.save(newMember);
  }

  async getMemberById(id: string): Promise<MembersEntity> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async updateMember(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MembersEntity> {
    const member = await this.getMemberById(id);
    Object.assign(member, updateMemberDto);
    return await this.memberRepo.save(member);
  }

  async deleteMember(id: string): Promise<void> {
    const member = await this.getMemberById(id);
    await this.memberRepo.softDelete(member.id);
  }
}
