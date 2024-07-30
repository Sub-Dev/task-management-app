import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Column } from './column.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private columnsRepository: Repository<Column>,

    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) { }

  async create(title: string, projectId: number): Promise<Column> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    // Encontrar o maior valor de order atual para o projeto
    const maxOrderResult = await this.columnsRepository
      .createQueryBuilder('column')
      .select('MAX(column.order)', 'maxOrder')
      .where('column.projectId = :projectId', { projectId })
      .getRawOne();

    const maxOrder = maxOrderResult.maxOrder ? parseInt(maxOrderResult.maxOrder, 10) : -1;
    const newOrder = maxOrder + 1;

    const column = new Column();
    column.title = title;
    column.project = project;
    column.order = newOrder; // Definindo a ordem para o próximo valor disponível

    return this.columnsRepository.save(column);
  }

  async findAll(): Promise<Column[]> {
    return this.columnsRepository.find({ relations: ['tasks', 'project'] });
  }

  async update(id: number, title: string): Promise<Column> {
    const column = await this.columnsRepository.findOneBy({ id });

    if (!column) {
      throw new Error('Coluna não encontrada');
    }

    column.title = title;
    return this.columnsRepository.save(column);
  }

  async remove(id: number): Promise<void> {
    const columnToRemove = await this.columnsRepository.findOneBy({ id });
    if (!columnToRemove) {
      throw new Error('Coluna não encontrada');
    }

    await this.columnsRepository.delete(id);

    // Atualiza a ordem das colunas restantes
    await this.columnsRepository
      .createQueryBuilder()
      .update(Column)
      .set({ order: () => 'order - 1' })
      .where('order > :order AND projectId = :projectId', {
        order: columnToRemove.order,
        projectId: columnToRemove.project.id
      })
      .execute();
  }
}
