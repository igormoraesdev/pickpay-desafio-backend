import { CreateWalletDto } from "../dto/create-wallet.dto";
import { UpdateWalletDto } from "../dto/update-wallet.dto";
import { WalletDto } from "../dto/wallet.dto";

export interface IWalletsRepository {
  findById(id: number): Promise<WalletDto[]>;
  findByUserId(userId: number): Promise<WalletDto[]>;
  create(data: CreateWalletDto): Promise<WalletDto>;
  update(data: UpdateWalletDto): Promise<WalletDto>;
}

export const WALLETS_REPOSITORY = Symbol('WALLETS_REPOSITORY');