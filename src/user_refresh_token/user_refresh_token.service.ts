import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRefreshToken } from './user_refresh_token.entity';
import { AuthJwtService } from '../jwt/jwt.service';
import { TOKEN_TYPE, refresh_token_payload } from '../auth/auth.enum';

@Injectable()
export class UserRefreshTokenService {
  constructor(
    private readonly authJwtService: AuthJwtService,
    @InjectRepository(UserRefreshToken)
    private refreshTokenRepo: Repository<UserRefreshToken>,
  ) {}

  async generateToken(user_id: string) {
    const token = await this.authJwtService.generateToken(
      user_id,
      TOKEN_TYPE.REFRESH_TOKEN,
    );
    const rt = this.refreshTokenRepo.create({ user_id, token });
    this.refreshTokenRepo.save(rt);
    return token;
  }

  async validateToken(
    token: string,
  ): Promise<refresh_token_payload | undefined> {
    try {
      const decoded = await this.authJwtService.decodeToken(
        token,
        TOKEN_TYPE.REFRESH_TOKEN,
      );
      const refreshToken = await this.refreshTokenRepo.findOne({
        where: { token },
      });
      if (!refreshToken) {
        return undefined;
      }
      return decoded;
    } catch (e) {
      throw e;
    }
  }

  async deleteUserTokens(user_id: string) {
    await this.refreshTokenRepo.delete({ user_id });
  }
}
