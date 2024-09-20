// src/users/user.dto.ts

import { IsNotEmpty, IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string; 
}
