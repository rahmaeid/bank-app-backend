import { Injectable, UnauthorizedException } from '@nestjs/common';
import { access_token_payload } from '../auth/auth.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Country } from '../auth/entities/country.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public readonly userRepo: Repository<User>,
    @InjectRepository(Country)
    public readonly countryRepo: Repository<Country>,
  ) {}

  async me({ sub }: access_token_payload) {
    // get the user by id
    const user = await this.userRepo.findOne({
      where: { id: sub },
      relations: ['phone_country', 'city', 'country'],
    });

    if (!user) throw new UnauthorizedException('User not found');

    // convert the user entity to a plain object
    const plainUser = classToPlain(user);

    // return the user
    return plainUser;
  }
}
