import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class JwtPayloadDto {
  @IsNumber()
  @IsNotEmpty()
  sub: number;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class JwtResponseDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  email: string;
}
