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

async validateToken(token: string): Promise<any> {
  try {
    const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    const user = await this.userRepository.findOne({ where: { id: decoded.sub } });

    if (!user) {
      throw new UnauthorizedException('Token inválido. Usuário não encontrado.');
    }
    
    if (user.currentSessionToken !== token) {
      throw new UnauthorizedException('Você foi desconectado porque sua conta foi acessada em outro dispositivo.');
    }

    return {
      success: true,
      message: 'Token é válido',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
      },
    };
  } catch (error) {
    throw new UnauthorizedException('Token inválido.');
  }
}


async login(userCredentials: any) {
  const { email, password } = userCredentials;

  const user = await this.userRepository.findOne({ where: { email } });

  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  if (user.currentSessionToken) {

    try {
      await this.validateToken(user.currentSessionToken);
      throw new UnauthorizedException('Sua sessão expirou ou foi encerrada devido a um login em outro dispositivo.');
    } catch (error) {

    }
  }

  const payload = { email: user.email, sub: user.id };

  const token = this.jwtService.sign(payload);

  user.currentSessionToken = token;
  await this.userRepository.save(user);

  return {
    access_token: token,
  };
}

  async logout(token: string) {
    const expiration = this.jwtService.decode(token)?.exp;
    if (expiration) {
      const timeToLive = expiration - Math.floor(Date.now() / 1000);
      await this.redisClient.set(`blacklist:${token}`, 'true', 'EX', timeToLive);
    }

    const decodedToken = this.jwtService.decode(token);
    if (decodedToken && typeof decodedToken === 'object') {
      const userId = decodedToken.sub;
  
      const user = await this.userRepository.findOne({ where: { id: userId } });
  
      if (user && user.currentSessionToken === token) {
        user.currentSessionToken = null;
        await this.userRepository.save(user);
      }
    }
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; 
      result.id = user.id; 
      return result; 
    }
    throw new UnauthorizedException('Email ou senha inválidos'); 
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
  
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  
    if (existingUser) {
      throw new ConflictException('Username ou email já em uso');
    }
  
    const profile = "http://localhost:4000/users/avatars/1.png";
    const hashedPassword = await bcrypt.hash(password, 10); 
  
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      profileImageUrl: profile,
    });
  
    await this.userRepository.save(newUser);
  
    return {
      message: 'Cadastro realizado com sucesso! Por favor, faça login.',
    };
  }
  
}
