import { IsString, IsUrl, MaxLength } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export class CreateWishlistDto {
  @MaxLength(250)
  name: string;

  @MaxLength(1500)
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  owner: DeepPartial<User>;
}
