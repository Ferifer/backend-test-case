import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the book (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'ABC123',
    description: 'The unique code of the book',
  })
  code: string;

  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'The title of the book',
  })
  title: string;

  @ApiProperty({
    example: 'F. Scott Fitzgerald',
    description: 'The author of the book',
  })
  author: string;

  @ApiProperty({
    example: 5,
    description: 'The number of copies in stock',
  })
  stock: number;
}
