// src/tasks/tasks.service.ts

import { Injectable, NotFoundException, BadRequestException,UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task, TaskStatus } from './task.entity'; // Importe o enum TaskStatus
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { User } from '../user/user.entity';
import { Project } from '../projects/project.entity';
import { Column } from '../columns/column.entity';
import { Request } from '@nestjs/common';
import { parseISO, format } from 'date-fns';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Column)
    private readonly columnRepository: Repository<Column>,
  ) { }

  async createTask(createTaskDto: CreateTaskDto, @Request() req): Promise<Task> {
    const { title, description, status, due_date, project, users, column } = createTaskDto;

    const userId =  await this.userRepository.findOne({ where: { id: In(users)} });
    console.log('User ID from token:', userId);

    const projectEntity = project ? await this.projectRepository.findOne({ where: { id: project } }) : null;
    const columnEntity = column ? await this.columnRepository.findOne({ where: { id: column } }) : null;

    console.log('Project Entity:', projectEntity);
    console.log('Column Entity:', columnEntity);

    if (project && !projectEntity) {
      throw new NotFoundException('Project not found');
    }

    if (column && !columnEntity) {
      throw new NotFoundException('Column not found');
    }

    const createdByUser = userId
    console.log('Created By User:', createdByUser);

    if (!createdByUser) {
      throw new NotFoundException('User who created the task not found');
    }

    const taskStatus = Object.values(TaskStatus).includes(status as TaskStatus)
      ? (status as TaskStatus)
      : TaskStatus.PENDING;

    console.log('Task Status:', taskStatus);

    const task = this.taskRepository.create({
      title,
      description,
      status: taskStatus,
      due_date: due_date ? new Date(due_date) : undefined,
      project: projectEntity,
      users: [createdByUser], 
      created_by: createdByUser, 
      column: columnEntity,
    });

    console.log('Task Before Save:', task);

    const savedTask = await this.taskRepository.save(task);

    console.log('Saved Task:', savedTask);

    if (users) {
      const userEntities = await this.userRepository.findBy({ id: In(users) });
      console.log('User Entities to Add:', userEntities);

      savedTask.users = [
        ...new Set([
          ...savedTask.users,
          ...userEntities,
        ].map(user => user.id)) 
      ].map(id => userEntities.find(user => user.id === id)); 

      console.log('Final User List Before Save:', savedTask.users);

      await this.taskRepository.save(savedTask);
    }

    return savedTask;
  }
  
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['users', 'project', 'column'],
    });
  }
  
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['users', 'project', 'column'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

 async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
  console.log('Updating task with ID:', id);
  console.log('Data received:', updateTaskDto);

  const { title, description, status, due_date, users, column } = updateTaskDto;

  const task = await this.taskRepository.findOne({
    where: { id },
    relations: ['users', 'column'],
  });
  if (!task) {
    console.log('Task not found');
    throw new NotFoundException('Tarefa não encontrada');
  }

  if (title) {
    task.title = title;
  }
  if (description) {
    task.description = description;
  }
  if (status) {
    task.status = status;
  }
  if (due_date) {
    task.due_date = new Date(due_date);
  }
  
  if (users !== undefined) {
    const userEntities = await this.userRepository.findByIds(users);
    
    if (userEntities.length !== users.length) {
      console.log('Some users not found');
      throw new NotFoundException('Um ou mais usuários não foram encontrados');
    }

    task.users = userEntities;
  }

  if (column !== undefined) {
    const columnEntity = await this.columnRepository.findOne({ where: { id: column } });
    if (!columnEntity) {
      console.log('Column not found');
      throw new NotFoundException('Coluna não encontrada');
    }
    task.column = columnEntity;
  }

  const updatedTask = await this.taskRepository.save(task);
  console.log('Updated Task:', updatedTask);

  return updatedTask;
}

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
