// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private redisClient: Redis;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }



  // Método para validar o token
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
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
  
  async login(userCredentials: any) {
    const { email, password } = userCredentials;
    
    // Encontrar o usuário pelo e-mail
    const user = await this.userRepository.findOne({ where: { email } });
  
    // Verificar se o usuário foi encontrado
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
  
    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
  
    // Verificar se já existe uma sessão ativa
    if (user.currentSessionToken) {
      throw new UnauthorizedException('Usuário já está logado em outro dispositivo.');
    }
    
    // Definir o payload do token JWT
    const payload = { email: user.email, sub: user.id };
    
    // Gerar o token JWT
    const token = this.jwtService.sign(payload);
    
    // Atualizar o token de sessão do usuário no banco de dados
    user.currentSessionToken = token;
    await this.userRepository.save(user);
    
    // Retornar o token
    return {
      access_token: token,
    };
  }
  async logout(token: string) {
    // Adiciona o token a uma blacklist no Redis com o tempo de expiração do token
    const expiration = this.jwtService.decode(token)?.exp;
    if (expiration) {
      const timeToLive = expiration - Math.floor(Date.now() / 1000);
      await this.redisClient.set(`blacklist:${token}`, 'true', 'EX', timeToLive);
    }
  }
  async validateUser(email: string, password: string): Promise<any> {
    // Busca o usuário pelo email
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // Exclui a senha dos dados retornados
      result.id = user.id; 
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

  async register(userData: any) {
    const { username, email, password, profileImageUrl } = userData;
  
    // Verificar se o usuário com o mesmo email ou username já existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  
    if (existingUser) {
      throw new ConflictException('Username ou email já em uso');
    }
  
    const profile = "http://localhost:4000/users/avatars/1.png";
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha para armazenamento seguro
  
    // Criar e salvar o novo usuário
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      profileImageUrl: profile,
    });
  
    await this.userRepository.save(newUser);
  
    // Retornar uma mensagem de sucesso
    return {
      message: 'Cadastro realizado com sucesso! Por favor, faça login.',
    };
  }
  
}
