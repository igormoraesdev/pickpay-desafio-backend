import { CreateUserDto } from './create-user.dto';
import { UserDto } from './user.dto';

export interface IUsersRepository {
  findById(id: number): Promise<UserDto[]>;
  findByEmailOrCpf(email: string, cpfCnpj: string): Promise<UserDto[]>;
  create(data: CreateUserDto): Promise<UserDto>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
