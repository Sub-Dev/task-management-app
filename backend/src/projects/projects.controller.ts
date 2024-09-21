import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'; 

@ApiTags('projects') 
@ApiBearerAuth('access-token')  
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Pesquisar projetos por nome e usuário' })
  @ApiResponse({ status: 200, description: 'Projetos encontrados.', type: [Project] })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  async searchProjects(
    @Query('name') name: string,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Project[]> {
    return this.projectsService.searchProjects(name, userId);
  }
 
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo projeto' })
  @ApiResponse({ status: 201, description: 'Projeto criado com sucesso.', type: Project })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obter todos os projetos' })
  @ApiResponse({ status: 200, description: 'Lista de projetos.', type: [Project] })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obter um projeto por ID' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado.', type: Project })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  async getProjectById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.getProjectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um projeto por ID' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado com sucesso.', type: Project })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um projeto por ID' })
  @ApiResponse({ status: 200, description: 'Projeto deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária.' })
  async deleteProject(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.projectsService.deleteProject(id);
  }
}
