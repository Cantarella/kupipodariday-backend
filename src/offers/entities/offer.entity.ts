import { IsDefined, IsNumber } from 'class-validator';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  DecimalColumnTransformer,
  Wish,
} from '../../wish/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  @IsDefined()
  @IsNumber()
  item: Wish;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  @IsNumber()
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
