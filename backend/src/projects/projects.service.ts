// src/projects/projects.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../user/user.entity'; 
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';
import { Column } from '../columns/column.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    @InjectRepository(Column) 
    private readonly columnRepository: Repository<Column>,
  ) { }


  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const { name, description, users: userIds } = createProjectDto;

  
    const users = await this.userRepository.findByIds(userIds || []);

    const existingUsers = await this.userRepository.findByIds(users);
    if (existingUsers.length !== users.length) {
      throw new NotFoundException('Um ou mais usuários não foram encontrados');
    }

    const project = this.projectRepository.create({
      name,
      description,
      users, 
    });

    const savedProject = await this.projectRepository.save(project);

    const defaultColumns = ['Backlog', 'Em Progresso', 'Finalizado'];
    const columns = defaultColumns.map((title, index) => {
      const column = new Column();
      column.title = title;
      column.order = index + 1; 
      column.project = savedProject; 
      return column;
    });

    await this.columnRepository.save(columns);

    return this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: ['users', 'tasks', 'columns'], 
    });
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['users', 'tasks', 'columns'], 
    });
  }

  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'tasks', 'columns'], 
    });
    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return project;
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { name, description, users } = updateProjectDto;

    const project = await this.getProjectById(id);

    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }

    if (users) {
      const existingUsers = await this.userRepository.findByIds(users);

      if (existingUsers.length !== users.length) {
        throw new NotFoundException('Um ou mais usuários não foram encontrados');
      }

      project.users = existingUsers;
    }

    return this.projectRepository.save(project);
  }

  async deleteProject(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Projeto não encontrado');
    }
  }
  async searchProjects(name: string, userId: number): Promise<Project[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.users', 'user')
      .where('project.name = :name', { name })
      .andWhere('user.id = :userId', { userId})
      .getMany();
  }
}
