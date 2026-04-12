import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum TransferStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class TransfersDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNumber()
  @IsNotEmpty()
  payer: number;

  @IsNumber()
  @IsNotEmpty()
  payee: number;

  @IsEnum(TransferStatus)
  @IsNotEmpty()
  status: string;

  notified: boolean;

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;
}
