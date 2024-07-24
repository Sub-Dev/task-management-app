// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa o módulo de configuração
import { User } from '../user/user.entity'; // Importa a entidade User
import { AuthService } from './auth.service'; // Importa o serviço de autenticação
import { AuthController } from './auth.controller'; // Importa o controlador de autenticação
import { JwtStrategy } from './jwt.strategy'; // Importa a estratégia JWT
import { LocalStrategy } from './local.strategy'; // Importa a estratégia local

@Module({
  imports: [
    ConfigModule.forRoot(), // Carrega as variáveis de ambiente definidas no .env
    PassportModule, // Importa o módulo Passport para suportar estratégias de autenticação
    JwtModule.registerAsync({ // Configura o módulo JWT de forma assíncrona, permitindo o uso do ConfigService
      imports: [ConfigModule], // Certifica-se de que o ConfigModule é importado
      inject: [ConfigService], // Injeta o ConfigService para acessar variáveis de ambiente
      useFactory: async (configService: ConfigService) => ({ // Usa uma função de fábrica para configurar o módulo
        secret: configService.get<string>('JWT_SECRET'), // Recupera o segredo JWT das variáveis de ambiente
        signOptions: { expiresIn: '60m' }, // Define as opções de assinatura, como tempo de expiração do token
      }),
    }),
    TypeOrmModule.forFeature([User]), // Importa o repositório TypeORM da entidade User
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy], // Declara os provedores necessários
  controllers: [AuthController], // Declara os controladores
})
export class AuthModule { } // Exporta o módulo de autenticação
