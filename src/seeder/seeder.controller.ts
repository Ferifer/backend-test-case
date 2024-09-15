import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/book')
  async createSeederBook() {
    return this.seederService.createSeederBooks();
  }

  @Post('/member')
  async createSeederMember() {
    return this.seederService.createSeederMember();
  }
}
