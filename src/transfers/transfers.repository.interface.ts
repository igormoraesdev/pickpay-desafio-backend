import { CreateTransfersDto } from './create-transfers.dto';
import { TransfersDto } from './transfers.dto';

export interface ExecuteTransferInput {
  payerWalletId: number;
  payeeWalletId: number;
  payerNewBalance: number;
  payeeNewBalance: number;
  value: number;
}

export interface ITransfersRepository {
  create(data: CreateTransfersDto): Promise<TransfersDto>;
  findById(id: number): Promise<TransfersDto[]>;
  findPendingNotifications(): Promise<TransfersDto[]>;
  markAsNotified(id: number): Promise<void>;
  executeTransfer(input: ExecuteTransferInput): Promise<TransfersDto>;
}

export const TRANSFERS_REPOSITORY = Symbol('TRANSFERS_REPOSITORY');
