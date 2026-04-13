import { Inject, Injectable } from '@nestjs/common';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import * as schema from '@infra/database/schema';
import { users } from './users.entity';
import { eq, or } from 'drizzle-orm';
import { DrizzleAsyncProvider } from '@infra/database/drizzle.provider';
import { IUsersRepository } from './user.repository.interface';
import { CreateUserDto } from './create-user.dto';
import { UserDto } from './user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: BunSQLiteDatabase<typeof schema>,
  ) {}

  async findById(id: number): Promise<UserDto[]> {
    return this.db.select().from(users).where(eq(users.id, id));
  }

  async findByEmailOrCpf(email: string, cpfCnpj?: string) {
    return this.db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.cpfCnpj, cpfCnpj ?? '')));
  }

  async create(data: CreateUserDto) {
    const [user] = await this.db.insert(users).values(data).returning();

    return user;
  }
}
