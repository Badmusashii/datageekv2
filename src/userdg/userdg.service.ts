import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserdgDto } from './dto/create-userdg.dto';
import { UpdateUserdgDto } from './dto/update-userdg.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Userdg } from './entities/userdg.entity';

@Injectable()
export class UserdgService {
  constructor(
    @InjectRepository(Userdg)
    private userRepository: Repository<Userdg>,
  ) {}
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

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['medias', 'platforms'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.medias = [];
    user.platforms = [];
    await this.userRepository.save(user);

    await this.userRepository.remove(user);
  }
}
