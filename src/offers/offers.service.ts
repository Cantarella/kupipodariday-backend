import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
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
  ) {}
  async create(wish: Wish, createOfferDto: CreateOfferDto): Promise<Offer> {
    const wishesRepository = this.dataSource.getRepository(Wish);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { amount } = createOfferDto;
      wish.raised += amount;
      await wishesRepository.save(wish);
      const offer = await this.offerRepository.save(createOfferDto);
      await queryRunner.commitTransaction();
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Ошибка создания заявки');
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

  updateOne(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.update(id, updateOfferDto);
  }

  async removeOne(id: number) {
    const user = await this.offerRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Offer с таким id не существует');
    }
    return this.offerRepository.delete(id);
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
