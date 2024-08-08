import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Usar o ValidationPipe global para validação de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
    // Configuração para servir arquivos estáticos
    app.use('/avatars', express.static(join(__dirname, '..', 'avatars')));
  await app.listen(4000);
}
bootstrap();
