import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  project: number; // ID do projeto ao qual a coluna pertence
}
