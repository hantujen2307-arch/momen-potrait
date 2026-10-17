import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, Matches } from 'class-validator';

export class CreateScheduleBlockDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul blokir jadwal wajib diisi (contoh: Libur Studio / Maintenance)' })
  title: string;

  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsNotEmpty({ message: 'Tanggal blokir wajib diisi' })
  blockDate: string;

  @IsBoolean()
  isAllDay: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format jam mulai harus HH:mm' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format jam selesai harus HH:mm' })
  endTime?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
