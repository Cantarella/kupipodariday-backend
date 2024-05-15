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
import { AuthGuard } from '../auth/auth.guard';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    createWishDto.owner = req.user.sub;
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

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const editingAllowed = await this.wishService.isOwner(
      +id,
      parseInt(req.user.sub),
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const deletingAllowed = await this.wishService.isOwner(
      +id,
      parseInt(req.user.sub),
    );
    if (!deletingAllowed) {
      throw new UnauthorizedException('Можно удалять только свои желания');
    }
    return this.wishService.remove(+id);
  }
}
