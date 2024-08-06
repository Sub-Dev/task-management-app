// src/columns/columns.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param,UseGuards } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { Column } from './column.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createColumnDto: { title: string; projectId: number }): Promise<Column> {
    return this.columnsService.create(createColumnDto.title, createColumnDto.projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Column[]> {
    return this.columnsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateColumnDto: { title: string }): Promise<Column> {
    return this.columnsService.update(id, updateColumnDto.title);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.columnsService.remove(id);
  }
}
