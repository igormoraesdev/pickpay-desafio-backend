import { forwardRef, Module } from '@nestjs/common';
import { NotificationsClient } from './notifications.client';
import { NotificationsService } from './notifications.service';
import { TransfersModule } from '@transfers/transfers.module';
import { WalletsModule } from '@wallets/wallets.module';

@Module({
  imports: [forwardRef(() => TransfersModule), WalletsModule],
  providers: [NotificationsClient, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
