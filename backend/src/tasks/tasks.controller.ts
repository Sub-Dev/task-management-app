import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { Task } from './task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'; 

@ApiTags('tasks')  
@ApiBearerAuth('access-token')  
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso.', type: Task })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obter todas as tarefas' })
  @ApiResponse({ status: 200, description: 'Lista de todas as tarefas.', type: [Task] })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obter uma tarefa por ID' })
  @ApiResponse({ status: 200, description: 'Tarefa obtida com sucesso.', type: Task })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa por ID' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso.', type: Task })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma tarefa por ID' })
  @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  deleteTask(@Param('id') id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
