import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { JwtPayloadDto, JwtResponseDto } from './jwt.dto';
import { UsersRepository } from 'src/users/users.repository';
import { USERS_REPOSITORY } from 'src/users/user.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<JwtResponseDto> {
    const [user] = await this.userRepository.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return { userId: user.id, email: user.email };
  }
}
