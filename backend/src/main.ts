import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';  // Importação do Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Servir os arquivos de avatar
  app.use('/avatars', express.static(join(__dirname, '..', 'avatars')));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de gerenciamento de tarefas,projetos e usuarios')
    .setDescription('Documentação da API de gerenciamento de tarefas,projetos e usuarios')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // O Swagger estará disponível em '/api-docs'

  await app.listen(4000);
}
bootstrap();
