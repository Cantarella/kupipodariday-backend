import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  MethodNotAllowedException,
  HttpException,
} from '@nestjs/common';
import { WishService } from '../wish/wish.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wish/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private dataSource: DataSource,
    private readonly wishService: WishService,
  ) {}
  async create(
    wishId: number,
    authorizedUserId: number,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishService.findOneWithOwner(wishId);
      await this.creationAllowed(wish, authorizedUserId);
      const wishesRepository = this.dataSource.getRepository(Wish);
      const { amount } = createOfferDto;
      wish.raised += amount;
      await wishesRepository.save(wish);
      const offer = await this.offerRepository.save(createOfferDto);
      await queryRunner.commitTransaction();
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException(
        `Ошибка создания заявки: ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.offerRepository.find();
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: {
        item: true,
      },
    });
  }

  async creationAllowed(wish: Wish, authorizedUserId: number) {
    if (wish.raised >= wish.price) {
      throw new MethodNotAllowedException('Деньги на этот подарок уже собраны');
    }
    const { id: ownerId } = wish.owner;
    if (ownerId == authorizedUserId) {
      throw new MethodNotAllowedException(
        'Нельзя собирать деньги на свои желания',
      );
    }
    return true;
  }
}
