import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestExcp extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST);
  }
}
