import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadataDto } from '../../common/dto/pagination-metadata.dto';
import { MemberDto } from './member.dto';

export class FindAllMembersResponseDto {
  @ApiProperty({
    description: 'Status of the response',
  })
  status: number;

  @ApiProperty({
    description: 'Message describing the response',
  })
  message: string;

  @ApiProperty({
    type: [MemberDto],
    description: 'List of members',
  })
  data: {
    list: MemberDto[];
    metadata: PaginationMetadataDto;
  };
}
