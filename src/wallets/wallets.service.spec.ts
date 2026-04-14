import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsRepository } from './repositories/wallets.repository';
import { WALLETS_REPOSITORY } from './repositories/wallets.repository.interface';

describe('WalletsService', () => {
  let service: WalletsService;
  let repository: WalletsRepository;

  const mockRepository = {
    create: mock(),
    findById: mock(),
    update: mock(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: WALLETS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    repository = module.get(WALLETS_REPOSITORY);

    mockRepository.create.mockReset();
    mockRepository.findById.mockReset();
    mockRepository.update.mockReset();
  });

  it('should create wallet successfully', async () => {
    const dto = {
      balance: 1000,
      userId: 1,
    };

    mockRepository.findById.mockResolvedValue([]);

    mockRepository.create.mockResolvedValue(dto);

    const result = await service.registerWallet(dto);

    expect(repository.create).toHaveBeenCalled();
    expect(repository.findById).toHaveBeenCalled();
    expect(result.userId).toBe(dto.userId);
  });

  it('should update wallet successfully', async () => {
    const createWallet = {
      balance: 1000,
      userId: 1,
    };

    mockRepository.findById.mockResolvedValue([]);

    mockRepository.create.mockResolvedValue(createWallet);

    const result = await service.registerWallet(createWallet);

    mockRepository.findById.mockResolvedValue([createWallet]);

    createWallet.balance = 2000;

    mockRepository.update.mockResolvedValue(createWallet);

    await service.update(result.id, createWallet);

    expect(repository.findById).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
    expect(result.userId).toBe(createWallet.userId);
  });

  it('should throw if wallet already exists', async () => {
    mockRepository.findById.mockResolvedValue([{ id: '1' }]);

    await expect(
      service.registerWallet({} as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if wallet not found on findById', async () => {
    mockRepository.findById.mockResolvedValue([]);

    await expect(
      service.findById(999),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if wallet not found on update', async () => {
    mockRepository.findById.mockResolvedValue([]);

    await expect(
      service.update(999, { balance: 2000 }),
    ).rejects.toThrow(NotFoundException);
  });
});
