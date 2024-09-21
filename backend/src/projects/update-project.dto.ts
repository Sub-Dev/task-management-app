import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({
    description: 'Nome do projeto (opcional)',
    example: 'Projeto Atualizado de Gestão de Tarefas',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do projeto (opcional)',
    example: 'Descrição atualizada do projeto.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs de usuários associados ao projeto (opcional)',
    example: [2, 3],
  })
  users?: number[];
}
