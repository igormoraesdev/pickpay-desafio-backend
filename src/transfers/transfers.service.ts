import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRANSFERS_REPOSITORY } from './repositories/transfers.repository.interface';
import { TransfersRepository } from './repositories/transfers.repository';
import { WALLETS_REPOSITORY } from '@wallets/repositories/wallets.repository.interface';
import { WalletsRepository } from '@wallets/repositories/wallets.repository';
import { USERS_REPOSITORY } from '@users/repositories/user.repository.interface';
import { UsersRepository } from '@users/repositories/users.repository';
import { WalletDto } from '@wallets/dto/wallet.dto';
import { AuthorizationDto } from './dto/authorization.dto';
import { UserDto } from '@users/dto/user.dto';
import { TransfersDto } from './dto/transfers.dto';
import { CreateTransfersDto } from './dto/create-transfers.dto';
import { NotificationsService } from '@notifications/notifications.service';

@Injectable()
export class TransfersService {
  constructor(
    @Inject(TRANSFERS_REPOSITORY)
    private readonly transfersRepository: TransfersRepository,
    @Inject(WALLETS_REPOSITORY)
    private readonly walletRepository: WalletsRepository,
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: UsersRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async fetchAuthorization(): Promise<AuthorizationDto> {
    try {
      const response = await fetch('https://util.devi.tools/api/v2/authorize');
      const data = response.json() as Promise<AuthorizationDto>;
      return data;
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async findWalletByUserId(userId: number): Promise<WalletDto> {
    const [wallet] = await this.walletRepository.findByUserId(userId);
    return wallet;
  }

  async findUser(id: number): Promise<UserDto> {
    const [user] = await this.userRepository.findById(id);
    return user;
  }

  async transfer({ payer, payee, value }: CreateTransfersDto): Promise<TransfersDto> {
    const payerItem = await this.findUser(payer);
    const payeeItem = await this.findUser(payee);
    const walletPayer = await this.findWalletByUserId(payer);
    const walletPayee = await this.findWalletByUserId(payee);

    if (!payerItem || !payeeItem) {
      throw new NotFoundException('Payer or Payee not found');
    }
    if (!walletPayer || !walletPayee) {
      throw new NotFoundException('Wallet not found');
    }
    if (payerItem.type === 'payee') {
      throw new ForbiddenException("Payee can't transfer");
    }
    if (walletPayer.balance < value) {
      throw new ForbiddenException('Insuficient balance to transfer');
    }

    const authorizationResponse = await this.fetchAuthorization();

    if (!authorizationResponse.data.authorization) {
      throw new ForbiddenException('Transfer failed, try again later');
    }

    const transfer = await this.transfersRepository.executeTransfer({
      payerWalletId: walletPayer.id,
      payeeWalletId: walletPayee.id,
      payerNewBalance: walletPayer.balance - value,
      payeeNewBalance: walletPayee.balance + value,
      value,
    });

    await this.notificationsService.notifyTransfer(transfer.id, payee);
    return transfer;
  }
}
