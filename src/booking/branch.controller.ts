import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../decorators/user.decorator';
import { BranchService } from './branch.service';

@Controller('branch')
@ApiTags('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @ApiOperation({
    summary: 'Get all Branchs',
  })
  @ApiOkResponse({
    description: 'All Branchs',
  })
  @ApiBearerAuth()
  @Get()
  async getAllBranches(@GetUser() user) {
    return await this.branchService.getAllBranches(user);
  }
}
