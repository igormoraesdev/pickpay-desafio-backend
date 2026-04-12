import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TRANSFERS_REPOSITORY } from './transfers.repository.interface';
import { TransfersRepository } from './transfers.repository';
import { WALLETS_REPOSITORY } from 'src/wallets/wallets.repository.interface';
import { WalletsRepository } from 'src/wallets/wallets.repository';
import { USERS_REPOSITORY } from 'src/users/user.repository.interface';
import { UsersRepository } from 'src/users/users.repository';
import { WalletDto } from 'src/wallets/wallet.dto';
import { AuthorizationDto } from './authorization.dto';
import { UserDto } from 'src/users/user.dto';
import { TransfersDto } from './transfers.dto';
import { CreateTransfersDto } from './create-transfers.dto';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(
    @Inject(TRANSFERS_REPOSITORY)
    private readonly transfersRepository: TransfersRepository,
    @Inject(WALLETS_REPOSITORY)
    private readonly walletRepository: WalletsRepository,
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: UsersRepository,
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

    const notified = await this.sendNotification(payee);
    if (notified) {
      await this.transfersRepository.markAsNotified(transfer.id);
      this.logger.log(`Notification sent for transfer #${transfer.id}`);
    }
    return transfer;
  }

  private async sendNotification(userId: number): Promise<boolean> {
    try {
      const response = await fetch('https://util.devi.tools/api/v1/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async retryPendingNotifications() {
    const pending = await this.transfersRepository.findPendingNotifications();
    console.log('pending', pending);
    for (const transfer of pending) {
      const notified = await this.sendNotification(transfer.payee);
      if (notified) {
        await this.transfersRepository.markAsNotified(transfer.id);
        this.logger.log(`Notification sent for transfer #${transfer.id}`);
      }
    }
  }
}
