import { HttpStatus } from '@nestjs/common';

export class ResponseDefaultDto<T> {
  status: number;
  message?: string;
  data: T;
  errors?: string[];
  timestamp: number;

  constructor({
    data,
    status = HttpStatus.OK,
    message = 'Success',
    errors = null,
  }: {
    data: T;
    status?: number;
    message?: string;
    errors?: string[];
  }) {
    this.status = status;
    this.message = message;
    this.data = data;
    if (errors) {
      this.errors = errors;
    }
    this.timestamp = Date.now();
  }
}
