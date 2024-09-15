import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { check_password } from '../common/util/security';
import { BadRequestExcp } from '../common/exception/bad-request.excp';
import { MembersEntity } from '../members/entities/member.entity';
import { Repository } from 'typeorm';
import { SignInDTO } from './dto/sign-in.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MEMBERS_REPOSITORY')
    private membersRepo: Repository<MembersEntity>,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}
  async signIn(reqDto: SignInDTO) {
    const { code, password } = reqDto;

    const checkCode = await this.membersRepo.findOneBy({
      code,
    });

    if (!checkCode) {
      throw new BadRequestExcp('Code not found');
    }

    const checkPassword = await check_password(password, checkCode.password);

    if (!checkPassword) {
      throw new BadRequestExcp('Password wrong');
    }

    // Success Login

    const access_token = this.jwtService.sign({
      id: checkCode.id,
    });

    const data = {
      id: checkCode.id,
      code: checkCode.code,
      name: checkCode.name,
      access_token,
    };

    return {
      status: 200,
      message: 'signin success',
      data,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
