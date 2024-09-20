import { Injectable, NotFoundException,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  private readonly defaultProfileImage = '1.png';

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
  
    const existingUser = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
    
    if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Nome de usuário já está em uso');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
  
   
    if (newProfileImage) {
      const imageName = path.basename(user.profileImageUrl);
      if (imageName !== this.defaultProfileImage) {
        this.deleteOldProfileImage(imageName);
      }
    
      updateUserDto.profileImageUrl = `http://localhost:4000/users/avatars/${newProfileImage.filename}`;
    } else {
     
      updateUserDto.profileImageUrl = user.profileImageUrl || `http://localhost:4000/users/avatars/${this.defaultProfileImage}`;
    }
  
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }


  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    this.deleteOldProfileImage(path.basename(user.profileImageUrl)); 
    await this.userRepository.remove(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  async findUsersByCriteria(criteria: any): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    if (criteria.email) {
      queryBuilder.andWhere('user.email = :email', { email: criteria.email });
    }
    if (criteria.username) {
      const usernamesArray = criteria.username.split(',').map(username => username.trim());
      queryBuilder.andWhere('user.username IN (:...usernames)', { usernames: usernamesArray });
    }
    
    return await queryBuilder.getMany();
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
