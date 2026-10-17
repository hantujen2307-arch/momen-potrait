import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  customerName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  whatsappNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Pilihan layanan wajib dipilih' })
  serviceName: string;

  @IsString()
  @IsNotEmpty({ message: 'Pilihan paket wajib dipilih' })
  packageName: string;

  @IsDateString({}, { message: 'Format tanggal pemotretan tidak valid' })
  @IsNotEmpty({ message: 'Tanggal pemotretan wajib diisi' })
  shootDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Preferensi waktu wajib dipilih' })
  preferredTime: string;

  @IsString()
  @IsNotEmpty({ message: 'Lokasi pemotretan wajib diisi' })
  location: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  estimatedPrice?: number;
}

