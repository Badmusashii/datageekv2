import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forFeature([Userdg]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: String(process.env.ACCESS_TOKEN_SECRET),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
