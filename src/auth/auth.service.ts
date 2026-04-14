import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { USERS_REPOSITORY } from '@users/repositories/user.repository.interface';
import { UsersRepository } from '@users/repositories/users.repository';
import { verify } from 'argon2';
import { UserDto } from '@users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateByEmail(loginDto: LoginDto): Promise<UserDto> {
    const [user] = await this.userRepository.findByEmailOrCpf(loginDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordMatch = await verify(user.password, loginDto.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(data: LoginDto): Promise<AuthDto> {
    const user = await this.validateByEmail(data);
    const accessToken = this.jwtService.sign({
      sub: user.id,
      name: user.name,
      cpfOrCnpj: user.cpfCnpj,
      email: user.email,
      type: user.type,
    });
    return { accessToken };
  }
}
