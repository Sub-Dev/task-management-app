import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto'; // Ajuste o caminho conforme necessário

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
}
