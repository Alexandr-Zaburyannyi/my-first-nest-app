import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(userData: User) {
    const newUser = this.userRepo.create(userData);
    return this.userRepo.save(newUser);
  }

  findOne(id: number) {
    if (!id) {
      throw new UnauthorizedException('Please provide an id');
    }

    const user = this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  find(email: string) {
    return this.userRepo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepo.remove(user);
  }
}
