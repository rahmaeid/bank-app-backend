import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtService } from './jwt.service';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION },
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      verifyOptions: {
        ignoreExpiration: false,
      },
    }),
  ],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}
