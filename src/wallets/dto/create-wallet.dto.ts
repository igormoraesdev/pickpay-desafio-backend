import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsInt()
  @IsNotEmpty()
  balance: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
