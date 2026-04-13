import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { USERS_REPOSITORY } from '@users/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userFromDb: { id: number; email: string; password: string };

  const usersRepository = {
    findByEmailOrCpf: mock(),
    findById: mock(),
    create: mock(),
  };

  const jwtService = {
    sign: mock(() => 'jwt-token'),
  };

  beforeEach(async () => {
    usersRepository.findByEmailOrCpf.mockReset();
    jwtService.sign.mockReset().mockReturnValue('jwt-token');

    userFromDb = {
      id: 1,
      email: 'igor@email.com',
      password: await hash('123456'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USERS_REPOSITORY, useValue: usersRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateByEmail', () => {
    it('returns the user when credentials are valid', async () => {
      usersRepository.findByEmailOrCpf.mockResolvedValue([userFromDb]);

      const result = await service.validateByEmail({
        email: 'igor@email.com',
        password: '123456',
      });

      expect(result).toEqual(userFromDb);
    });

    it('throws when user is not found', async () => {
      usersRepository.findByEmailOrCpf.mockResolvedValue([]);

      await expect(service.validateByEmail({ email: 'x@x.com', password: 'y' })).rejects.toThrow(UnauthorizedException);
    });

    it('throws when password does not match', async () => {
      usersRepository.findByEmailOrCpf.mockResolvedValue([userFromDb]);

      await expect(service.validateByEmail({ email: 'igor@email.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('signs a token with sub/email and never with the password', async () => {
      usersRepository.findByEmailOrCpf.mockResolvedValue([userFromDb]);

      const result = await service.login({
        email: 'igor@email.com',
        password: '123456',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userFromDb.id,
        email: userFromDb.email,
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });
  });
});
