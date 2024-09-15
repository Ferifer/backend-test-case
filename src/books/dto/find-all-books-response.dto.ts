import { ApiProperty } from '@nestjs/swagger';

import { BookDto } from './book.dto';
import { PaginationMetadataDto } from '../../common/dto/pagination-metadata.dto';

export class FindAllBooksResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: number;

  @ApiProperty({ description: 'Message describing the response' })
  message: string;

  @ApiProperty({ type: [BookDto], description: 'List of books' })
  data: {
    list: BookDto[];
    metadata: PaginationMetadataDto;
  };
}
