import { describe, it, expect, beforeEach } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../infra/database/database.module';
import { createTestDb } from 'src/infra/database/testing';
import { DrizzleAsyncProvider } from 'src/infra/database/drizzle.provider';
import { TransfersRepository } from './transfers.repository';

describe('TransfersRepository', () => {
  let repository: TransfersRepository;

  beforeEach(async () => {
    const db = createTestDb();

    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [TransfersRepository, { provide: DrizzleAsyncProvider, useValue: db }, TransfersRepository],
    }).compile();

    repository = module.get<TransfersRepository>(TransfersRepository);
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
});
