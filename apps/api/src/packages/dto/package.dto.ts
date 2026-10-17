import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tier: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  coverImageUrl: string;

  @IsOptional()
  galleryImages?: any;

  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  priceNote?: string;

  @IsInt()
  durationMinutes: number;

  @IsInt()
  editedPhotoCount: number;

  @IsOptional()
  @IsBoolean()
  includesOriginalFiles?: boolean;

  @IsOptional()
  @IsString()
  originalFileDeliveryDetails?: string;

  @IsOptional()
  @IsString()
  deliveryFormats?: string;

  @IsOptional()
  @IsString()
  outfitCount?: string;

  @IsOptional()
  @IsString()
  conceptCount?: string;

  @IsOptional()
  @IsString()
  locationCount?: string;

  @IsOptional()
  @IsString()
  deliveryEstimate?: string;

  @IsNotEmpty()
  benefits: any;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  badgeLabel?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @IsOptional()
  @IsString()
  serviceId?: string;
}

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  galleryImages?: any;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsString()
  priceNote?: string;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsInt()
  editedPhotoCount?: number;

  @IsOptional()
  @IsBoolean()
  includesOriginalFiles?: boolean;

  @IsOptional()
  @IsString()
  originalFileDeliveryDetails?: string;

  @IsOptional()
  @IsString()
  deliveryFormats?: string;

  @IsOptional()
  @IsString()
  outfitCount?: string;

  @IsOptional()
  @IsString()
  conceptCount?: string;

  @IsOptional()
  @IsString()
  locationCount?: string;

  @IsOptional()
  @IsString()
  deliveryEstimate?: string;

  @IsOptional()
  benefits?: any;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  badgeLabel?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @IsOptional()
  @IsString()
  serviceId?: string;
}
