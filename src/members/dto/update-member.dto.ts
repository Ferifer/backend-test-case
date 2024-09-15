import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty({
    example: 'John Updated',
    description: 'Updated name of the member',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 1,
    description: 'Number of borrowed books',
    required: false,
  })
  borrowedBooksCount?: number;

  @ApiProperty({
    example: 'active',
    description: 'Status of the member',
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: '2024-09-20',
    description: 'Penalty end date if the member is penalized',
    required: false,
  })
  penaltyEndDate?: Date;
}
