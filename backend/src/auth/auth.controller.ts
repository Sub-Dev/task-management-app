import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto'; // Ajuste o caminho conforme necessário
import { ValidateTokenDto } from './validate-token.dto'; // Importa o DTO

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    console.log('Dados recebidos:', loginDto); // Adicione este log para verificar os dados recebidos
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Dados recebidos:', createUserDto);
    return this.authService.register(createUserDto);
  }

  // Rota para validar o token
  @Post('validate-token')
  async validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      return await this.authService.validateToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
