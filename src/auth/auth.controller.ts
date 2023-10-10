import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('Les routes pour la gestion des utilisateurs')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Utiliser pour la creation d'un utilisateur" })
  @Post('register')
  // @UseGuards(AuthGuard('jwt'))
  register(@Body() body) {
    const token = body.token;
    return this.authService.register(token);
  }

  @ApiOperation({ summary: 'Utiliser pour le login et renvoie un Token' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        loginDto,
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.json({ accessToken, refreshToken });
    } catch (error) {
      // Gérer les erreurs ici
      res.status(401).json({ error: "Erreur d'authentification" });
    }
  }

  @Post('confirmation')
  async confirmation(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ token: string }> {
    const token = await this.authService.confirmation(createAuthDto);
    return { token };
  }
  @Post('refresh')
  async refreshToken(@Request() req, @Res() res) {
    const oldRefreshToken = req.cookies['Refresh']; // Ou comment tu l'obtiens actuellement
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      oldRefreshToken,
    );

    res.cookie('Refresh', refreshToken, {
      // options pour le cookie
    });

    return res.json({ accessToken });
  }
}
