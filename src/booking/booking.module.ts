import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { User } from '../auth/entities/user.entity';
import { City } from '../auth/entities/city.entity';
import { Booking } from './entities/booking.entity';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Branch, City, Booking])],
  controllers: [BookingController, BranchController],
  providers: [BookingService, BranchService],
})
export class BookingModule {}
