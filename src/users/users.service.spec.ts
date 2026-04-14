import { describe, it, expect, beforeEach, mock, spyOn } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { BadRequestException } from '@nestjs/common';
import { USERS_REPOSITORY } from './repositories/user.repository.interface';

import * as argon2 from 'argon2';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockRepository = {
    findByEmailOrCpf: mock(),
    create: mock(),
  };

  let hashSpy: ReturnType<typeof spyOn>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USERS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(USERS_REPOSITORY);

    mockRepository.findByEmailOrCpf.mockReset();
    mockRepository.create.mockReset();

    hashSpy = spyOn(argon2, 'hash').mockResolvedValue('hashed-password' as never);
  });

  it('should create user successfully', async () => {
    const dto = {
      name: 'Igor',
      email: 'igor@email.com',
      password: '123456',
      cpfCnpj: '123',
      type: 'payer',
    };

    mockRepository.findByEmailOrCpf.mockResolvedValue([]);

    mockRepository.create.mockResolvedValue({
      id: '1',
      ...dto,
      password: 'hashed-password',
    });

    const result = await service.registerUser(dto as any);

    expect(repository.findByEmailOrCpf).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();
    expect(result.email).toBe(dto.email);
  });

  it('should throw if user already exists', async () => {
    mockRepository.findByEmailOrCpf.mockResolvedValue([{ id: '1' }]);

    await expect(
      service.registerUser({} as any),
    ).rejects.toThrow(BadRequestException);
  });
});
