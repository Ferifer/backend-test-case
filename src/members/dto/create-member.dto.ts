import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ example: 'M001', description: 'Unique member code' })
  code: string;

  @ApiProperty({ example: 'John Doe', description: 'Member name' })
  name: string;

  @ApiProperty({ example: 'password123', description: 'Member password' })
  password: string;
}
