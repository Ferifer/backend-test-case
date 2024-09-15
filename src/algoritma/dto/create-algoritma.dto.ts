import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAlgoritmaDto {
  @ApiProperty({ example: 'EIGEN1' })
  @IsNotEmpty()
  input_word: string;
}

export class CreateAlgoritma2Dto {
  @ApiProperty({ example: 'Saya sangat senang mengerjakan soal algoritma' })
  @IsNotEmpty()
  input_sentence: string;
}

export class CreateAlgoritma3Dto {
  @ApiProperty({ example: ['xc', 'dz', 'bbb', 'dz'] })
  @IsNotEmpty()
  input: string[];
  @ApiProperty({ example: ['bbb', 'ac', 'dz'] })
  query: string[];
}

export class CreateAlgoritma4Dto {
  @ApiProperty({
    example: [
      [1, 2, 0],
      [4, 5, 6],
      [7, 8, 9],
    ],
  })
  @IsNotEmpty()
  matrix: number[][];
}
