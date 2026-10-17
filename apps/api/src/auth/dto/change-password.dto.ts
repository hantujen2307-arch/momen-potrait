import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6, { message: 'Password baru minimal 6 karakter.' })
  newPassword: string;
}

export class UpdateProfileDto {
  @IsString()
  name: string;
}
