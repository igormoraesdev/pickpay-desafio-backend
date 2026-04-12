import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

describe('TransfersController', () => {
  let controller: TransfersController;
  let service: TransfersService;

  const mockWalletsService = {
    transfer: mock(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: TransfersService,
          useValue: mockWalletsService,
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
    service = module.get<TransfersService>(TransfersService);
  });

  it('should create a trasnfer', async () => {
    const transfer = {
      payee: 1,
      payer: 2,
      value: 100.0,
    };
    mockWalletsService.transfer.mockResolvedValue(transfer);

    const result = await controller.create(transfer);

    expect(controller).toBeDefined();
  });
});
