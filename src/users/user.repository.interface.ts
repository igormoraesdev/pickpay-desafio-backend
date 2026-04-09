export interface IUsersRepository {
  findByEmailOrCpf(email: string, cpfCnpj: string): Promise<any[]>;
  create(data: any): Promise<any>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');