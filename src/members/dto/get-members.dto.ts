import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestPaginationDto } from '../../common/dto/pagination.dto';

export class GetListMemberDto extends RequestPaginationDto {
  @ApiPropertyOptional({
    description: 'Filter members by code',
    example: 'MEM123',
  })
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Filter members by name',
    example: 'John Doe',
  })
  @IsOptional()
  name?: string;
}
