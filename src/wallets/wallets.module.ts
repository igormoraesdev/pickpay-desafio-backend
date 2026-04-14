import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WALLETS_REPOSITORY } from './repositories/wallets.repository.interface';
import { WalletsRepository } from './repositories/wallets.repository';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, {
    provide: WALLETS_REPOSITORY,
    useClass: WalletsRepository
  }, WalletsRepository],
  exports: [WALLETS_REPOSITORY],
})
export class WalletsModule { }
