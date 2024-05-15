import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async validatePassword(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const checkingPasswordResult = await bcrypt.compare(
      password,
      user.password,
    );
    if (user && checkingPasswordResult) {
      const { ...result } = user;

      return result;
    }
    throw new UnauthorizedException();
  }

  async hidePassword(user: CreateUserDto) {
    const { password } = user;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    user.password = hash;
    return user;
  }
}
