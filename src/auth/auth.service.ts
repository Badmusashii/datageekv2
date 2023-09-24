import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Userdg) private userdgRepository: Repository<Userdg>,
    private jwtService: JwtService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    const { username, name, surname, email, password } = createAuthDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const userdg = this.userdgRepository.create({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
    });
    try {
      const createdMember = await this.userdgRepository.save(userdg);
      delete createdMember.password;
      return createdMember;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Ce pseudo existe deja');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const userdg = await this.userdgRepository.findOneBy({ username });
    if (userdg && (await bcrypt.compare(password, userdg.password))) {
      const payload = { username, sub: userdg.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Probleme dans vos identifiants !');
    }
  }
}
