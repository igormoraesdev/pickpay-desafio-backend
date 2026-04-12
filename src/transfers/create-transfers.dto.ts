import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransfersDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @IsNotEmpty()
  payer: number;

  @IsNumber()
  @IsNotEmpty()
  payee: number;
}
