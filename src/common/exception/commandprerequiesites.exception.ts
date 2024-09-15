import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

export class CommandPrerequisitesException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
