import { Inject, Injectable } from '@nestjs/common';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import * as schema from '@infra/database/schema';
import { DrizzleAsyncProvider } from '@infra/database/drizzle.provider';
import { ExecuteTransferInput, ITransfersRepository } from './transfers.repository.interface';
import { CreateTransfersDto } from '../dto/create-transfers.dto';
import { TransferStatus, TransfersDto } from '../dto/transfers.dto';
import { transfers } from '../entities/transfers.entity';
import { wallets } from '@wallets/entities/wallets.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class TransfersRepository implements ITransfersRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: BunSQLiteDatabase<typeof schema>,
  ) {}

  async create(data: CreateTransfersDto): Promise<TransfersDto> {
    const [transfer] = await this.db.insert(transfers).values(data).returning();
    return transfer;
  }

  findById(id: number): Promise<TransfersDto[]> {
    return this.db.select().from(transfers).where(eq(transfers.id, id));
  }

  findPendingNotifications(): Promise<TransfersDto[]> {
    return this.db.select().from(transfers).where(eq(transfers.notified, false));
  }

  async markAsNotified(id: number): Promise<void> {
    await this.db.update(transfers).set({ notified: true }).where(eq(transfers.id, id));
  }

  async executeTransfer(input: ExecuteTransferInput): Promise<TransfersDto> {
    const [transfer] = await this.db.transaction(async (tx) => {
      await tx.update(wallets).set({ balance: input.payerNewBalance }).where(eq(wallets.id, input.payerWalletId));
      await tx.update(wallets).set({ balance: input.payeeNewBalance }).where(eq(wallets.id, input.payeeWalletId));
      return tx
        .insert(transfers)
        .values({
          value: input.value,
          payer: input.payerWalletId,
          payee: input.payeeWalletId,
          status: TransferStatus.COMPLETED,
        })
        .returning();
    });
    return transfer;
  }
}
