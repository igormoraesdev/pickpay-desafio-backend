import { sqliteTable, integer, numeric, text } from 'drizzle-orm/sqlite-core';
import { wallets } from '../wallets/wallets.entity';
import { sql } from 'drizzle-orm';

export const transfers = sqliteTable('transfers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: numeric('value', { mode: 'number' }).notNull(),
  payer: integer('payer')
    .notNull()
    .references(() => wallets.id),
  payee: integer('payee')
    .notNull()
    .references(() => wallets.id),
  status: text('status', { enum: ['pending', 'completed', 'failed'] })
    .notNull()
    .default('pending'),
  notified: integer('notified', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Transfer = typeof transfers.$inferSelect;
