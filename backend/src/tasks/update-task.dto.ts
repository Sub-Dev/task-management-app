import { IsOptional, IsString, IsDateString, IsArray, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from './task.entity'; 

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Novo título da tarefa',
    example: 'Revisar documentação',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nova descrição da tarefa',
    example: 'Revisar toda a documentação antes da entrega',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Novo status da tarefa',
    example: 'completed',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Nova data de vencimento da tarefa',
    example: '2024-12-10T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiPropertyOptional({
    description: 'Nova lista de IDs de usuários atribuídos à tarefa',
    example: [2, 3],
  })
  @IsArray()
  @IsOptional()
  users?: number[];

  @ApiPropertyOptional({
    description: 'Nova coluna para onde a tarefa será movida',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  column?: number;
}
