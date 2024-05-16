import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-guard.service';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

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
    const editingAllowed = await this.wishService.isOwner(
      +id,
      parseInt(req.user.userId),
    );
    if (!editingAllowed) {
      throw new UnauthorizedException(
        'Можно редактировать только свои желания',
      );
    }
    const priceChangeAllowed = await this.wishService.isPriceChangeAllowed(id);
    if (!priceChangeAllowed) delete updateWishDto.price;
    if ('raised' in updateWishDto) delete updateWishDto.raised;
    return this.wishService.update(+id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const deletingAllowed = await this.wishService.isOwner(
      +id,
      parseInt(req.user.userId),
    );
    if (!deletingAllowed) {
      throw new UnauthorizedException('Можно удалять только свои желания');
    }
    return this.wishService.remove(+id);
  }
}
