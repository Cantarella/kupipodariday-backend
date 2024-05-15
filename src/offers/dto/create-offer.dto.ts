import { IsBoolean, IsNumber } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wish/entities/wish.entity';

export class CreateOfferDto {
  user: DeepPartial<User>;
  item: DeepPartial<Wish>;

  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
