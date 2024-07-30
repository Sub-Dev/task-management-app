// src/projects/projects.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  // Rota para criar um novo projeto
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  // Rota para buscar todos os projetos
  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  // Rota para buscar projeto por ID
  @Get(':id')
  async getProjectById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  // Rota para atualizar um projeto
  @Put(':id')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  // Rota para deletar um projeto
  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.projectsService.deleteProject(id);
  }
}
