import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, Matches } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class CreateManualBookingDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pelanggan wajib diisi' })
  customerName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  whatsappNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama layanan wajib diisi' })
  serviceName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama paket wajib diisi' })
  packageName: string;

  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsNotEmpty({ message: 'Tanggal pemotretan wajib diisi' })
  shootDate: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format jam mulai harus HH:mm (contoh: 09:00)' })
  @IsNotEmpty({ message: 'Jam mulai wajib diisi' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format jam selesai harus HH:mm (contoh: 11:00)' })
  @IsNotEmpty({ message: 'Jam selesai wajib diisi' })
  endTime: string;

  @IsString()
  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  location: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  internalNotes?: string;

  @IsOptional()
  @IsEnum(BookingStatus, { message: 'Status booking tidak valid' })
  status?: BookingStatus;

  @IsOptional()
  estimatedPrice?: number;
}
