import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.contactSetting.findFirst();
    if (!settings) {
      settings = await this.prisma.contactSetting.create({
        data: {
          studioName: 'MOMEN.POTRAIT',
          tagline: 'Every Moment Tells a Story.',
          whatsappNumber: '6285157335443',
          email: 'halo@momenpotrait.com',
          instagram: '@momen.potrait',
          serviceArea: 'Sesuai konfirmasi & kesepakatan pemesanan',
          transportPolicy: 'Biaya transportasi dikonfirmasi secara transparan untuk sesi di luar area operasional utama.',
          operatingHours: 'Senin - Minggu: 08:30 - 20:30 WIB',
        },
      });
    }
    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const current = await this.getSettings();
    return this.prisma.contactSetting.update({
      where: { id: current.id },
      data: dto,
    });
  }
}
