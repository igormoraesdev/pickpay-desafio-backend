import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
describe('UsersController', () => {
  let controller: UsersController;
  let service : UsersService;

  const mockUsersService = {
    registerUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService, 
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

  })
  it('should register a user', async () => {
    const dto = {
      name: 'Igor',
      email: 'igor@email.com',
      password: '123456',
      cpfCnpj: '123',
      type: 'payer',
    };

    const userMock = {
      id: '1',
      ...dto,
      password: 'hashed',
    };

    mockUsersService.registerUser.mockResolvedValue(userMock);

    const result = await controller.register(dto as any);

    expect(service.registerUser).toHaveBeenCalledWith(dto);
    expect(result).toMatchObject({
      name: dto.name,
      email: dto.email,
      type: dto.type
    })
  });
})
