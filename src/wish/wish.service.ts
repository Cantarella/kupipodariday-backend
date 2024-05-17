import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wishlist } from '../wishlists/entities/wishlist.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}
  create(createWishDto: CreateWishDto) {
    return this.wishesRepository.save(createWishDto);
  }

  findAll() {
    return this.wishesRepository.find();
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
    });
    if (!wish)
      throw new NotFoundException(`Подарок с таким id: ${id}  не найден`);
    return wish;
  }

  async findOneWithOffers(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        offers: true,
      },
    });
    if (!wish)
      throw new NotFoundException(`Подарок с таким id: ${id}  не найден`);
    return wish;
  }

  async findOneWithOwner(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
    if (!wish)
      throw new NotFoundException(`Подарок с таким id: ${id}  не найден`);
    return wish;
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

  async update(
    id: number,
    authorizedUserId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const editingAllowed = await this.isOwner(+id, authorizedUserId);
    if (!editingAllowed) {
      throw new ForbiddenException('Можно редактировать только свои желания');
    }
    const priceChangeAllowed = await this.isPriceChangeAllowed(id);
    if (!priceChangeAllowed) delete updateWishDto.price;
    if ('raised' in updateWishDto) delete updateWishDto.raised;
    return this.wishesRepository.update(id, updateWishDto);
  }

  async remove(id: number, authorizedUserId: number) {
    const deletingAllowed = await this.isOwner(+id, +authorizedUserId);
    if (!deletingAllowed) {
      throw new UnauthorizedException('Можно удалять только свои желания');
    }

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

  async isOwner(wishId: number, authorizedUserId: number) {
    const wish = await this.findOneWithOwner(wishId);
    const { owner } = wish;
    return owner.id !== authorizedUserId;
  }

  async copy(id: number, authorizedUserId: number, wishlistId: number) {
    const copyingPermitted = await this.isOwner(+id, authorizedUserId);
    if (!copyingPermitted)
      throw new BadRequestException(
        'Нельзя добавлять свои подарки в списки своих желаний',
      );
    const wishListsRepository = this.dataSource.getRepository(Wishlist);
    const wishList = await wishListsRepository.findOne({
      where: { id: wishlistId },
      relations: {
        items: true,
      },
    });
    if (!wishList)
      throw new NotFoundException(
        `Вышлист с указанным id: ${wishlistId} не найден`,
      );
    const wish = await this.findOne(id);

    if (!wishList.items.includes(wish)) {
      wishList.items.push(wish);
      wish.copied += 1;
      await wishListsRepository.save(wishList);
      await this.wishesRepository.save(wish);
    } else
      throw new BadRequestException(
        'Нельзя добавить один и тот же подарок, в свой профиль, дважды',
      );

    return { message: 'success' };
  }
}
