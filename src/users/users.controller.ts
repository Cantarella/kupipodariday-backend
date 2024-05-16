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
  UnauthorizedException,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const authorizedUser = req.user;
    if (authorizedUser.userId !== parseInt(id)) {
      throw new UnauthorizedException(
        'Можно редактировать только свой профиль',
      );
    }
    return this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeOne(+id);
  }

  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    if (query === undefined || query === null || query === '')
      throw new BadRequestException('Пустая строка для поиска');
    return this.usersService.findMany(query);
  }
}
