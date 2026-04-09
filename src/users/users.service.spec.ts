import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BadRequestException } from '@nestjs/common';
import { hash } from 'argon2';
import { USERS_REPOSITORY } from './user.repository.interface';

jest.mock('argon2', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockRepository = {
    findByEmailOrCpf: jest.fn(),
    create: jest.fn(),
  };

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

    jest.clearAllMocks();
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
    (hash as jest.Mock).mockResolvedValue('hashed-password');

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