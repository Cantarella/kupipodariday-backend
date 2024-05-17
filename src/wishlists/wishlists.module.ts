import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Wishlist])],
  controllers: [WishlistsController],
  providers: [WishlistsService, ConfigService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
