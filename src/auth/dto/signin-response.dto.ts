import { ApiProperty } from '@nestjs/swagger';

export class SignInDataDto {
  @ApiProperty({
    example: 'f0ea892e-5979-46f8-b934-49dc8ab1c7e8',
    description: 'The unique identifier of the user (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'M001',
    description: 'The unique code associated with the user',
  })
  code: string;

  @ApiProperty({
    example: 'Angga',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZWE4OTJlLTU5NzktNDZmOC1iOTM0LTQ5ZGM4YWIxYzdlOCIsImlhdCI6MTcyNjIwNzgzMSwiZXhwIjoxNzI2MjM2NjMxfQ.WnNC3PQ8pRwRhOYj7nmlduRf5JkRgb0B2nGr5kXEzYc',
    description: 'The JWT access token issued upon successful sign-in',
  })
  access_token: string;
}

export class SignInResponseDto {
  @ApiProperty({
    example: 200,
    description: 'The HTTP status code of the response',
  })
  status: number;

  @ApiProperty({
    example: 'signin success',
    description: 'A message describing the result of the sign-in attempt',
  })
  message: string;

  @ApiProperty({
    description: 'Data related to the sign-in response',
    type: SignInDataDto,
  })
  data: SignInDataDto;
}
