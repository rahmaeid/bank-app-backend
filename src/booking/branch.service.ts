import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { access_token_payload } from '../auth/auth.enum';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    public readonly branchRepo: Repository<Branch>,
  ) {}

  async getAllBranches({ sub }: access_token_payload) {
    return this.branchRepo.find({
      relations: ['city', 'country'],
    });
  }
}
