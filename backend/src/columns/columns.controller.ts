// src/columns/columns.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { Column } from './column.entity';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @Post()
  create(@Body() createColumnDto: { title: string; projectId: number }): Promise<Column> {
    return this.columnsService.create(createColumnDto.title, createColumnDto.projectId);
  }

  @Get()
  findAll(): Promise<Column[]> {
    return this.columnsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateColumnDto: { title: string }): Promise<Column> {
    return this.columnsService.update(id, updateColumnDto.title);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.columnsService.remove(id);
  }
}
