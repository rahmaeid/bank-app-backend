import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ default: '58aa35e3-cada-4c4c-b567-f70b98bc88e1' })
  @IsString()
  @IsNotEmpty()
  branch_id: string;

  @ApiProperty({ required: true, default: '2024-12-15T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
