import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
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
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return await this.usersService.create(createUserDto);
  }

  @Get('avatars/:filename')
  async getAvatar(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const filePath = join(__dirname, '../../avatars', filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      throw new NotFoundException('Avatar not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './avatars',
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, `${randomName}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @UploadedFile() file: Express.Multer.File
  ): Promise<User> {
    console.log('Update user request:', { updateUserDto, file });

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Atualiza a URL da imagem de perfil se um novo arquivo foi enviado
    if (file) {
      updateUserDto.profileImageUrl = `http://localhost:4000/users/avatars/${file.filename}`;
    }

    const user = await this.usersService.update(+id, updateUserDto, file);
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
