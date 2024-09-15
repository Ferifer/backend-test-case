import { PartialType } from '@nestjs/swagger';
import { CreateCronjobDto } from './create-cronjob.dto';

export class UpdateCronjobDto extends PartialType(CreateCronjobDto) {}
