import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsClient } from './notifications.client';
import { TRANSFERS_REPOSITORY } from '../transfers/transfers.repository.interface';
import { WALLETS_REPOSITORY } from '../wallets/wallets.repository.interface';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const client = {
    send: mock(),
  };
  const transfersRepository = {
    markAsNotified: mock(),
    findPendingNotifications: mock(),
  };
  const walletsRepository = {
    findById: mock(),
  };

  beforeEach(async () => {
    client.send.mockReset();
    transfersRepository.markAsNotified.mockReset();
    transfersRepository.findPendingNotifications.mockReset();
    walletsRepository.findById.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationsClient, useValue: client },
        { provide: TRANSFERS_REPOSITORY, useValue: transfersRepository },
        { provide: WALLETS_REPOSITORY, useValue: walletsRepository },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should mark as notified when client succeeds', async () => {
    client.send.mockResolvedValueOnce(true);

    await service.notifyTransfer(99, 1);

    expect(client.send).toHaveBeenCalledWith(1);
    expect(transfersRepository.markAsNotified).toHaveBeenCalledWith(99);
  });

  it('should not mark as notified when client fails', async () => {
    client.send.mockResolvedValueOnce(false);

    await service.notifyTransfer(99, 1);

    expect(client.send).toHaveBeenCalledWith(1);
    expect(transfersRepository.markAsNotified).not.toHaveBeenCalled();
  });

  it('should retry pending notifications resolving userId from wallet', async () => {
    transfersRepository.findPendingNotifications.mockResolvedValueOnce([
      { id: 1, payee: 10 },
      { id: 2, payee: 20 },
    ]);
    walletsRepository.findById
      .mockResolvedValueOnce([{ id: 10, balance: 0, userId: 100 }])
      .mockResolvedValueOnce([{ id: 20, balance: 0, userId: 200 }]);
    client.send
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await service.retryPendingNotifications();

    expect(walletsRepository.findById).toHaveBeenNthCalledWith(1, 10);
    expect(walletsRepository.findById).toHaveBeenNthCalledWith(2, 20);
    expect(client.send).toHaveBeenNthCalledWith(1, 100);
    expect(client.send).toHaveBeenNthCalledWith(2, 200);
    expect(transfersRepository.markAsNotified).toHaveBeenCalledTimes(1);
    expect(transfersRepository.markAsNotified).toHaveBeenCalledWith(1);
  });

  it('should skip pending transfer when its wallet is missing', async () => {
    transfersRepository.findPendingNotifications.mockResolvedValueOnce([{ id: 1, payee: 999 }]);
    walletsRepository.findById.mockResolvedValueOnce([]);

    await service.retryPendingNotifications();

    expect(client.send).not.toHaveBeenCalled();
    expect(transfersRepository.markAsNotified).not.toHaveBeenCalled();
  });
});
