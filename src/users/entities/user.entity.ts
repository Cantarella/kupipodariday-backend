import {
  Length,
  IsNotEmpty,
  IsEmail,
  IsUrl,
  IsString,
  IsOptional,
} from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Wish } from '../../wish/entities/wish.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    unique: true,
  })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(2, 200)
  about?: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
