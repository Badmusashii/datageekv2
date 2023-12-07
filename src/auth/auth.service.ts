import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Userdg } from 'src/userdg/entities/userdg.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserdgService } from 'src/userdg/userdg.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Response as ExpressResponse } from 'express'; // Importation avec un alias pour eviter le soucie de doublon avec Request de Nestjs/common

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Userdg) private userdgRepository: Repository<Userdg>,
    private jwtService: JwtService,
    private userdgService: UserdgService,
    private axios: HttpService,
  ) {}
  // async register(token: string) {
  //   const { username, name, surname, email, password } = createAuthDto;
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   const userdg = this.userdgRepository.create({
  //     username,
  //     name,
  //     surname,
  //     email,
  //     password: hashedPassword,
  //   });
  //   try {
  //     const createdMember = await this.userdgRepository.save(userdg);
  //     delete createdMember.password;
  //     return createdMember;
  //   } catch (err) {
  //     if (err.code === '23505') {
  //       throw new ConflictException('Ce pseudo existe deja');
  //     } else {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }
  async verifyRecaptcha(recaptchaResponse: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const googleUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaResponse}`;

    try {
      const response = await firstValueFrom(this.axios.post(googleUrl));
      return response.data.success;
    } catch (error) {
      // Gérer les erreurs de requête ici
      console.error(error);
      return false;
    }
  }
  async register(token: string, recaptchaResponse: string) {
    const isRecaptchaValid = await this.verifyRecaptcha(recaptchaResponse);
    if (!isRecaptchaValid) {
      throw new UnauthorizedException('Échec de la vérification reCAPTCHA');
    }
    try {
      // Décoder et vérifier le token
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      ) as CreateAuthDto;

      // Une fois que le token est vérifié, enregistrez l'utilisateur
      const { username, name, surname, email, password } = decoded; // Remarque: il serait bon d'avoir une interface pour ce payload

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const userdg = this.userdgRepository.create({
        username,
        name,
        surname,
        email,
        password: hashedPassword,
      });

      const createdMember = await this.userdgRepository.save(userdg);
      delete createdMember.password;
      return createdMember;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Token invalide');
      }
      throw new InternalServerErrorException();
    }
  }
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const userdg = await this.userdgRepository.findOneBy({ username });
    if (userdg && (await bcrypt.compare(password, userdg.password))) {
      const payload = { username, sub: userdg.id };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '30m',
      });
      const refreshTokenPayload = { username, sub: userdg.id };
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      });

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Probleme dans vos identifiants !');
    }
  }

  async confirmation(createAuthDto: CreateAuthDto) {
    const payload = {
      username: createAuthDto.username,
      name: createAuthDto.name,
      surname: createAuthDto.surname,
      email: createAuthDto.email,
      password: createAuthDto.password,
    };
    const key = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(payload, key, {
      expiresIn: '1h',
    });
    return token;
  }
  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = this.jwtService.verify(oldRefreshToken);
    if (!decoded) {
      throw new UnauthorizedException('Refresh Token Invalide !');
    }
    const newAccessToken = this.jwtService.sign({
      username: decoded.username,
      sub: decoded.sub,
    });
    const newRefreshToken = this.jwtService.sign(
      {
        username: decoded.username,
        sub: decoded.sub,
      },
      { expiresIn: '7d' },
    );
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
  async logout(refreshToken: string, res: ExpressResponse) {
    const decoded = this.jwtService.decode(refreshToken) as any;
    if (!decoded) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    // Générer un nouveau refreshToken obsolète

    res.clearCookie('refreshToken');
    return res.json({ message: 'Déconnexion réussie' });
  }

  async updateProfile(
    userId: number,
    updateDto: UpdateAuthDto,
  ): Promise<{ message: string }> {
    const user = await this.userdgRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'ID ${userId} n'a pas été trouvé.`,
      );
    }
    if (
      updateDto.oldPassword &&
      !(await bcrypt.compare(updateDto.oldPassword, user.password))
    ) {
      throw new UnauthorizedException('Mot de passe actuel incorrect.');
    }

    // Mettre à jour les champs de l'utilisateur
    for (const key in updateDto) {
      if (updateDto[key] !== undefined) {
        user[key] = updateDto[key];
      }
    }

    // Sauvegarder les modifications
    await this.userdgRepository.save(user);
    return { message: 'Profil mis à jour avec succès.' };
  }
}
