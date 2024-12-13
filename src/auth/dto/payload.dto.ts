import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticatePayload {
  @ApiProperty({ default: '29803300201053' })
  @IsString()
  @IsNotEmpty()
  national_id: string;

  @ApiProperty({ default: 'Qwerty123' })
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
