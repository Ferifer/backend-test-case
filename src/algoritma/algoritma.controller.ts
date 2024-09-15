import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlgoritmaService } from './algoritma.service';
import {
  CreateAlgoritma2Dto,
  CreateAlgoritma3Dto,
  CreateAlgoritma4Dto,
  CreateAlgoritmaDto,
} from './dto/create-algoritma.dto';
import { UpdateAlgoritmaDto } from './dto/update-algoritma.dto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Algoritma')
@Controller('algoritma')
export class AlgoritmaController {
  constructor(private readonly algoritmaService: AlgoritmaService) {}

  @Post('questionOne')
  async questionOne(@Body() createAlgoritmaDto: CreateAlgoritmaDto) {
    return this.algoritmaService.questionOne(createAlgoritmaDto);
  }

  @Post('questionTwo')
  async questionTwo(@Body() createAlgoritmaDto: CreateAlgoritma2Dto) {
    return this.algoritmaService.questionTwo(createAlgoritmaDto);
  }

  @Post('questionThree')
  async questionThree(@Body() createAlgoritmaDto: CreateAlgoritma3Dto) {
    return this.algoritmaService.questionThree(createAlgoritmaDto);
  }

  @Post('questionFour')
  async questionFour(@Body() createAlgoritmaDto: CreateAlgoritma4Dto) {
    return this.algoritmaService.questionFour(createAlgoritmaDto);
  }

  @Get()
  @ApiExcludeEndpoint()
  findAll() {
    return this.algoritmaService.findAll();
  }

  @Get(':id')
  @ApiExcludeEndpoint()
  findOne(@Param('id') id: string) {
    return this.algoritmaService.findOne(+id);
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(
    @Param('id') id: string,
    @Body() updateAlgoritmaDto: UpdateAlgoritmaDto,
  ) {
    return this.algoritmaService.update(+id, updateAlgoritmaDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.algoritmaService.remove(+id);
  }
}
