import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../decorators/user.decorator';
import { CreateBookingDto } from './dto/create_booking.dto';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({
    summary: 'Get user bookings',
  })
  @ApiOkResponse({
    description: 'User bookings',
  })
  @ApiBearerAuth()
  @Get()
  async getUserBookings(@GetUser() user) {
    return await this.bookingService.getUserBookings(user);
  }

  @ApiOperation({
    summary: 'Get today active user bookings',
  })
  @ApiOkResponse({
    description: 'Today active user bookings',
  })
  @ApiBearerAuth()
  @Get('today')
  async getTodayActiveUserBookings(@GetUser() user) {
    return await this.bookingService.getTodayActiveUserBookings(user);
  }

  @ApiOperation({
    summary: 'Create booking',
  })
  @ApiOkResponse({
    description: 'Created booking',
  })
  @ApiBearerAuth()
  @Post('')
  async createBooking(
    @GetUser() user,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return await this.bookingService.createBooking(user, createBookingDto);
  }

  @ApiOperation({
    summary: 'Create booking',
  })
  @ApiOkResponse({
    description: 'Created booking',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async cancelBooking(
    @GetUser() user,
    @Param('id', ParseUUIDPipe) booking_id: string,
  ) {
    return await this.bookingService.cancelBooking(user, booking_id);
  }
}
