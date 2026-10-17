import { IsString, IsOptional } from 'class-validator';

export class UpdateHomepageContentDto {
  @IsOptional()
  @IsString()
  heroHeadline?: string;

  @IsOptional()
  @IsString()
  heroDescription?: string;

  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @IsOptional()
  @IsString()
  heroPrimaryCtaText?: string;

  @IsOptional()
  @IsString()
  heroPrimaryCtaLink?: string;

  @IsOptional()
  @IsString()
  heroSecondaryCtaText?: string;

  @IsOptional()
  @IsString()
  heroSecondaryCtaLink?: string;

  @IsOptional()
  @IsString()
  aboutTitle?: string;

  @IsOptional()
  @IsString()
  aboutTagline?: string;

  @IsOptional()
  @IsString()
  aboutDescription?: string;

  @IsOptional()
  @IsString()
  ctaHeadline?: string;

  @IsOptional()
  @IsString()
  ctaDescription?: string;

  @IsOptional()
  @IsString()
  ctaButtonText?: string;

  @IsOptional()
  @IsString()
  ctaButtonLink?: string;

  @IsOptional()
  faqItems?: any;

  @IsOptional()
  @IsString()
  footerText?: string;
}
