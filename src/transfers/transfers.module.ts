import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TRANSFERS_REPOSITORY } from './transfers.repository.interface';
import { TransfersRepository } from './transfers.repository';
import { WalletsModule } from '../wallets/wallets.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [WalletsModule, UsersModule],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    {
      provide: TRANSFERS_REPOSITORY,
      useClass: TransfersRepository,
    },
    TransfersRepository,
  ],
})
export class TransfersModule {}
