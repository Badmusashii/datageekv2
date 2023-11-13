import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserdgService } from './userdg.service';
import { CreateUserdgDto } from './dto/create-userdg.dto';
import { UpdateUserdgDto } from './dto/update-userdg.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('userdg')
export class UserdgController {
  constructor(private readonly userdgService: UserdgService) {}

  @Post()
  create(@Body() createUserdgDto: CreateUserdgDto) {
    return this.userdgService.create(createUserdgDto);
  }
  @Post('/validate')
  @UseGuards(AuthGuard('jwt'))
  validateToken() {
    return true;
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

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async remove(@Request() req) {
    const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user.id
    console.log(userId);
    await this.userdgService.remove(userId);
    return { message: `User with ID ${userId} successfully deleted.` };
  }
}
