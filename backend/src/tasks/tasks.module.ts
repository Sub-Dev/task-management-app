// src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { User } from '../user/user.entity'; // Importando User
import { Project } from '../projects/project.entity';
import { Column } from '../columns/column.entity';
import { UserModule } from '../user/user.module'; // Certifique-se de importar o módulo de usuários se existir

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Project, Column]), // Inclua User no TypeOrmModule
    UserModule, // Se houver um módulo de usuários
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule { }
