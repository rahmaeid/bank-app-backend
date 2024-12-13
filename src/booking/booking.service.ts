import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Between, In, LessThan, Repository } from 'typeorm';
import { access_token_payload } from '../auth/auth.enum';
import { BookingStatus } from './enums/booking_status.enum';
import { CreateBookingDto } from './dto/create_booking.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    public readonly bookingRepo: Repository<Booking>,
    @InjectRepository(User)
    public readonly userRepo: Repository<User>,
  ) {}

  async getUserBookings({ sub }: access_token_payload) {
    return this.bookingRepo.find({ where: { user_id: sub } });
  }

  async getRemainingBookingsCount(
    bookingId: string,
    today: Date,
    tomorrow: Date,
  ) {
    // Get the current booking by ID
    const currentBooking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['branch'],
    });
    if (!currentBooking) {
      throw new BadRequestException('Booking not found');
    }

    // Count all bookings created before the current booking for the same branch on the same date
    const count = await this.bookingRepo.count({
      where: {
        branch_id: currentBooking.branch_id,
        date: Between(today, tomorrow),
        created_at: LessThan(currentBooking.created_at),
        status: In([BookingStatus.PENDING, BookingStatus.IN_PROGRESS]),
      },
    });

    return count;
  }

  async getTodayActiveUserBookings({ sub }: access_token_payload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of the next day

    const my_bookings = await this.bookingRepo.find({
      where: {
        user_id: sub,
        date: Between(today, tomorrow),
        status: In([BookingStatus.PENDING, BookingStatus.IN_PROGRESS]),
      },
      relations: ['branch'],
    });

    const remainingBookingsCountPromises = my_bookings.map((booking) =>
      this.getRemainingBookingsCount(booking.id, today, tomorrow),
    );

    const remainingBookingsCount = await Promise.all(
      remainingBookingsCountPromises,
    );

    my_bookings.forEach((booking, index) => {
      booking['remaining_bookings_count'] = remainingBookingsCount[index];
    });

    return my_bookings;
  }

  async createBooking(
    { sub }: access_token_payload,
    createBookingDto: CreateBookingDto,
  ) {
    const { branch_id, date } = createBookingDto;
    // validate the user is exist
    const user = await this.userRepo.findOne({ where: { id: sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // check if date is in the past
    // note createBookingDto.date is a string
    if (new Date(createBookingDto.date) < new Date()) {
      throw new BadRequestException('Date should be in the future');
    }
    // check if the user has a booking on the same date
    const today = new Date(date);
    today.setHours(0, 0, 0, 0); // Start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of the next day

    const my_bookings = await this.bookingRepo.find({
      where: {
        user_id: sub,
        date: Between(today, tomorrow),
        status: In([BookingStatus.PENDING, BookingStatus.IN_PROGRESS]),
      },
    });

    if (my_bookings.length > 0) {
      throw new BadRequestException("You've already booked for this day");
    }

    // create the booking
    const booking = this.bookingRepo.create({
      ...createBookingDto,
      user_id: sub,
      status: BookingStatus.PENDING,
    });

    await this.bookingRepo.save(booking);
  }

  async cancelBooking({ sub }: access_token_payload, booking_id: string) {
    // check if the user is exist
    const user = await this.userRepo.findOne({ where: { id: sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // check if the booking is exist
    const booking = await this.bookingRepo.findOne({
      where: { id: booking_id, user_id: sub },
    });
    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    // check if the booking is not completed
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Booking is completed');
    }

    // cancel the booking
    booking.status = BookingStatus.CANCELLED;
    await this.bookingRepo.save(booking);
  }
}
