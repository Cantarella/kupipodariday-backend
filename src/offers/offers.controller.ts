import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-guard.service';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private dataSource: DataSource,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':wishId')
  async create(
    @Req() req,
    @Param('wishId') wishId: number,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    const { userId: authorizedUserId } = req.user;
    createOfferDto.user = authorizedUserId;
    return await this.offersService.create(
      wishId,
      authorizedUserId,
      createOfferDto,
    );
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
