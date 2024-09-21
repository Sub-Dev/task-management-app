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
  Query,
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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtido com sucesso.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getProfile(@Request() req): Promise<User> {
    try {
      return await this.usersService.findById(req.user.userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Procurar usuários por critérios' })
  @ApiResponse({ status: 200, description: 'Usuários encontrados com sucesso.', type: [User] })
  async findByCriteria(@Query() criteria: any): Promise<User[]> {
    return await this.usersService.findUsersByCriteria(criteria);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Usuários listados com sucesso.', type: [User] })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obter um usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', required: true })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return await this.usersService.create(createUserDto);
  }

  @Get('avatars/:filename')
  @ApiOperation({ summary: 'Obter avatar do usuário' })
  @ApiParam({ name: 'filename', description: 'Nome do arquivo do avatar', required: true })
  @ApiResponse({ status: 200, description: 'Avatar retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Avatar não encontrado.' })
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
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', required: true })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @UploadedFile() file: Express.Multer.File
  ): Promise<User> {
    console.log('Update user request:', { updateUserDto, file });

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

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
  @ApiOperation({ summary: 'Deletar um usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', required: true })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.usersService.delete(+id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
