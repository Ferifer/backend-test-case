import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Unique code for the book',
    example: 'B001',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Title of the book',
    example: 'The Catcher in the Rye',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Author of the book',
    example: 'J.D. Salinger',
    required: true,
  })
  @IsString()
  author: string;

  @ApiProperty({
    description: 'Number of books available in stock',
    example: 10,
    required: true,
  })
  @IsNumber()
  stock: number;
}

export class CreateBookResponseDto {
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
