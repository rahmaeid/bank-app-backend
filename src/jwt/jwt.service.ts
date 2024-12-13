import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TOKEN_TYPE,
  access_token_payload,
  refresh_token_payload,
} from '../auth/auth.enum';

@Injectable()
export class AuthJwtService {
  constructor(private jwtService: JwtService) {}

  async decodeToken(
    token: string,
    token_type: TOKEN_TYPE,
  ): Promise<access_token_payload | refresh_token_payload | undefined> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret:
          token_type == TOKEN_TYPE.REFRESH_TOKEN
            ? process.env.JWT_REFRESH_TOKEN_SECRET
            : process.env.JWT_ACCESS_TOKEN_SECRET,
        ignoreExpiration: false,
      });
      return decoded;
    } catch (error) {
      return undefined;
    }
  }

  async generateToken(sub: string, token_type: TOKEN_TYPE): Promise<string> {
    const payload = { sub };

    const token = await this.jwtService.signAsync(payload, {
      secret:
        token_type == TOKEN_TYPE.REFRESH_TOKEN
          ? process.env.JWT_REFRESH_TOKEN_SECRET
          : process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn:
        token_type == TOKEN_TYPE.REFRESH_TOKEN
          ? process.env.JWT_REFRESH_TOKEN_EXPIRATION
          : process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });
    return token;
  }
}
