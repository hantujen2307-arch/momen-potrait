import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('settings')
  async getPublicSettings() {
    return this.settingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/settings')
  async getAdminSettings() {
    return this.settingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
