import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiPropertyOptional({ description: 'Book code', example: 'B0012' })
  code?: string;

  @ApiPropertyOptional({
    description: 'Title of the book',
    example: 'The Catcher in the Rye V1',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Author of the book',
    example: 'J.D. Salinger',
  })
  author?: string;

  @ApiPropertyOptional({ description: 'Number of books in stock', example: 11 })
  stock?: number;
}

export class UpdateBookResponseDto {
  @ApiProperty({ example: 'B0012', description: 'Book code' })
  code: string;

  @ApiProperty({
    example: 'The Catcher in the Rye V1',
    description: 'Title of the book',
  })
  title: string;

  @ApiProperty({ example: 'J.D. Salinger', description: 'Author of the book' })
  author: string;

  @ApiProperty({ example: 11, description: 'Number of books in stock' })
  stock: number;

  @ApiProperty({
    example: 'ce8c59c1-3707-4432-9fbc-641f3ae0743d',
    description: 'Unique identifier for the book',
  })
  id: string;
}
