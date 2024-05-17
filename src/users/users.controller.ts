import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-guard.service';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req) {
    const authorizedUser = req.user;
    return this.usersService.getMyProfile(+authorizedUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  getMyWishes(@Req() req) {
    const authorizedUser = req.user;
    return this.usersService.getMyWishes(+authorizedUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const authorizedUserId = req.user.userId;
    return this.usersService.updateOne(+id, +authorizedUserId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const { userId } = req.user;
    return this.usersService.removeOne(+id, userId);
  }

  @Get(':userName')
  findByUserName(@Param('userName') userName: string) {
    return this.usersService.findByUserName(userName);
  }
  @Get(':userName/wishes')
  findByWishesByUserName(@Param('userName') userName: string) {
    return this.usersService.findWishesByUserName(userName);
  }
  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    if (query === undefined || query === null || query === '')
      throw new BadRequestException('Пустая строка для поиска');
    return this.usersService.findMany(query);
  }
}
