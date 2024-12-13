import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Country } from '../auth/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
