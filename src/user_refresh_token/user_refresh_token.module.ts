import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRefreshToken } from './user_refresh_token.entity';
import { UserRefreshTokenService } from './user_refresh_token.service';
import { AuthJwtModule } from '../jwt/jwt.module';
@Module({
  imports: [TypeOrmModule.forFeature([UserRefreshToken]), AuthJwtModule],
  controllers: [],
  providers: [UserRefreshTokenService],
  exports: [UserRefreshTokenService],
})
export class UserRefreshTokenModule {}
