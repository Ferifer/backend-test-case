import { IsOptional } from 'class-validator';

interface Pagination<T> {
  list: T[];
  metadata: {
    page: number;
    per_page: number;
    total_page?: number;
    total: number;
  };
}

export class RequestPaginationDto {
  @IsOptional()
  per_page?: number = 10;

  @IsOptional()
  page?: number = 1;
}

export class ResponsePaginationDto<T> {
  readonly list: T[];
  readonly per_page: number;
  readonly page: number;
  readonly total_page: number;
  readonly total: number;

  constructor(pagination: Pagination<T>) {
    const { list, metadata } = pagination;

    this.list = list;
    this.page = metadata.page ?? 0;
    this.per_page = metadata.per_page ?? 0;
    this.total = metadata.total ?? 0;
    if (metadata.total > 0 && metadata.per_page > 0) {
      this.total_page = Math.ceil(metadata.total / metadata.per_page);
    } else {
      this.total_page = metadata.total_page ?? 0;
    }
  }
}
