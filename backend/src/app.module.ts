import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module'; // Importe os módulos necessários
// import { ProjectModule } from './projects/project.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { ColumnsModule } from './columns/columns.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'task_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // somente em ambiente de desenvolvimento
    }),
    UserModule,
    AuthModule,
    ColumnsModule,
    TasksModule,
    // ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
