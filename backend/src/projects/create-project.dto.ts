import { IsNotEmpty, IsString, IsOptional, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Nome do projeto',
    example: 'Projeto de Gestão de Tarefas',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do projeto',
    example: 'Este projeto é para gerenciar tarefas de forma eficiente.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Lista de IDs de usuários associados ao projeto',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  users?: number[];
}
