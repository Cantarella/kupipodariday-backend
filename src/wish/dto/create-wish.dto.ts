import { IsString, IsUrl, Length, IsInt, IsNumber } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

export class CreateWishDto {
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsNumber()
  raised: number;

  @Length(2, 1024)
  description: string;

  @IsInt()
  copied: number;

  owner: DeepPartial<User>;

  offers: DeepPartial<Offer>[];

  wishlists: DeepPartial<Wishlist>[];
}
