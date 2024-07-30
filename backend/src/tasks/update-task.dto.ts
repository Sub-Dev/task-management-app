// src/tasks/dto/update-task.dto.ts

import { IsOptional, IsString, IsDateString, IsArray, IsNumber, IsEnum } from 'class-validator';
import { TaskStatus } from './task.entity'; // Importa o enum do arquivo correto

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus) // Corrigindo o uso do enum
  @IsOptional()
  status?: TaskStatus;

  @IsDateString() // Validação para string de data
  @IsOptional()
  due_date?: string; // Data de vencimento opcional

  @IsArray()
  @IsOptional()
  users?: number[]; // IDs dos usuários

  @IsNumber()
  @IsOptional()
  column?: number; // ID da coluna, tornando-o opcional
}
