import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // wishes?: DeepPartial<Wishhhhh>[];
  offers?: DeepPartial<Offer>[];
  wishlists?: DeepPartial<Wishlist>[];
}
