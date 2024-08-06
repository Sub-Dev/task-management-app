// src/users/users.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      return await this.usersService.findById(req.user.userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Validação adicional pode ser realizada aqui, se necessário
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>): Promise<User> {
    // Validação adicional pode ser realizada aqui, se necessário
    if (updateUserDto.password) {
      // Assegure-se de que a senha seja criptografada se fornecida
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const user = await this.usersService.update(+id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.usersService.delete(+id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
