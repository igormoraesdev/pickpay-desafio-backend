import { IsInt, IsOptional } from 'class-validator';

export class UpdateWalletDto {
  @IsInt()
  @IsOptional()
  balance?: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}
