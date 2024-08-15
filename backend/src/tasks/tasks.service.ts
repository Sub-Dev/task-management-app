// src/tasks/tasks.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task, TaskStatus } from './task.entity'; // Importe o enum TaskStatus
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { User } from '../user/user.entity';
import { Project } from '../projects/project.entity';
import { Column } from '../columns/column.entity';
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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, due_date, project, users, created_by, column } = createTaskDto;

    // Buscar entidades relacionadas usando os IDs fornecidos
    const projectEntity = project ? await this.projectRepository.findOne({ where: { id: project } }) : null;
    const columnEntity = column ? await this.columnRepository.findOne({ where: { id: column } }) : null;
    const createdByUser = created_by ? await this.userRepository.findOne({ where: { id: created_by } }) : null;
    const userEntities = users ? await this.userRepository.findBy({ id: In(users) }) : [];

    // Verificar se as entidades foram encontradas
    if (project && !projectEntity) {
      throw new NotFoundException('Project not found');
    }

    if (column && !columnEntity) {
      throw new NotFoundException('Column not found');
    }

    if (created_by && !createdByUser) {
      throw new NotFoundException('User who created the task not found');
    }

    // Validação do status para garantir que esteja dentro do enum
    const taskStatus = Object.values(TaskStatus).includes(status as TaskStatus)
      ? (status as TaskStatus)
      : TaskStatus.PENDING;

    // Criar a instância da Task com as entidades relacionadas
    const task = this.taskRepository.create({
      title,
      description,
      status: taskStatus,
      due_date: due_date ? new Date(due_date) : undefined,
      project: projectEntity,
      users: [], // Inicialmente, sem usuários associados
      created_by: createdByUser,
      column: columnEntity,
    });

    // Salvar a nova tarefa no repositório
    const savedTask = await this.taskRepository.save(task);

    // Atualizar a tarefa com usuários associados
    if (users && userEntities.length > 0) {
      savedTask.users = userEntities;
      await this.taskRepository.save(savedTask);
    }

    return savedTask;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
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
    if (users) {
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
  
    return this.taskRepository.save(task);
  }
  

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
