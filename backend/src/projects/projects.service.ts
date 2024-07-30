// src/projects/projects.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity'; // Importe a entidade User
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';
import { Column } from '../columns/column.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User) // Injetando o repositório de usuários
    private readonly userRepository: Repository<User>,

    @InjectRepository(Column) // Injetando o repositório de colunas
    private readonly columnRepository: Repository<Column>, // Adicione o repositório de colunas
  ) { }

  // Criar um novo projeto
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name, description, users: userIds } = createProjectDto;

    // Obtenha as entidades User usando os IDs fornecidos
    const users = await this.userRepository.findByIds(userIds || []);

    // Validação de usuários
    const existingUsers = await this.userRepository.findByIds(users);
    if (existingUsers.length !== users.length) {
      throw new NotFoundException('Um ou mais usuários não foram encontrados');
    }

    // Cria a entidade de projeto
    const project = this.projectRepository.create({
      name,
      description,
      users, // Associa os usuários ao projeto
    });

    // Salva o projeto para obter o ID
    const savedProject = await this.projectRepository.save(project);

    // Cria as colunas padrão
    const defaultColumns = ['Backlog', 'Em Progresso', 'Finalizado'];
    const columns = defaultColumns.map((title, index) => {
      const column = new Column();
      column.title = title;
      column.order = index; // Define a ordem das colunas
      column.project = savedProject; // Associa a coluna ao projeto recém-criado
      return column;
    });

    // Salva as colunas
    await this.columnRepository.save(columns);

    // Retorna o projeto com as colunas associadas
    return this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: ['users', 'tasks', 'columns'], // Inclui relações
    });
  }

  // Buscar todos os projetos
  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['users', 'tasks', 'columns'], // Inclui relações
    });
  }

  // Buscar projeto por ID
  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'tasks', 'columns'], // Inclui relações
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return project;
  }

  // Atualizar um projeto
  async updateProject(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { name, description, users } = updateProjectDto;

    // Encontrar o projeto existente
    const project = await this.getProjectById(id);

    // Atualizar os campos básicos
    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }

    // Atualizar a lista de usuários, se necessário
    if (users) {
      const existingUsers = await this.userRepository.findByIds(users);

      if (existingUsers.length !== users.length) {
        throw new NotFoundException('Um ou mais usuários não foram encontrados');
      }

      project.users = existingUsers;
    }

    return this.projectRepository.save(project);
  }

  // Deletar um projeto
  async deleteProject(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado');
    }
  }
}
