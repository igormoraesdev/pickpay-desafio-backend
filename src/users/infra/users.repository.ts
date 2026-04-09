import { Inject, Injectable } from '@nestjs/common';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../../infra/database/schema';
import { users } from '../domain/users.entity';
import { eq, or } from 'drizzle-orm';
import { DrizzleAsyncProvider } from '../../infra/database/drizzle.provider';
import { IUsersRepository } from '../domain/user.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) { }

  async findByEmailOrCpf(email: string, cpfCnpj: string) {
    return this.db
      .select()
      .from(users)
      .where(
        or(eq(users.email, email), eq(users.cpfCnpj, cpfCnpj)),
      );
  }

  async create(data: any) {
    const [user] = await this.db
      .insert(users)
      .values(data)
      .returning();

    return user;
  }
}