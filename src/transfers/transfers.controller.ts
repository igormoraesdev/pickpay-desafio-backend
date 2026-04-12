import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransfersDto } from './create-transfers.dto';
import { TransfersDto } from './transfers.dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createTransferDto: CreateTransfersDto): Promise<TransfersDto> {
    return this.transfersService.transfer(createTransferDto);
  }
}
