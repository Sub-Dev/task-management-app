// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Método para validar o token
  async validateToken(token: string): Promise<any> {
    try {
      // Verifica e decodifica o token JWT usando o JwtService do NestJS
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Obtem o usuário pelo ID decodificado no token
      const user = await this.userRepository.findOne({ where: { id: decoded.sub } });

      if (!user) {
        throw new UnauthorizedException('Token inválido. Usuário não encontrado.');
      }

      return {
        success: true,
        message: 'Token é válido',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          profileImageUrl: user.profileImageUrl
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido.');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Busca o usuário pelo email
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // Exclui a senha dos dados retornados
      return result; // Retorna o usuário sem a senha
    }
    throw new UnauthorizedException('Email ou senha inválidos'); // Lança exceção se as credenciais estiverem erradas
  }

  async validateUserById(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id }; // Define o payload do token JWT
    const token = this.jwtService.sign(payload); // Gera o token com o payload e o segredo
    console.log('Generated Token:', token); // Adicione este log para verificar o token
    return {
      access_token: token, // Retorna o token no formato esperado
    };
  }

  async register(userData: any) {
    const { username, email, password } = userData;
    // Verificar se o usuário com o mesmo email ou username já existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Username ou email já em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha para armazenamento seguro
    const newUser = this.userRepository.create({ username, email, password: hashedPassword });
    await this.userRepository.save(newUser);
    return this.login(newUser); // Retorna o token JWT após registro
  }
}
