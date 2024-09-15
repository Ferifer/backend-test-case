import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { RequestPaginationDto } from '../../common/dto/pagination.dto';

export class GetListBookDto extends RequestPaginationDto {
  @ApiPropertyOptional({
    description: 'Filter books by title',
    example: 'The Great Gatsby',
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter books by author',
    example: 'F. Scott Fitzgerald',
  })
  @IsOptional()
  author?: string;
}
