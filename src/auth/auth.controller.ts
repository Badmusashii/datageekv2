import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
  @Post('confirmation')
  async confirmation(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ token: string }> {
    const token = await this.authService.confirmation(createAuthDto);
    return { token };
  }
}
