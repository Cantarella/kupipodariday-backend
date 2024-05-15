import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  create(createWishDto: CreateWishDto) {
    return this.wishesRepository.save(createWishDto);
  }

  findAll() {
    return this.wishesRepository.find();
  }

  findOne(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
    });
  }

  findOneWithOffers(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
      relations: {
        offers: true,
      },
    });
  }

  findOneWithOwner(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
  }

  findOneWithOffersAndOwner(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException('Подарка с таким id не существует');
    }
    return this.wishesRepository.delete(id);
  }

  async isPriceChangeAllowed(id): Promise<boolean> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        offers: true,
      },
    });
    return wish.offers.length === 0;
  }
  async incrementWishRaised(id: number, price: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
    });
    const raised = +wish.raised + price;
    return this.wishesRepository.update(id, { raised: raised });
  }

  async isOwner(id: number, authorizedUserId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
    const { owner } = wish;
    return owner.id === authorizedUserId;
  }
}
