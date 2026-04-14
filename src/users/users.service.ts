import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { UsersRepository } from './repositories/users.repository';
import { USERS_REPOSITORY } from './repositories/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository) { }

  async registerUser(dto: CreateUserDto) {
    const { cpfCnpj, email } = dto;

    const existingUser =
      await this.usersRepository.findByEmailOrCpf(email, cpfCnpj);

    if (existingUser.length > 0) {
      throw new BadRequestException(
        'CPF/CNPJ or email already in use',
      );
    }

    const hashedPassword = await hash(dto.password);

    return this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }
}