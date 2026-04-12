import { describe, it, expect, beforeEach } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { DrizzleAsyncProvider } from '../infra/database/drizzle.provider';
import { createTestDb } from '../infra/database/testing';

describe('UsersRepository', () => {
  let repository: UsersRepository;

  beforeEach(async () => {
    const db = createTestDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: DrizzleAsyncProvider, useValue: db },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should create a user', async () => {
    const user = await repository.create({
      name: 'Igor',
      email: 'igor@email.com',
      password: '123456',
      cpfCnpj: '123',
      type: 'payer',
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('igor@email.com');
  });

  it('should find user by email or cpf', async () => {
    await repository.create({
      name: 'Igor',
      email: 'igor@email.com',
      password: '123456',
      cpfCnpj: '123',
      type: 'payer',
    });

    const result = await repository.findByEmailOrCpf('igor@email.com', '123');

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].email).toBe('igor@email.com');
  });

  it('should find user by id', async () => {
    const user = await repository.create({
      name: 'Igor',
      email: 'igor@email.com',
      password: '123456',
      cpfCnpj: '123',
      type: 'payer',
    });

    const result = await repository.findById(user.id);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe(user.id);
  });

  it('should return empty if user not found', async () => {
    const result = await repository.findByEmailOrCpf('naoexiste@email.com', '000');

    expect(result).toEqual([]);
  });
});
