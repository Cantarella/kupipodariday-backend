import { Controller } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Post, Body, Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signin')
  async signin(@Req() req) {
    const { password, email } = req.body;
    const user = await this.authService.validatePassword(email, password);
    return this.authService.auth(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const userDtoWithHiddenPassword =
      await this.authService.hidePassword(createUserDto);
    const user = await this.usersService.create(userDtoWithHiddenPassword);

    return this.authService.auth(user);
  }
}
