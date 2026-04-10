import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WALLETS_REPOSITORY } from './wallets.repository.interface';
import { WalletsRepository } from './wallets.repository';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, {
    provide: WALLETS_REPOSITORY,
    useClass: WalletsRepository
  }, WalletsRepository],
})
export class WalletsModule { }
