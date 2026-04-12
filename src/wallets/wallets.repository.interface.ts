import { CreateWalletDto } from "./create-wallet.dto";
import { UpdateWalletDto } from "./update-wallet.dto";
import { WalletDto } from "./wallet.dto";

export interface IWalletsRepository {
  findById(id: number): Promise<WalletDto[]>;
  findByUserId(userId: number): Promise<WalletDto[]>;
  create(data: CreateWalletDto): Promise<WalletDto>;
  update(data: UpdateWalletDto): Promise<WalletDto>;
}

export const WALLETS_REPOSITORY = Symbol('WALLETS_REPOSITORY');