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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    createWishlistDto.owner = req.user.sub;
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const editingAllowed = await this.wishlistsService.isOwner(
      +id,
      parseInt(req.user.sub),
    );
    if (!editingAllowed) {
      throw new UnauthorizedException(
        'Можно редактировать только свои вышлисты',
      );
    }
    return this.wishlistsService.updateOne(+id, updateWishlistDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const deletingAllowed = await this.wishlistsService.isOwner(
      +id,
      parseInt(req.user.sub),
    );
    if (!deletingAllowed) {
      throw new UnauthorizedException(
        'Можно удалять только свои списки подарков',
      );
    }
    return this.wishlistsService.removeOne(+id);
  }
}
