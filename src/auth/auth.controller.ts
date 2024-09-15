import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignInResponseDto } from './dto/signin-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in a user and return an access token' })
  @ApiResponse({
    status: 200,
    description: 'Successful sign-in',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized if credentials are invalid',
  })
  @Post('login')
  async signIn(@Body() reqDto: SignInDTO) {
    return await this.authService.signIn(reqDto);
  }

  @Get()
  @ApiExcludeEndpoint()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
