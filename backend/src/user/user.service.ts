// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10; // Define o número de rounds para bcrypt
  private readonly defaultProfileImage = './avatars/avatar-default.png'; // URL da imagem padrão

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Criptografar a senha antes de criar o usuário
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);

    // Criar o novo usuário com a senha criptografada e a imagem de perfil
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      profileImageUrl: createUserDto.profileImageUrl || this.defaultProfileImage, // Use a URL fornecida ou a padrão
    });

    return await this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findById(id);

    // Verificar se a senha foi atualizada e, se sim, criptografá-la
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }

    // Atualizar a URL da imagem de perfil se fornecida
    if (!updateUserDto.profileImageUrl) {
      updateUserDto.profileImageUrl = user.profileImageUrl || this.defaultProfileImage; // Mantém a imagem atual ou define a padrão
    }

    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  // Método de login no seu serviço de usuários
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }
}
