import { Exclude, Expose } from "class-transformer";
import { IsInt } from "class-validator";

@Exclude()
export class WalletDto {
  @Expose()
  id: number;

  @IsInt()
  balance: number;

  @Expose()
  userId: number;
}