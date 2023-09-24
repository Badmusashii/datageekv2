import { Injectable } from '@nestjs/common';
import { CreateUserdgDto } from './dto/create-userdg.dto';
import { UpdateUserdgDto } from './dto/update-userdg.dto';

@Injectable()
export class UserdgService {
  create(createUserdgDto: CreateUserdgDto) {
    return 'This action adds a new userdg';
  }

  findAll() {
    return `This action returns all userdg`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userdg`;
  }

  update(id: number, updateUserdgDto: UpdateUserdgDto) {
    return `This action updates a #${id} userdg`;
  }

  remove(id: number) {
    return `This action removes a #${id} userdg`;
  }
}
