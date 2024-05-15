import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  ValueTransformer,
} from 'typeorm';
import { IsString, IsUrl, Length, IsInt, IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

export class DecimalColumnTransformer implements ValueTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  @IsUrl()
  link: string;

  @Column()
  @IsString()
  @IsUrl()
  image: string;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  @IsNumber()
  price: number;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  @IsNumber()
  raised: number;

  @Column()
  @Length(2, 1024)
  description: string;

  @Column()
  @IsInt()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
