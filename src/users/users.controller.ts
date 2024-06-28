import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../serialize/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body as User);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body as User);
    session.userId = user.id;
    return user;
  }

  @Post('logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Get('')
  findAll(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
