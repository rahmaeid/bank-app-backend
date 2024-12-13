import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class AuthResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}
