import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar nova funcionalidade',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição da tarefa',
    example: 'Detalhes sobre o que precisa ser feito',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    example: 'pending',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento da tarefa',
    example: '2024-12-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({
    description: 'ID do projeto associado à tarefa',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  project?: number;

  @ApiPropertyOptional({
    description: 'Lista de IDs de usuários atribuídos à tarefa',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  users?: number[];

  @ApiPropertyOptional({
    description: 'ID do criador da tarefa',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  created_by?: number;

  @ApiProperty({
    description: 'ID da coluna onde a tarefa será criada',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  column: number;
}
