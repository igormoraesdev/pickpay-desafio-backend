import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum UserType {
  PAYEE = 'payee',
  PAYER = 'payer',
}

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  cpfCnpj: string;

  @Expose()
  email: string;

  @IsEnum(UserType)
  type: string;
}
