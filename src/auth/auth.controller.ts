import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Post, Body, Request } from '@nestjs/common';
import { LocalGuard } from './local-guard.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async login(@Request() req) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const userDtoWithHiddenPassword =
      await this.authService.hidePassword(createUserDto);
    const user = await this.usersService.create(userDtoWithHiddenPassword);

    return this.authService.auth(user);
  }
}
