import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, Like, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserDto)
      .orIgnore()
      .execute();
    result.identifiers = result.identifiers.filter((item) => item);
    if (result.identifiers.length === 0) {
      throw new InternalServerErrorException(
        'Такой пользователь уже зарегистрирован',
      );
    }
    return result.raw[0];
  }

  async getMyProfile(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        wishes: true,
        offers: true,
        wishlists: true,
      },
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findOneWithWishes(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });
  }

  async getMyWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });
    return user.wishes;
  }

  async updateOne(
    id: number,
    authorizedUserId: number,
    updateUserDto: UpdateUserDto,
  ) {
    if (authorizedUserId !== id) {
      throw new UnauthorizedException(
        'Можно редактировать только свой профиль',
      );
    }
    try {
      const user = await this.usersRepository.update(id, updateUserDto);
      return user;
    } catch (err) {
      if (err.code == '23505') {
        throw new InternalServerErrorException(
          'Такой пользователь уже зарегистрирован',
        );
      }
    }
  }

  async removeOne(id: number, authorizedUserId: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException('Пользователь с таким id не существует');
    else if (authorizedUserId !== user.id)
      throw new ForbiddenException(
        'Удалять можно только свой собственный профиль',
      );
    return this.usersRepository.delete(id);
  }

  findMany(query: string) {
    this.usersRepository.find({
      where: [{ username: ILike(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  findByUserName(query: string) {
    return this.usersRepository.find({
      where: { username: ILike(`%${query}%`) },
    });
  }

  findWishesByUserName(query: string) {
    return this.usersRepository.find({
      where: { username: ILike(`%${query}%`) },
      relations: {
        wishes: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      select: {
        id: true,
        email: true,
        password: true,
      },
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('Неправильные почта или пароль');
    }
    return user;
  }
}
