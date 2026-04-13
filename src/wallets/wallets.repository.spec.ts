import { describe, it, expect, beforeEach } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@infra/database/database.module';
import { WalletsRepository } from './wallets.repository';
import { createTestDb } from '@infra/database/testing';
import { DrizzleAsyncProvider } from '@infra/database/drizzle.provider';
import { UsersRepository } from '@users/users.repository';

describe('WalletsRepository', () => {
  let repository: WalletsRepository;
  let userRepository: UsersRepository;

  beforeEach(async () => {
    const db = createTestDb();

    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [WalletsRepository, { provide: DrizzleAsyncProvider, useValue: db }, UsersRepository],
    }).compile();

    repository = module.get<WalletsRepository>(WalletsRepository);
    userRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should create a wallet', async () => {
    const wallet = await repository.create({
      balance: 1000,
      userId: 1,
    });

    expect(wallet).toBeDefined();
    expect(wallet.userId).toBe(1);
  });

  it('should find wallet by id', async () => {
    const wallet = await repository.create({
      balance: 1000,
      userId: 1,
    });

    const result = await repository.findById(wallet.id);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].userId).toBe(1);
  });
  it('should find wallet by user id', async () => {
    const user = await userRepository.create({
      name: 'Igor',
      email: 'igor@email.com',
      password: '123456',
      cpfCnpj: '123',
      type: 'payer',
    });

    await repository.create({
      balance: 1000,
      userId: user.id,
    });

    const result = await repository.findByUserId(user.id);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].userId).toBe(user.id);
  });

  it('should update a wallet', async () => {
    await repository.create({
      balance: 1000,
      userId: 1,
    });

    const walletUpdate = {
      balance: 2000,
      userId: 1,
    };

    const result = await repository.update(walletUpdate);

    expect(result).toBeDefined();
    expect(result.userId).toBe(1);
    expect(result.balance).toBe(2000);
  });

  it('should return empty if user not found', async () => {
    const result = await repository.findById(100);

    expect(result).toEqual([]);
  });
});
