import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticatePayload {
  @ApiProperty({ default: '11223344556677' })
  @IsString()
  @IsNotEmpty()
  national_id: string;

  @ApiProperty({ default: 'Aa1234567' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ExchangeTokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
