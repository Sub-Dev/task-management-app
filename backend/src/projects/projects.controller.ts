// src/projects/projects.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe,UseGuards,Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }



  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchProjects(
    @Query('name') name: string,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Project[]> {
    return this.projectsService.searchProjects(name, userId);
  }
 
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

 
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.updateProject(id, updateProjectDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.projectsService.deleteProject(id);
  }

}
