import { ApiProperty } from '@nestjs/swagger';

export class MemberDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the member (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'MEM123',
    description: 'The unique code of the member',
  })
  code: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the member',
  })
  name: string;

  @ApiProperty({
    example: 3,
    description: 'The total number of books borrowed by the member',
  })
  total_borrowed_books: number;
}
