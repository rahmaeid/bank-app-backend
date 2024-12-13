import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthenticatePayload, ExchangeTokenDTO } from './dto/payload.dto';
import { AuthResponse } from './dto/response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:
      'Authenticate a user and return an access token and a refresh token',
  })
  @ApiOkResponse({
    description: 'User authenticated successfully',
  })
  @ApiNotFoundResponse({
    description: 'user not found',
  })
  @HttpCode(200)
  @Public()
  @Post('')
  async authenticate(@Body() payload: AuthenticatePayload) {
    return await this.authService.authenticate(payload);
  }

  @ApiOperation({
    summary:
      'Exchange a refresh_token with a new pair of access and refresh tokens',
  })
  @ApiOkResponse({
    description: 'valid refresh_token, new pair generated successfully',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh_token',
  })
  @HttpCode(200)
  @Public()
  @Post('exchange-token')
  async exchangeToken(@Body() dto: ExchangeTokenDTO) {
    return await this.authService.exchangeToken(dto);
  }
}
