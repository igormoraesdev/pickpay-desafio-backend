import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../infra/database/database.module';
import { DrizzleAsyncProvider } from '../infra/database/drizzle.provider';
import { WalletsRepository } from './wallets.repository';

describe('WalletsRepository', () => {
  let repository: WalletsRepository;
  let db: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [WalletsRepository],
    }).compile();

    repository = module.get<WalletsRepository>(WalletsRepository);
    db = module.get(DrizzleAsyncProvider);

    await db.run(`DROP TABLE IF EXISTS wallets`);

    await db.run(`
      CREATE TABLE wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        balance NUMERIC NOT NULL DEFAULT 0,
        userId INTEGER NOT NULL
      )
    `);
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

    const result = await repository.findById(
      wallet.id
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].userId).toBe(1);
  });

  it('should update a wallet', async () => {
    await repository.create({
      balance: 1000,
      userId: 1,
    });

    const walletUpdate = {
      balance: 2000,
      userId: 1,
    }

    const result = await repository.update(walletUpdate)

    expect(result).toBeDefined();
    expect(result.userId).toBe(1);
    expect(result.balance).toBe(2000);
  });

  it('should return empty if user not found', async () => {
    const result = await repository.findById(
      2
    );

    expect(result).toEqual([]);
  });
});