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

  @IsDateString() 
  @IsOptional()
  due_date?: string; 

  @IsNumber()
  @IsOptional()
  project?: number; 

  @IsArray()
  @IsOptional()
  users?: number[]; 

  @IsNumber()
  @IsOptional()
  created_by?: number; 

  @IsNumber()
  @IsNotEmpty()
  column: number; 
}
