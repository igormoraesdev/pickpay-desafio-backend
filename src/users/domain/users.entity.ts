import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  cpfCnpj: text('cpf_cnpj').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  type: text('type', { enum: ['payee', 'payer'] })
    .notNull()
    .default('payee'),
});

export type User = typeof users.$inferSelect;