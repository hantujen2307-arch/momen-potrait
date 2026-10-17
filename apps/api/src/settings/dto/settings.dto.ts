import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  studioName?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  serviceArea?: string;

  @IsOptional()
  @IsString()
  transportPolicy?: string;

  @IsOptional()
  @IsString()
  operatingHours?: string;

  @IsOptional()
  @IsString()
  bookingNotice?: string;
}
