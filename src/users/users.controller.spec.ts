import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'a@b.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'asdf',
          } as User,
        ]);
      },
      // update: () => {},
      // remove: () => {},
    };
    fakeAuthService = {
      signin: ({ email, password }) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // signup: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAll('a@b.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a@b.com');
  });
  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
  it('find user with invalid id throws an error', async () => {
    fakeUsersService.findOne = () => null;

    try {
      await controller.findUser('1');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.login(
      { email: 'a@b.com', password: '123' },
      session,
    );
    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(1);
  });
});
