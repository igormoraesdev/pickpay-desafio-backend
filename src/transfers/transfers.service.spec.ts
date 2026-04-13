import { describe, it, expect, beforeEach, mock, spyOn } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TRANSFERS_REPOSITORY } from './transfers.repository.interface';
import { WALLETS_REPOSITORY } from '@wallets/wallets.repository.interface';
import { USERS_REPOSITORY } from '@users/user.repository.interface';
import { NotificationsService } from '@notifications/notifications.service';

describe('TransfersService', () => {
  let service: TransfersService;

  const transfersRepository = {
    executeTransfer: mock(),
  };
  const walletsRepository = {
    findByUserId: mock(),
  };
  const usersRepository = {
    findById: mock(),
  };
  const notificationsService = {
    notifyTransfer: mock(),
  };

  beforeEach(async () => {
    transfersRepository.executeTransfer.mockReset();
    walletsRepository.findByUserId.mockReset();
    usersRepository.findById.mockReset();
    notificationsService.notifyTransfer.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        { provide: TRANSFERS_REPOSITORY, useValue: transfersRepository },
        { provide: WALLETS_REPOSITORY, useValue: walletsRepository },
        { provide: USERS_REPOSITORY, useValue: usersRepository },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
  });

  const payerUser = { id: 1, name: 'Igor', email: 'igor@email.com', password: 'x', cpfCnpj: '111', type: 'payer' };
  const payeeUser = { id: 2, name: 'Ana', email: 'ana@email.com', password: 'x', cpfCnpj: '222', type: 'payee' };
  const payerWallet = { id: 10, balance: 500, userId: 1 };
  const payeeWallet = { id: 20, balance: 100, userId: 2 };
  const transferResult = {
    id: 99,
    value: 100,
    payer: 10,
    payee: 20,
    status: 'completed',
    notified: false,
    createdAt: '2026-04-12',
  };
  const transferDto = { payer: 1, payee: 2, value: 100 };

  const stubHappyPath = () => {
    usersRepository.findById.mockResolvedValueOnce([payerUser]).mockResolvedValueOnce([payeeUser]);
    walletsRepository.findByUserId.mockResolvedValueOnce([payerWallet]).mockResolvedValueOnce([payeeWallet]);
    transfersRepository.executeTransfer.mockResolvedValueOnce(transferResult);
  };

  it('should fetch authorization', async () => {
    const payload = { status: 'success', data: { authorization: true } };
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => payload,
    } as Response);

    const result = await service.fetchAuthorization();

    expect(fetchMock).toHaveBeenCalledWith('https://util.devi.tools/api/v2/authorize');
    expect(result).toEqual(payload);

    fetchMock.mockRestore();
  });

  it('should throw ForbiddenException when fetch fails', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    await expect(service.fetchAuthorization()).rejects.toThrow(ForbiddenException);

    fetchMock.mockRestore();
  });

  it('should find wallet by user id', async () => {
    const wallet = { id: 1, balance: 500, userId: 1 };

    walletsRepository.findByUserId.mockResolvedValueOnce([wallet]);

    const result = await service.findWalletByUserId(wallet.id);

    expect(walletsRepository.findByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual(wallet);
  });

  it('should find user by id', async () => {
    usersRepository.findById.mockResolvedValueOnce([payerUser]);

    const result = await service.findUser(payerUser.id);

    expect(usersRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(payerUser);
  });

  it('should transfer and delegate notification on happy path', async () => {
    stubHappyPath();
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ data: { authorization: true } }),
    } as Response);

    const result = await service.transfer(transferDto);

    expect(result).toEqual(transferResult);
    expect(transfersRepository.executeTransfer).toHaveBeenCalledWith({
      payerWalletId: payerWallet.id,
      payeeWalletId: payeeWallet.id,
      payerNewBalance: payerWallet.balance - transferDto.value,
      payeeNewBalance: payeeWallet.balance + transferDto.value,
      value: transferDto.value,
    });
    expect(notificationsService.notifyTransfer).toHaveBeenCalledWith(transferResult.id, transferDto.payee);

    fetchMock.mockRestore();
  });

  it('should throw NotFoundException when payer or payee not found', async () => {
    usersRepository.findById.mockResolvedValueOnce([]).mockResolvedValueOnce([payeeUser]);
    walletsRepository.findByUserId.mockResolvedValueOnce([payerWallet]).mockResolvedValueOnce([payeeWallet]);

    await expect(service.transfer(transferDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when wallet not found', async () => {
    usersRepository.findById.mockResolvedValueOnce([payerUser]).mockResolvedValueOnce([payeeUser]);
    walletsRepository.findByUserId.mockResolvedValueOnce([]).mockResolvedValueOnce([payeeWallet]);

    await expect(service.transfer(transferDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when payer is type payee', async () => {
    usersRepository.findById
      .mockResolvedValueOnce([{ ...payerUser, type: 'payee' }])
      .mockResolvedValueOnce([payeeUser]);
    walletsRepository.findByUserId.mockResolvedValueOnce([payerWallet]).mockResolvedValueOnce([payeeWallet]);

    await expect(service.transfer(transferDto)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when balance is insufficient', async () => {
    usersRepository.findById.mockResolvedValueOnce([payerUser]).mockResolvedValueOnce([payeeUser]);
    walletsRepository.findByUserId
      .mockResolvedValueOnce([{ ...payerWallet, balance: 10 }])
      .mockResolvedValueOnce([payeeWallet]);

    await expect(service.transfer(transferDto)).rejects.toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when authorization is denied', async () => {
    stubHappyPath();
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      json: async () => ({ data: { authorization: false } }),
    } as Response);

    await expect(service.transfer(transferDto)).rejects.toThrow(ForbiddenException);

    fetchMock.mockRestore();
  });
});
