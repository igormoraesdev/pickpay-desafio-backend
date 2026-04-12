import { CreateTransfersDto } from './create-transfers.dto';
import { TransfersDto } from './transfers.dto';

export interface ITransfersRepository {
  create(data: CreateTransfersDto): Promise<TransfersDto>;
  findById(id: number): Promise<TransfersDto[]>;
  findPendingNotifications(): Promise<TransfersDto[]>;
  markAsNotified(id: number): Promise<void>;
}

export const TRANSFERS_REPOSITORY = Symbol('TRANSFERS_REPOSITORY');
