import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { Column } from './column.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; 

@ApiTags('columns') 
@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova coluna' })
  @ApiResponse({ status: 201, description: 'Coluna criada com sucesso.', type: Column })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createColumnDto: { title: string; projectId: number }): Promise<Column> {
    return this.columnsService.create(createColumnDto.title, createColumnDto.projectId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as colunas' })
  @ApiResponse({ status: 200, description: 'Colunas listadas com sucesso.', type: [Column] })
  findAll(): Promise<Column[]> {
    return this.columnsService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma coluna por ID' })
  @ApiResponse({ status: 200, description: 'Coluna atualizada com sucesso.', type: Column })
  @ApiResponse({ status: 404, description: 'Coluna não encontrada.' })
  update(@Param('id') id: number, @Body() updateColumnDto: { title: string; order: number }): Promise<Column> {
    return this.columnsService.update(id, updateColumnDto.title, updateColumnDto.order);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma coluna por ID' })
  @ApiResponse({ status: 200, description: 'Coluna deletada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Coluna não encontrada.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.columnsService.remove(id);
  }
}
