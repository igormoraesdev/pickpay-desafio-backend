import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WALLETS_REPOSITORY } from './wallets.repository.interface';
import { WalletsRepository } from './wallets.repository';
import { CreateWalletDto } from './create-wallet.dto';
import { WalletDto } from './wallet.dto';
import { UpdateWalletDto } from './update-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(
    @Inject(WALLETS_REPOSITORY)
    private readonly walletsRepository: WalletsRepository) { }

  async registerWallet(dto: CreateWalletDto): Promise<WalletDto> {
    const { userId } = dto;

    const existingWallet =
      await this.walletsRepository.findById(userId);

    if (existingWallet.length > 0) {
      throw new BadRequestException(
        'User already has wallet',
      );
    }

    return this.walletsRepository.create(dto);
  }

  async findById(id: number): Promise<WalletDto> {
    const [wallet] =
      await this.walletsRepository.findById(id);

    if (!wallet) {
      throw new NotFoundException(
        'Wallet not found',
      );
    }

    return wallet
  }

  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<WalletDto> {
    await this.findById(id);

    return this.walletsRepository.update(updateWalletDto);
  }
}