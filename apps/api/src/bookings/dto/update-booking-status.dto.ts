import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, { message: 'Status booking harus PENDING, CONFIRMED, COMPLETED, atau CANCELLED' })
  @IsNotEmpty({ message: 'Status wajib diisi' })
  status: BookingStatus;
}
