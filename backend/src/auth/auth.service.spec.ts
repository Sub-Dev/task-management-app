// src/auth/auth.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '..//user/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(new User()), 
          },
        },
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if valid', async () => {
      const user = await authService.validateUser('test@example.com', 'password'); 
      expect(user).toBeDefined();
    });

    it('should return null if invalid', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      const user = await authService.validateUser('test@example.com', 'password'); 
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access_token', async () => {
      const result = await authService.login({ email: 'test@example.com', id: 1 } as User);
      expect(result.access_token).toBeDefined();
    });
  });
});
