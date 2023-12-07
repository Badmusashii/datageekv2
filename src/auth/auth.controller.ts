import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Patch,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserdgService } from 'src/userdg/userdg.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request as ExpressRequest } from 'express'; // Importation avec un alias pour eviter le soucie de doublon avec Request de Nestjs/common
import { Response as ExpressResponse } from 'express'; // Importation avec un alias pour eviter le soucie de doublon avec Request de Nestjs/common

@ApiTags('Les routes pour la gestion des utilisateurs')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userdgService: UserdgService,
  ) {}

  @ApiOperation({ summary: "Utiliser pour la creation d'un utilisateur" })
  @Post('register')
  // @UseGuards(AuthGuard('jwt'))
  register(@Body() body) {
    console.log(body);
    const token = body.token;
    const recaptchaResponse = body.recaptchaResponse;
    return this.authService.register(token, recaptchaResponse);
  }

  @ApiOperation({ summary: 'Utiliser pour le login et renvoie un Token' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        loginDto,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Cookie accessible uniquement côté serveur, pas via JavaScript
        secure: true, // Cookie transmis uniquement sur des connexions HTTPS sécurisées
        sameSite: 'lax', // Politique SameSite, permettant au cookie d'être envoyé lors de la navigation entre sites sous certaines conditions
      });
      res.json({ accessToken });
    } catch (error) {
      // Gérer les erreurs ici
      res.status(401).json({ error: "Erreur d'authentification" });
    }
  }

  @Post('logout')
  async logout(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken, res);
  }

  @Post('confirmation')
  async confirmation(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ token: string }> {
    const token = await this.authService.confirmation(createAuthDto);
    return { token };
  }
  @Post('refresh')
  async refreshToken(@Request() req: ExpressRequest, @Res() res: Response) {
    try {
      const oldRefreshToken = req.cookies['refreshToken'];
      if (!oldRefreshToken) {
        // Si aucun refresh token n'est présent, renvoie une réponse appropriée
        return res.status(403).json({ error: 'Aucun refresh token fourni' });
      }
      const { accessToken, refreshToken } = await this.authService.refreshToken(
        oldRefreshToken,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });

      // Renvoie du nouvel access token
      return res.json({ accessToken });
    } catch (error) {
      return res
        .status(401)
        .json({ error: 'Erreur lors du rafraîchissement du token' });
    }
  }
  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Request() req,
    @Body() updateDto: UpdateAuthDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    console.log(req);
    console.log(updateDto);
    return this.authService.updateProfile(userId, updateDto);
  }
}
