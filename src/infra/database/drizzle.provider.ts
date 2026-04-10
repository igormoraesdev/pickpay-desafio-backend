import { Database } from 'bun:sqlite';
import { drizzle, type BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import type { Provider } from '@nestjs/common';
import * as schema from './schema';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const DrizzleProvider: Provider<BunSQLiteDatabase<typeof schema>>[] = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: () => {
      const sqlite = new Database(process.env.DATABASE_URL);
      const db = drizzle(sqlite, { schema });
      return db;
    },
  },
];
