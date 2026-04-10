import { CreateUserDto } from "./create-user.dto";
import { UserDto } from "./user.dto";

export interface IUsersRepository {
  findByEmailOrCpf(email: string, cpfCnpj: string): Promise<any[]>;
  create(data: CreateUserDto): Promise<UserDto>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');