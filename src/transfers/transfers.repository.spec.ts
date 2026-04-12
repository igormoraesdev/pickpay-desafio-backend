import { describe, it, expect, beforeEach } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { createTestDb } from 'src/infra/database/testing';
import { DrizzleAsyncProvider } from 'src/infra/database/drizzle.provider';
import { TransfersRepository } from './transfers.repository';
import { WalletsRepository } from '../wallets/wallets.repository';
import { UsersRepository } from '../users/users.repository';

describe('TransfersRepository', () => {
  let repository: TransfersRepository;
  let walletsRepository: WalletsRepository;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const db = createTestDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersRepository,
        WalletsRepository,
        UsersRepository,
        { provide: DrizzleAsyncProvider, useValue: db },
      ],
    }).compile();

    repository = module.get<TransfersRepository>(TransfersRepository);
    walletsRepository = module.get<WalletsRepository>(WalletsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should create a transfer', async () => {
    const transfer = await repository.create({
      payee: 1,
      payer: 2,
      value: 100.0,
    });

    expect(transfer).toBeDefined();
    expect(transfer.id).toBe(1);
    expect(transfer.value).toBe(100);
    expect(transfer.payer).toBe(2);
    expect(transfer.payee).toBe(1);
    expect(transfer.status).toBe('pending');
    expect(transfer.notified).toBe(false);
  });

  it('should find trasnfer by id', async () => {
    const transfer = await repository.create({
      payee: 1,
      payer: 2,
      value: 100.0,
    });

    const [transferFinded] = await repository.findById(transfer.id);

    expect(transfer).toBeDefined();
    expect(transferFinded.id).toBe(transfer.id);
  });

  it('should find trasnfer by pending notifications', async () => {
    const transfer = await repository.create({
      payee: 1,
      payer: 2,
      value: 100.0,
    });

    const [transferFinded] = await repository.findPendingNotifications();

    expect(transfer).toBeDefined();
    expect(transferFinded.id).toBe(transfer.id);
    expect(transferFinded.notified).toBe(false);
  });

  it('should mark transfer notified', async () => {
    const transfer = await repository.create({
      payee: 1,
      payer: 2,
      value: 100.0,
    });

    expect(transfer).toBeDefined();
    expect(transfer.notified).toBe(false);

    await repository.markAsNotified(transfer.id);

    const [updateTransfer] = await repository.findById(transfer.id);

    expect(updateTransfer.notified).toBe(true);
  });

  it('should execute a transfer atomically', async () => {
    const payer = await usersRepository.create({
      name: 'Igor',
      email: 'igor@email.com',
      password: 'x',
      cpfCnpj: '111',
      type: 'payer',
    });
    const payee = await usersRepository.create({
      name: 'Ana',
      email: 'ana@email.com',
      password: 'x',
      cpfCnpj: '222',
      type: 'payee',
    });

    const payerWallet = await walletsRepository.create({ userId: payer.id, balance: 500 });
    const payeeWallet = await walletsRepository.create({ userId: payee.id, balance: 100 });

    const transfer = await repository.executeTransfer({
      payerWalletId: payerWallet.id,
      payeeWalletId: payeeWallet.id,
      payerNewBalance: 400,
      payeeNewBalance: 200,
      value: 100,
    });

    expect(transfer.value).toBe(100);
    expect(transfer.payer).toBe(payerWallet.id);
    expect(transfer.payee).toBe(payeeWallet.id);
    expect(transfer.status).toBe('completed');

    const [updatedPayer] = await walletsRepository.findById(payerWallet.id);
    const [updatedPayee] = await walletsRepository.findById(payeeWallet.id);
    expect(updatedPayer.balance).toBe(400);
    expect(updatedPayee.balance).toBe(200);
  });
});
