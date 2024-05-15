import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { WishModule } from '../wish/wish.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Offer]), WishModule],
  controllers: [OffersController],
  providers: [OffersService, ConfigService],
})
export class OffersModule {}
