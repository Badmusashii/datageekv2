import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserdgService } from './userdg.service';
import { CreateUserdgDto } from './dto/create-userdg.dto';
import { UpdateUserdgDto } from './dto/update-userdg.dto';

@Controller('userdg')
export class UserdgController {
  constructor(private readonly userdgService: UserdgService) {}

  @Post()
  create(@Body() createUserdgDto: CreateUserdgDto) {
    return this.userdgService.create(createUserdgDto);
  }

  @Get()
  findAll() {
    return this.userdgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userdgService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserdgDto: UpdateUserdgDto) {
    return this.userdgService.update(+id, updateUserdgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userdgService.remove(+id);
  }
}
