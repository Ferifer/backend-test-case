import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @ApiProperty({ example: 'M001' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  password: string;
}
