import { Inject, Injectable } from '@nestjs/common';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import * as schema from '../infra/database/schema';
import { DrizzleAsyncProvider } from '../infra/database/drizzle.provider';
import { ITransfersRepository } from './transfers.repository.interface';
import { CreateTransfersDto } from './create-transfers.dto';
import { TransfersDto } from './transfers.dto';
import { transfers } from './transfers.entity';
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
}
