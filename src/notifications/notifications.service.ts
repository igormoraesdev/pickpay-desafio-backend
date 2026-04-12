import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsClient } from './notifications.client';
import { TRANSFERS_REPOSITORY } from '../transfers/transfers.repository.interface';
import { TransfersRepository } from '../transfers/transfers.repository';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly client: NotificationsClient,
    @Inject(TRANSFERS_REPOSITORY)
    private readonly transfersRepository: TransfersRepository,
  ) {}

  async notifyTransfer(transferId: number, userId: number): Promise<void> {
    const notified = await this.client.send(userId);
    if (notified) {
      await this.transfersRepository.markAsNotified(transferId);
      this.logger.log(`Notification sent for transfer #${transferId}`);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async retryPendingNotifications(): Promise<void> {
    const pending = await this.transfersRepository.findPendingNotifications();
    for (const transfer of pending) {
      await this.notifyTransfer(transfer.id, transfer.payee);
    }
  }
}
