// src/tasks/dto/update-task.dto.ts

import { IsOptional, IsString, IsDateString, IsArray, IsNumber, IsEnum } from 'class-validator';
import { TaskStatus } from './task.entity'; 

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus) 
  @IsOptional()
  status?: TaskStatus;

  @IsDateString() 
  @IsOptional()
  due_date?: string;

  @IsArray()
  @IsOptional()
  users?: number[]; 

  @IsNumber()
  @IsOptional()
  column?: number; 
}
