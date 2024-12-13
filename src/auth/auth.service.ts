import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatePayload, ExchangeTokenDTO } from './dto/payload.dto';
import { AuthJwtService } from 'src/jwt/jwt.service';
import { UserRefreshTokenService } from 'src/user_refresh_token/user_refresh_token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './dto/response.dto';
import { TOKEN_TYPE } from './auth.enum';

@Injectable()
export class AuthService {
  constructor(
    public readonly authJwtService: AuthJwtService,
    public readonly refreshTokenService: UserRefreshTokenService,
    @InjectRepository(User)
    public readonly userRepo: Repository<User>,
  ) {}

  async generateAuthTokens(user_id: string): Promise<AuthResponse> {
    const access_token = await this.authJwtService.generateToken(
      user_id,
      TOKEN_TYPE.ACCESS_TOKEN,
    );
    const refresh_token = await this.refreshTokenService.generateToken(user_id);

    return { access_token, refresh_token };
  }

  async authenticate(payload: AuthenticatePayload) {
    const { national_id, password } = payload;
    // check if the user exists
    const user = await this.userRepo.findOne({
      where: [{ national_id }],
      select: ['id', 'password'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // check if the user has a password
    if (!user.password || !bcrypt.compareSync(password, user?.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.generateAuthTokens(
      user.id,
    );

    return {
      access_token,
      refresh_token,
    };
  }

  public async exchangeToken(dto: ExchangeTokenDTO): Promise<AuthResponse> {
    // validate refresh token
    const provided_token = await this.refreshTokenService.validateToken(
      dto.refresh_token,
    );
    if (!provided_token) {
      throw new UnauthorizedException();
    }

    // remove / expire the old refresh_tokens
    await this.refreshTokenService.deleteUserTokens(provided_token.sub);

    // generate new access and refresh tokens
    const { access_token, refresh_token } = await this.generateAuthTokens(
      provided_token.sub,
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
