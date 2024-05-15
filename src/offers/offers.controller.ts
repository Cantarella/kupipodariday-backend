import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { WishService } from '../wish/wish.service';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishService: WishService,
  ) {}

  @UseGuards(AuthGuard)
  @Post(':wishId')
  async create(
    @Req() req,
    @Param('wishId') wishId: number,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    const authorizedUserId = req.user.sub;
    const wish = await this.wishService.findOneWithOwner(wishId);
    await this.offersService.creationAllowed(wish, authorizedUserId);
    createOfferDto.user = authorizedUserId;
    return this.offersService.create(wish, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}