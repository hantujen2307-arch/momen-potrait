import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Public Booking Submission
  @Post('bookings')
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  // Admin Protected
  @UseGuards(JwtAuthGuard)
  @Get('admin/bookings')
  async getAdminBookings(
    @Query('search') search?: string,
    @Query('status') status?: BookingStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.findAllAdmin({
      search,
      status,
      fromDate,
      toDate,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/bookings/:id')
  async getBookingDetail(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/bookings/:id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/bookings/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingsService.delete(id);
  }
}
