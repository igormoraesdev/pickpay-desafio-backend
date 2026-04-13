import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: mock(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockAuthService.login.mockReset();
  });

  it('should login and return an access token', async () => {
    const payload = {
      email: 'test@test.com',
      password: '123456',
    };

    mockAuthService.login.mockResolvedValue({ accessToken: 'jwt-token' });

    const result = await controller.login(payload);

    expect(mockAuthService.login).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ accessToken: 'jwt-token' });
  });
});
