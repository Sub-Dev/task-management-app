// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token JWT do cabeçalho
      ignoreExpiration: false, // Configura para não ignorar a expiração do token
      secretOrKey: process.env.JWT_SECRET || 'default_secret_key', // Usa o segredo do .env ou um padrão
    });
  }

  async validate(payload: any) {
    // Recupera o usuário baseado no payload do token
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token'); // Lança exceção se o token for inválido
    }
    return user; // Retorna o usuário validado
  }
}
