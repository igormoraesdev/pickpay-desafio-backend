import { sqliteTable, integer, numeric } from 'drizzle-orm/sqlite-core';
import { users } from '../users/users.entity';

export const wallets = sqliteTable('wallets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  balance: numeric('balance', { mode: 'number' }).notNull().default(0),
  userId: integer().notNull().references(() => users.id),
})