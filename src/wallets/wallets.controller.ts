import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './create-wallet.dto';
import { UpdateWalletDto } from './update-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletsService.registerWallet(createWalletDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.walletsService.findById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(Number(id), updateWalletDto);
  }
}
