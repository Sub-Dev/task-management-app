// src/users/users.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findById(+id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(+id);
  }
}
