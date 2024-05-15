import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}
  create(createWishlistDto: CreateWishlistDto) {
    return this.wishlistsRepository.insert(createWishlistDto);
  }

  findAll() {
    return this.wishlistsRepository.find();
  }

  findOne(id: number) {
    return this.wishlistsRepository.findOne({ where: { id } });
  }

  updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistsRepository.update(id, updateWishlistDto);
  }

  async removeOne(id: number) {
    const user = await this.wishlistsRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Вышлист с таким id не существует');
    }
    return this.wishlistsRepository.delete(id);
  }

  async isOwner(id: number, authorizedUserId: number) {
    const wish = await this.wishlistsRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
    const { owner } = wish;
    return owner.id === authorizedUserId;
  }
}
