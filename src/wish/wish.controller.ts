import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-guard.service';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto, CopyWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    createWishDto.owner = req.user.userId;
    return this.wishService.create(createWishDto);
  }

  @Get()
  findAll() {
    return this.wishService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishService.update(
      +id,
      parseInt(req.user.userId),
      updateWishDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.wishService.remove(+id, +req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(
    @Req() req,
    @Param('id') id: string,
    @Body() copyWishDto: CopyWishDto,
  ) {
    const { userId } = req.user;
    return this.wishService.copy(+id, userId, copyWishDto.wishlistId);
  }
}
