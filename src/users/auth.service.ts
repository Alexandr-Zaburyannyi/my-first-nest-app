import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(userData: User) {
    const { email, password } = userData;
    const user = await this.usersService.find(email);
    if (user.length) {
      throw new BadRequestException('Email in use');
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create({
      email,
      password: hash,
    } as User);
    return newUser;
  }

  async signin(userData: User) {
    const { email, password } = userData;

    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}
