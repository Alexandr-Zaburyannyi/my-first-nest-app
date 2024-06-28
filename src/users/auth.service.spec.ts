import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve(users.filter((user) => user.email === email));
      },
      create: ({ email, password }) => {
        const user = {
          id: Math.random(),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return an array of users', async () => {
    expect(service).toBeDefined();
  });

  it('should show salted and hashed password', async () => {
    const user = await service.signup({
      email: 'a@a.com',
      password: '123',
    } as User);

    expect(user.password).not.toEqual('123');

    const { password } = user;
    expect(password).toBeDefined();
  });

  it('should return an effor if user is found', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a@a.com', password: '312fff' } as User,
      ]);

    await expect(
      service.signup({
        email: 'asdflkj@asdlfkj.com',
        password: 'passdflkj',
      } as User),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin({
        email: 'asdflkj@asdlfkj.com',
        password: 'passdflkj',
      } as User),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a@a.com', password: '312fff' } as User,
      ]);
    await expect(
      service.signin({
        email: 'a@a.com',
        password: '312f',
      } as User),
    ).rejects.toThrow(BadRequestException);
  });
  it('returns a user if correct password is provided', async () => {
    await service.signup({
      email: 'a@a.com',
      password: '12345',
    } as User);

    const user = await service.signin({
      email: 'a@a.com',
      password: '12345',
    } as User);
    expect(user).toBeDefined();
  });
});
