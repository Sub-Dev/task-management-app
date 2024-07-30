// src/tasks/dto/create-task.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString() // Validação de string de data
  @IsOptional()
  due_date?: string; // Use string para IsDateString

  @IsNumber()
  @IsOptional()
  project?: number; // ID do projeto

  @IsArray()
  @IsOptional()
  users?: number[]; // IDs dos usuários

  @IsNumber()
  @IsOptional()
  created_by?: number; // ID do usuário criador

  @IsNumber()
  @IsNotEmpty()
  column: number; // ID da coluna no Kanban
}
