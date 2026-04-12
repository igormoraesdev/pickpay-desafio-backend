import { Database } from 'bun:sqlite';
import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { join } from 'node:path';
import * as schema from './schema';

export type TestDb = BunSQLiteDatabase<typeof schema>;

const MIGRATIONS_FOLDER = join(__dirname, '../../../drizzle');

export function createTestDb(): TestDb {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  return db;
}
