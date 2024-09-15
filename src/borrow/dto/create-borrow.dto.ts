import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBorrowDto {
  @ApiProperty({ description: 'Code Book' })
  @IsNotEmpty()
  code: string;
}
