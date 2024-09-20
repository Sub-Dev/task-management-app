// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { User } from '../user/user.entity';
import { AuthService } from './auth.service'; 
import { AuthController } from './auth.controller'; 
import { JwtStrategy } from './jwt.strategy'; 
import { LocalStrategy } from './local.strategy'; 

@Module({
  imports: [
    ConfigModule.forRoot(), 
    PassportModule, 
    JwtModule.registerAsync({ 
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({ 
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '60m' }, 
      }),
    }),
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy], 
  controllers: [AuthController],
})
export class AuthModule { } 
