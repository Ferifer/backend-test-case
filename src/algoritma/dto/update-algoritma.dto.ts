import { PartialType } from '@nestjs/swagger';
import { CreateAlgoritmaDto } from './create-algoritma.dto';

export class UpdateAlgoritmaDto extends PartialType(CreateAlgoritmaDto) {}
