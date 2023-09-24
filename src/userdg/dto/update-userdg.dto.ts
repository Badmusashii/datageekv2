import { PartialType } from '@nestjs/swagger';
import { CreateUserdgDto } from './create-userdg.dto';

export class UpdateUserdgDto extends PartialType(CreateUserdgDto) {}
