import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../decorators/user.decorator';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user details',
  })
  @ApiOkResponse({
    description: 'App user details',
  })
  @ApiBearerAuth()
  @Get()
  async getUser(@GetUser() user) {
    return await this.userService.me(user);
  }
}
