import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ConfigService } from '@nesrjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Userdg)
    private userdgRepository: Repository<Userdg>,
  ) {
    super({
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // IMPORTANT IL FAUT GARDER CE NOM DE METHODE
  async validate(payload: any): Promise<Userdg> {
    console.log('validate');
    const { username } = payload;
    const userdg: Userdg = await this.userdgRepository.findOneBy({ username });

    if (!userdg) throw new UnauthorizedException();
    return userdg;
  }
}
