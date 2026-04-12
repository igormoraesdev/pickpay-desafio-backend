import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsClient } from './notifications.client';
import { TRANSFERS_REPOSITORY } from '../transfers/transfers.repository.interface';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const client = {
    send: mock(),
  };
  const transfersRepository = {
    markAsNotified: mock(),
    findPendingNotifications: mock(),
  };

  beforeEach(async () => {
    client.send.mockReset();
    transfersRepository.markAsNotified.mockReset();
    transfersRepository.findPendingNotifications.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationsClient, useValue: client },
        { provide: TRANSFERS_REPOSITORY, useValue: transfersRepository },
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

  it('should retry pending notifications and mark only the successful ones', async () => {
    transfersRepository.findPendingNotifications.mockResolvedValueOnce([
      { id: 1, payee: 5 },
      { id: 2, payee: 6 },
    ]);
    client.send
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await service.retryPendingNotifications();

    expect(client.send).toHaveBeenNthCalledWith(1, 5);
    expect(client.send).toHaveBeenNthCalledWith(2, 6);
    expect(transfersRepository.markAsNotified).toHaveBeenCalledTimes(1);
    expect(transfersRepository.markAsNotified).toHaveBeenCalledWith(1);
  });
});
