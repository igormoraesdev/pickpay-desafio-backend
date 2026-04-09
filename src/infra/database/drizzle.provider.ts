import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { Provider } from '@nestjs/common';
import * as schema from './schema';

export const DrizzleAsyncProvider = 'drizzleProvider';

export const DrizzleProvider: Provider<BetterSQLite3Database<typeof schema>>[] = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: () => {
      const sqlite = new Database(process.env.DATABASE_URL);
      const db = drizzle(sqlite, { schema });
      return db;
    },
  },
];
