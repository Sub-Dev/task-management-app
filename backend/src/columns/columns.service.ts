import { Injectable, NotFoundException, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,  Not, MoreThan  } from 'typeorm';
import { Column } from './column.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private columnsRepository: Repository<Column>,

    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(title: string, projectId: number): Promise<Column> {
    const project = await this.projectsRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // Verificar se já existe uma coluna com o mesmo título no projeto
    const existingColumn = await this.columnsRepository.findOne({
      where: {
        title: title,
        project: { id: projectId },
      },
    });

    if (existingColumn) {
      throw new ConflictException('Já existe uma coluna com esse nome neste projeto');
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

  async update(id: number, title: string, order: number | null): Promise<Column> {
    if (!id) {
      throw new BadRequestException('ID inválido');
    }

    const column = await this.columnsRepository.findOne({ where: { id } });

    if (!column) {
      throw new NotFoundException(`Coluna com ID ${id} não encontrada`);
    }

    // Verifica se o título foi alterado e se já existe outra coluna com o mesmo título no projeto
    if (title && column.title !== title) {
      const existingColumn = await this.columnsRepository.findOne({
        where: {
          title,
          project: column.project,
          id: Not(id) // Exclui a coluna atual da verificação
        }
      });

      if (existingColumn) {
        throw new BadRequestException('Já existe uma coluna com esse nome neste projeto');
      }

      column.title = title;
    }

    // Atualiza a ordem se necessário
    if (order !== null && column.order !== order) {
      column.order = order;
    }

    return this.columnsRepository.save(column);
  }
  async findAll(): Promise<Column[]> {
    return this.columnsRepository.find({ relations: ['tasks', 'project'] });
  }
  
  async remove(columnId: number): Promise<void> {
    try {
      // Busca a coluna que será deletada
      const columnToDelete = await this.columnsRepository.findOne({
        where: { id: columnId },
      });
  
      if (!columnToDelete) {
        throw new NotFoundException(`Coluna com ID ${columnId} não encontrada`);
      }
  
      // Remove a coluna
      await this.columnsRepository.remove(columnToDelete);
      console.log(`Coluna com ID ${columnId} removida com sucesso.`);
  
      // Busca todas as colunas do mesmo projeto que possuem uma ordem maior que a da coluna deletada
      const columnsToUpdate = await this.columnsRepository.find({
        where: {
          project: columnToDelete.project, // Filtra pelo mesmo projeto
          order: MoreThan(columnToDelete.order), // Encontra colunas com ordem maior
        },
      });
  
      // Diminui o valor da ordem de cada coluna em 1
      for (const column of columnsToUpdate) {
        column.order -= 1;
        await this.columnsRepository.save(column);
      }
  
      console.log('Ordem das colunas atualizada com sucesso após a exclusão.');
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      throw new InternalServerErrorException('Erro ao remover a coluna');
    }
  }
  
}
