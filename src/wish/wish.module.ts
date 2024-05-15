import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { Wish } from './entities/wish.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Wish])],
  controllers: [WishController],
  providers: [WishService, ConfigService],
  exports: [WishService],
})
export class WishModule {}
