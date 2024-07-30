// src/tasks/tasks.controller.ts

import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Put(':id')
  updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
