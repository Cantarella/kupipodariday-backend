import { Module } from '@nestjs/common';
import process from "process";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offers/entities/offer.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { WishModule } from './wish/wish.module';
import { Wish } from './wish/entities/wish.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import 'reflect-metadata';
import SystemConfig from "./system-config";
const DatabaseConfig = SystemConfig().database;
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [SystemConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DatabaseConfig.host,
      port: parseInt(DatabaseConfig.port),
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [User, Wishlist, Offer, Wish],
      synchronize: true,
    }),
    UsersModule,
    WishlistsModule,
    OffersModule,
    WishModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
