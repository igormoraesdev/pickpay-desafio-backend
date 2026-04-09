import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/users.controller';
import { UsersRepository } from './infra/users.repository';
import { USERS_REPOSITORY } from './domain/user.repository.interface';

@Module({
  controllers: [UsersController,],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository
    }
    , UsersRepository],
})
export class UsersModule { }
