import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private generateBookingCode(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `MP-${yyyy}${mm}${dd}-${randomHex}`;
  }

  async create(dto: CreateBookingDto) {
    const bookingCode = this.generateBookingCode();

    const booking = await this.prisma.booking.create({
      data: {
        bookingCode,
        customerName: dto.customerName.trim(),
        whatsappNumber: dto.whatsappNumber.trim(),
        serviceName: dto.serviceName,
        packageName: dto.packageName,
        shootDate: new Date(dto.shootDate),
        preferredTime: dto.preferredTime,
        location: dto.location.trim(),
        notes: dto.notes ? dto.notes.trim() : null,
        estimatedPrice: dto.estimatedPrice ? Number(dto.estimatedPrice) : null,
        status: BookingStatus.PENDING,
      },
    });

    // Format WhatsApp message
    const settings = await this.prisma.contactSetting.findFirst();
    const targetPhone = settings?.whatsappNumber || this.configService.get<string>('DEFAULT_WHATSAPP_NUMBER') || '6281234567890';

    // Clean phone number: remove '+' or non-digit
    const cleanTargetPhone = targetPhone.replace(/\D/g, '');

    const formattedDate = new Date(dto.shootDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const lines = [
      `Halo *MOMEN.POTRAIT*, saya ingin mengonfirmasi permintaan booking sesi fotografi:`,
      ``,
      `🔖 *Kode Booking:* ${bookingCode}`,
      `👤 *Nama:* ${dto.customerName}`,
      `📱 *No. WhatsApp:* ${dto.whatsappNumber}`,
      `📷 *Layanan:* ${dto.serviceName}`,
      `📦 *Paket:* ${dto.packageName}`,
      `📅 *Tanggal:* ${formattedDate}`,
      `⏰ *Waktu:* ${dto.preferredTime}`,
      `📍 *Lokasi:* ${dto.location}`,
      dto.notes ? `📝 *Catatan:* ${dto.notes}` : `📝 *Catatan:* -`,
      ``,
      `Mohon informasikan konfirmasi ketersediaan jadwal dan panduan persiapan sesi. Terima kasih!`,
    ];

    const messageText = lines.join('\n');
    const whatsappUrl = `https://wa.me/${cleanTargetPhone}?text=${encodeURIComponent(messageText)}`;

    return {
      success: true,
      booking,
      whatsappUrl,
      message: 'Permintaan booking berhasil disimpan dengan status PENDING. Silakan lanjutkan konfirmasi ke WhatsApp tim kami.',
    };
  }

  async findAllAdmin(query: {
    search?: string;
    status?: BookingStatus;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, fromDate, toDate, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { bookingCode: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { whatsappNumber: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (fromDate || toDate) {
      where.shootDate = {};
      if (fromDate) {
        where.shootDate.gte = new Date(fromDate);
      }
      if (toDate) {
        where.shootDate.lte = new Date(toDate);
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundException(`Booking ID ${id} tidak ditemukan.`);
    }
    return booking;
  }

  async updateStatus(id: string, status: BookingStatus) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
