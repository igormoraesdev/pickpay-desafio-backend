import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { users } from '../../users/domain/users.entity';

export const transfers = sqliteTable('transfers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  value: integer('value').notNull(),
  payerId: integer('payer_id')
    .notNull()
    .references(() => users.id),
  payeeId: integer('payee_id')
    .notNull()
    .references(() => users.id),
});
