import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: 'CPF/CNPJ inválido' })
  cpfCnpj: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(['payee', 'payer'], {message: 'type must be either payer or payee'})
  @IsNotEmpty()
  type: 'payee' | 'payer';
}
