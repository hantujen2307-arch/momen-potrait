import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateManualBookingDto } from './dto/create-manual-booking.dto';
import { UpdateManualBookingDto } from './dto/update-manual-booking.dto';
import { CreateScheduleBlockDto } from './dto/create-schedule-block.dto';

@Controller()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // ==========================================
  // PUBLIC CALENDAR ENDPOINTS
  // ==========================================

  @Get('calendar/month')
  async getPublicMonth(
    @Query('year') yearStr?: string,
    @Query('month') monthStr?: string,
  ) {
    const now = new Date();
    const year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();
    const month = monthStr ? parseInt(monthStr, 10) : now.getMonth() + 1;

    if (isNaN(year) || isNaN(month)) {
      throw new BadRequestException('Parameter tahun dan bulan harus berupa angka valid');
    }

    return this.calendarService.getPublicMonthSummary(year, month);
  }

  @Get('calendar/date')
  async getPublicDate(@Query('date') dateStr?: string) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new BadRequestException('Parameter tanggal wajib disertakan dengan format YYYY-MM-DD');
    }

    return this.calendarService.getPublicDateSlots(dateStr);
  }

  // ==========================================
  // ADMIN CALENDAR ENDPOINTS (PROTECTED)
  // ==========================================

  @UseGuards(JwtAuthGuard)
  @Get('admin/calendar/month')
  async getAdminMonth(
    @Query('year') yearStr?: string,
    @Query('month') monthStr?: string,
  ) {
    const now = new Date();
    const year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();
    const month = monthStr ? parseInt(monthStr, 10) : now.getMonth() + 1;

    return this.calendarService.getAdminMonthView(year, month);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/calendar/date')
  async getAdminDate(@Query('date') dateStr?: string) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new BadRequestException('Parameter tanggal wajib format YYYY-MM-DD');
    }

    return this.calendarService.getAdminDateView(dateStr);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/calendar/booking')
  async createManualBooking(@Body() dto: CreateManualBookingDto) {
    return this.calendarService.createManualBooking(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/calendar/booking/:id')
  async updateManualBooking(
    @Param('id') id: string,
    @Body() dto: UpdateManualBookingDto,
  ) {
    return this.calendarService.updateManualBooking(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/calendar/block')
  async createScheduleBlock(@Body() dto: CreateScheduleBlockDto) {
    return this.calendarService.createScheduleBlock(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/calendar/block/:id')
  async deleteScheduleBlock(@Param('id') id: string) {
    return this.calendarService.deleteScheduleBlock(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/calendar/blocks')
  async getScheduleBlocks() {
    return this.calendarService.getAllScheduleBlocks();
  }
}
