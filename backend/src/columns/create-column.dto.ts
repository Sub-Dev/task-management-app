import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importação do Swagger

export class CreateColumnDto {
  @ApiProperty({ description: 'Título da coluna', example: 'Nova Coluna' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'ID do projeto associado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  project: number; 
}
