// src/projects/dto/create-project.dto.ts

import { IsNotEmpty, IsString, IsOptional, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Alterado de title para name

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  users?: number[]; // IDs dos usuários associados
}
