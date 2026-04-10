import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
describe('WalletsController', () => {
  let controller: WalletsController;
  let service: WalletsService;

  const mockUsersService = {
    registerWallet: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    service = module.get<WalletsService>(WalletsService);

  })
  it('should register a wallet', async () => {
    const wallet = {
      balance: 1000,
      userId: 1
    };

    mockUsersService.registerWallet.mockResolvedValue(wallet);

    const result = await controller.create(wallet);

    expect(service.registerWallet).toHaveBeenCalledWith(wallet);
    expect(result).toMatchObject({
      balance: wallet.balance,
      userId: wallet.userId
    })
  });

  it('should find a wallet', async () => {
    const wallet = {
      balance: 1000,
      userId: 1
    };

    mockUsersService.registerWallet.mockResolvedValue(wallet);

    await controller.create(wallet);

    mockUsersService.findById.mockResolvedValue(wallet);

    const findWallet = await controller.findOne('1');

    expect(service.findById).toHaveBeenCalledWith(1);
    expect(findWallet).toMatchObject({
      balance: wallet.balance,
      userId: wallet.userId
    })
  });

  it('should update a wallet', async () => {
    const updateDto = { balance: 2000 };
    const updatedWallet = { balance: 2000, userId: 1 };

    mockUsersService.update.mockResolvedValue(updatedWallet);

    const result = await controller.update('1', updateDto);

    expect(service.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toMatchObject({
      balance: 2000,
      userId: 1
    })
  });
})
