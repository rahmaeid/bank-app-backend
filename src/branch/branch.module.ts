import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../auth/entities/country.entity';
import { City } from '../auth/entities/city.entity';
import { Branch } from './entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, City, Branch])],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
