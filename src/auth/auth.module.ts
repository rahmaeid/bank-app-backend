import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthJwtModule } from 'src/jwt/jwt.module';
import { UserRefreshTokenModule } from 'src/user_refresh_token/user_refresh_token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Country } from './entities/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Country]),
    AuthJwtModule,
    UserRefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
