// src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { User } from '../user/user.entity'; 
import { Project } from '../projects/project.entity';
import { Column } from '../columns/column.entity';
import { UserModule } from '../user/user.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Project, Column]), 
    UserModule, 
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule { }
