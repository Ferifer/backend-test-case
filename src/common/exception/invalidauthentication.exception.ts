import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidAuthenticationException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.UNAUTHORIZED);
  }
}
