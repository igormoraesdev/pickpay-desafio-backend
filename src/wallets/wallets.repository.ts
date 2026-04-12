import { Inject, Injectable } from '@nestjs/common';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import * as schema from '../infra/database/schema';
import { wallets } from './wallets.entity';
import { DrizzleAsyncProvider } from '../infra/database/drizzle.provider';
import { IWalletsRepository } from './wallets.repository.interface';
import { CreateWalletDto } from './create-wallet.dto';
import { eq } from 'drizzle-orm';
import { UpdateWalletDto } from './update-wallet.dto';
import { WalletDto } from './wallet.dto';

@Injectable()
export class WalletsRepository implements IWalletsRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: BunSQLiteDatabase<typeof schema>,
  ) { }

  async findById(id: number): Promise<WalletDto[]> {
    return this.db
      .select()
      .from(wallets)
      .where(
        eq(wallets.id, id))
  }

  async findByUserId(userId: number): Promise<WalletDto[]> {
    return this.db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
  }

  async create(data: CreateWalletDto): Promise<WalletDto> {
    const [wallet] = await this.db
      .insert(wallets)
      .values(data)
      .returning();

    return wallet;
  }

  async update(data: UpdateWalletDto): Promise<WalletDto> {
    const [wallet] = await this.db
      .update(wallets)
      .set({ balance: data.balance })
      .where(eq(wallets.userId, Number(data.userId)))
      .returning()

    return wallet;
  }
}