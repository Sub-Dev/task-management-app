import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10; // Define o número de rounds para bcrypt
  private readonly defaultProfileImage = '1.png'; // Nome do arquivo de imagem padrão

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      profileImageUrl: createUserDto.profileImageUrl || this.defaultProfileImage,
    });

    return await this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>, newProfileImage?: Express.Multer.File): Promise<User> {
    const user = await this.findById(id);
  
    // Se a senha foi atualizada, a senha deve ser criptografada
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
  
    // Se uma nova imagem de perfil foi enviada, delete a imagem antiga
    if (newProfileImage) {
      const imageName = path.basename(user.profileImageUrl);
      if (imageName !== this.defaultProfileImage) {
        this.deleteOldProfileImage(imageName);
      }
      // Atualize o URL da imagem de perfil no banco de dados
      updateUserDto.profileImageUrl = `http://localhost:4000/users/avatars/${newProfileImage.filename}`;
    } else {
      // Caso contrário, mantenha a imagem de perfil existente ou a padrão
      updateUserDto.profileImageUrl = user.profileImageUrl || `http://localhost:4000/users/avatars/${this.defaultProfileImage}`;
    }
  
    // Atualize o usuário com os novos dados
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }
  

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    this.deleteOldProfileImage(path.basename(user.profileImageUrl)); // Deleta a imagem de perfil ao remover o usuário
    await this.userRepository.remove(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  private deleteOldProfileImage(imageName: string): void {
    const filePath = path.join(__dirname, '../../avatars', imageName);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Erro ao deletar avatar antigo: ${err}`);
        } else {
          console.log(`Avatar antigo ${imageName} deletado com sucesso`);
        }
      });
    }
  }
}
