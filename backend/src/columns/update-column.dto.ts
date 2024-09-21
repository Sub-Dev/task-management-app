import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnDto } from './create-column.dto';
import { ApiProperty } from '@nestjs/swagger'; // Importação do Swagger

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
  @ApiProperty({ description: 'Título da coluna', example: 'Coluna Atualizada', required: false })
  title?: string;

  @ApiProperty({ description: 'Ordem da coluna', example: 1, required: false })
  order?: number;
}
