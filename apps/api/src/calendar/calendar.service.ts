import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, Prisma } from '@prisma/client';
import { CreateManualBookingDto } from './dto/create-manual-booking.dto';
import { UpdateManualBookingDto } from './dto/update-manual-booking.dto';
import { CreateScheduleBlockDto } from './dto/create-schedule-block.dto';

export interface CalendarSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  status: 'AVAILABLE' | 'CONFIRMED' | 'PENDING' | 'BLOCKED';
  isBookable: boolean;
  bookingCode?: string; // only if admin or safe reference
}

export interface DaySummary {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  status: 'AVAILABLE' | 'CONFIRMED' | 'PENDING' | 'BLOCKED' | 'FULL';
  hasConfirmed: boolean;
  hasPending: boolean;
  isBlocked: boolean;
  blockTitle?: string;
  availableSlotsCount: number;
  totalSlotsCount: number;
}

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  // Standard preset slots for MOMEN.POTRAIT editorial studio sessions
  public readonly PRESET_SLOTS = [
    { id: 'slot-1', startTime: '08:30', endTime: '10:30', label: 'Sesi Pagi 1 (08:30 - 10:30 WIB)' },
    { id: 'slot-2', startTime: '10:30', endTime: '12:30', label: 'Sesi Pagi 2 (10:30 - 12:30 WIB)' },
    { id: 'slot-3', startTime: '13:00', endTime: '15:00', label: 'Sesi Siang (13:00 - 15:00 WIB)' },
    { id: 'slot-4', startTime: '15:30', endTime: '17:30', label: 'Golden Hour (15:30 - 17:30 WIB)' },
    { id: 'slot-5', startTime: '18:00', endTime: '20:00', label: 'Studio Evening (18:00 - 20:00 WIB)' },
  ];

  /**
   * Helper: Normalisasi tanggal string (YYYY-MM-DD) ke batas awal dan akhir hari WIB (UTC+7)
   */
  public getDateRangeUtc(dateStr: string): { startUtc: Date; endUtc: Date } {
    // dateStr format: YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    // Jam 00:00:00 WIB = Jam 17:00:00 UTC hari sebelumnya
    const startUtc = new Date(Date.UTC(year, month - 1, day - 1, 17, 0, 0, 0));
    // Jam 23:59:59.999 WIB = Jam 16:59:59.999 UTC hari H
    const endUtc = new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999));
    return { startUtc, endUtc };
  }

  /**
   * Helper: Menentukan apakah dua interval waktu pada hari yang sama saling bertabrakan
   * [S1, E1) dan [S2, E2) bertabrakan jika: S1 < E2 DAN S2 < E1
   */
  public isTimeOverlapping(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    return start1 < end2 && start2 < end1;
  }

  /**
   * Validasi jam mulai dan selesai
   */
  public validateTimeRange(startTime: string, endTime: string): void {
    if (endTime <= startTime) {
      throw new BadRequestException(
        `Jam selesai (${endTime}) harus lebih besar dari jam mulai (${startTime}) pada hari yang sama.`,
      );
    }
  }

  /**
   * Cek bentrok jadwal untuk tanggal dan rentang waktu tertentu
   */
  public async checkCollision(
    shootDateStr: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string,
  ): Promise<{ hasCollision: boolean; reason?: string }> {
    this.validateTimeRange(startTime, endTime);
    const { startUtc, endUtc } = this.getDateRangeUtc(shootDateStr);

    // 1. Cek apakah tanggal diblokir oleh admin
    const blocks = await this.prisma.scheduleBlock.findMany({
      where: {
        blockDate: {
          gte: startUtc,
          lte: endUtc,
        },
      },
    });

    for (const b of blocks) {
      if (b.isAllDay) {
        return {
          hasCollision: true,
          reason: `Tanggal ${shootDateStr} diblokir penuh oleh studio: "${b.title || 'Studio Libur / Maintenance'}".`,
        };
      }
      if (b.startTime && b.endTime) {
        if (this.isTimeOverlapping(startTime, endTime, b.startTime, b.endTime)) {
          return {
            hasCollision: true,
            reason: `Rentang waktu ${startTime} - ${endTime} bertabrakan dengan jadwal blokir studio (${b.startTime} - ${b.endTime}): "${b.title}".`,
          };
        }
      }
    }

    // 2. Cek apakah ada booking CONFIRMED yang bertabrakan
    const whereClause: Prisma.BookingWhereInput = {
      shootDate: {
        gte: startUtc,
        lte: endUtc,
      },
      status: BookingStatus.CONFIRMED,
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    };

    const confirmedBookings = await this.prisma.booking.findMany({
      where: whereClause,
    });

    for (const cb of confirmedBookings) {
      const bStart = cb.startTime || '08:30';
      const bEnd = cb.endTime || '20:30';
      if (this.isTimeOverlapping(startTime, endTime, bStart, bEnd)) {
        return {
          hasCollision: true,
          reason: `Rentang waktu ${startTime} - ${endTime} bertabrakan dengan booking terkonfirmasi (${bStart} - ${bEnd}) pada paket "${cb.packageName}".`,
        };
      }
    }

    return { hasCollision: false };
  }

  // ==========================================
  // 1. PUBLIC CALENDAR APIS
  // ==========================================

  /**
   * Mengambil ringkasan ketersediaan kalender per bulan untuk website publik (Aman tanpa data pribadi)
   */
  async getPublicMonthSummary(year: number, month: number): Promise<DaySummary[]> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Bulan harus berada di antara 1 dan 12');
    }

    // Tanggal 1 s/d hari terakhir bulan
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayUtc = new Date(Date.UTC(year, month - 1, 0, 17, 0, 0, 0));
    const lastDayUtc = new Date(Date.UTC(year, month - 1, daysInMonth, 16, 59, 59, 999));

    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          shootDate: {
            gte: firstDayUtc,
            lte: lastDayUtc,
          },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        },
        select: {
          shootDate: true,
          startTime: true,
          endTime: true,
          status: true,
        },
      }),
      this.prisma.scheduleBlock.findMany({
        where: {
          blockDate: {
            gte: firstDayUtc,
            lte: lastDayUtc,
          },
        },
      }),
    ]);

    const result: DaySummary[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const { startUtc, endUtc } = this.getDateRangeUtc(dateStr);
      const dayDateObj = new Date(year, month - 1, day);
      const dayOfWeek = dayDateObj.getDay();

      const dayBlocks = blocks.filter(
        (b) => b.blockDate >= startUtc && b.blockDate <= endUtc,
      );
      const isAllDayBlocked = dayBlocks.some((b) => b.isAllDay);
      const blockTitle = dayBlocks.find((b) => b.isAllDay)?.title;

      const dayBookings = bookings.filter(
        (b) => b.shootDate >= startUtc && b.shootDate <= endUtc,
      );
      const hasConfirmed = dayBookings.some((b) => b.status === BookingStatus.CONFIRMED);
      const hasPending = dayBookings.some((b) => b.status === BookingStatus.PENDING);

      let availableSlotsCount = this.PRESET_SLOTS.length;
      if (isAllDayBlocked) {
        availableSlotsCount = 0;
      } else {
        // Hitung slot preset yang masih terbuka
        for (const slot of this.PRESET_SLOTS) {
          const isSlotBlocked = dayBlocks.some(
            (b) => b.startTime && b.endTime && this.isTimeOverlapping(slot.startTime, slot.endTime, b.startTime, b.endTime),
          );
          const isSlotConfirmed = dayBookings.some(
            (b) => b.status === BookingStatus.CONFIRMED && b.startTime && b.endTime && this.isTimeOverlapping(slot.startTime, slot.endTime, b.startTime, b.endTime),
          );
          if (isSlotBlocked || isSlotConfirmed) {
            availableSlotsCount--;
          }
        }
      }

      let status: DaySummary['status'] = 'AVAILABLE';
      if (isAllDayBlocked) {
        status = 'BLOCKED';
      } else if (availableSlotsCount === 0) {
        status = 'FULL';
      } else if (hasConfirmed) {
        status = 'CONFIRMED';
      } else if (hasPending) {
        status = 'PENDING';
      }

      result.push({
        date: dateStr,
        dayOfWeek,
        status,
        hasConfirmed,
        hasPending,
        isBlocked: isAllDayBlocked,
        blockTitle: isAllDayBlocked ? blockTitle : undefined,
        availableSlotsCount,
        totalSlotsCount: this.PRESET_SLOTS.length,
      });
    }

    return result;
  }

  /**
   * Mengambil rincian slot pada tanggal tertentu untuk publik (Aman tanpa data pribadi)
   */
  async getPublicDateSlots(dateStr: string) {
    const { startUtc, endUtc } = this.getDateRangeUtc(dateStr);

    const [blocks, bookings] = await Promise.all([
      this.prisma.scheduleBlock.findMany({
        where: {
          blockDate: {
            gte: startUtc,
            lte: endUtc,
          },
        },
      }),
      this.prisma.booking.findMany({
        where: {
          shootDate: {
            gte: startUtc,
            lte: endUtc,
          },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        },
        select: {
          startTime: true,
          endTime: true,
          status: true,
          packageName: true,
        },
      }),
    ]);

    const isAllDayBlocked = blocks.some((b) => b.isAllDay);
    const allDayBlock = blocks.find((b) => b.isAllDay);

    const slots: CalendarSlot[] = this.PRESET_SLOTS.map((preset) => {
      if (isAllDayBlocked) {
        return {
          id: preset.id,
          startTime: preset.startTime,
          endTime: preset.endTime,
          label: preset.label,
          status: 'BLOCKED',
          isBookable: false,
        };
      }

      // Cek bentrok blokir parsial
      const partialBlock = blocks.find(
        (b) =>
          !b.isAllDay &&
          b.startTime &&
          b.endTime &&
          this.isTimeOverlapping(preset.startTime, preset.endTime, b.startTime, b.endTime),
      );
      if (partialBlock) {
        return {
          id: preset.id,
          startTime: preset.startTime,
          endTime: preset.endTime,
          label: preset.label,
          status: 'BLOCKED',
          isBookable: false,
        };
      }

      // Cek bentrok booking CONFIRMED
      const confirmed = bookings.find(
        (b) =>
          b.status === BookingStatus.CONFIRMED &&
          b.startTime &&
          b.endTime &&
          this.isTimeOverlapping(preset.startTime, preset.endTime, b.startTime, b.endTime),
      );
      if (confirmed) {
        return {
          id: preset.id,
          startTime: preset.startTime,
          endTime: preset.endTime,
          label: preset.label,
          status: 'CONFIRMED',
          isBookable: false,
        };
      }

      // Cek booking PENDING
      const pending = bookings.find(
        (b) =>
          b.status === BookingStatus.PENDING &&
          b.startTime &&
          b.endTime &&
          this.isTimeOverlapping(preset.startTime, preset.endTime, b.startTime, b.endTime),
      );
      if (pending) {
        return {
          id: preset.id,
          startTime: preset.startTime,
          endTime: preset.endTime,
          label: preset.label,
          status: 'PENDING',
          isBookable: true, // Masih bisa dipilih pelanggan dengan status menunggu konfirmasi admin
        };
      }

      return {
        id: preset.id,
        startTime: preset.startTime,
        endTime: preset.endTime,
        label: preset.label,
        status: 'AVAILABLE',
        isBookable: true,
      };
    });

    return {
      date: dateStr,
      isDateBlocked: isAllDayBlocked,
      blockReason: allDayBlock ? allDayBlock.title : null,
      slots,
    };
  }

  // ==========================================
  // 2. ADMIN CALENDAR APIS (PROTECTED)
  // ==========================================

  /**
   * Mengambil kalender bulanan lengkap dengan rincian jadwal untuk dashboard admin
   */
  async getAdminMonthView(year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayUtc = new Date(Date.UTC(year, month - 1, 0, 17, 0, 0, 0));
    const lastDayUtc = new Date(Date.UTC(year, month - 1, daysInMonth, 16, 59, 59, 999));

    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          shootDate: {
            gte: firstDayUtc,
            lte: lastDayUtc,
          },
        },
        orderBy: [{ shootDate: 'asc' }, { startTime: 'asc' }],
      }),
      this.prisma.scheduleBlock.findMany({
        where: {
          blockDate: {
            gte: firstDayUtc,
            lte: lastDayUtc,
          },
        },
        orderBy: [{ blockDate: 'asc' }, { startTime: 'asc' }],
      }),
    ]);

    return {
      year,
      month,
      bookings,
      blocks,
    };
  }

  /**
   * Mengambil daftar jadwal harian detail untuk admin
   */
  async getAdminDateView(dateStr: string) {
    const { startUtc, endUtc } = this.getDateRangeUtc(dateStr);

    const [bookings, blocks] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          shootDate: {
            gte: startUtc,
            lte: endUtc,
          },
        },
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.scheduleBlock.findMany({
        where: {
          blockDate: {
            gte: startUtc,
            lte: endUtc,
          },
        },
        orderBy: { startTime: 'asc' },
      }),
    ]);

    return {
      date: dateStr,
      bookings,
      blocks,
    };
  }

  /**
   * Admin membuat booking manual langsung
   */
  async createManualBooking(dto: CreateManualBookingDto) {
    const shootDateObj = new Date(dto.shootDate);
    const dateStr = dto.shootDate.slice(0, 10);

    // Cek bentrok jika status CONFIRMED
    const desiredStatus = dto.status || BookingStatus.CONFIRMED;
    if (desiredStatus === BookingStatus.CONFIRMED) {
      const collision = await this.checkCollision(dateStr, dto.startTime, dto.endTime);
      if (collision.hasCollision) {
        throw new ConflictException(collision.reason);
      }
    }

    const bookingCode = `MP-${dateStr.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const preferredTime = `${dto.startTime} - ${dto.endTime} WIB`;

    return this.prisma.booking.create({
      data: {
        bookingCode,
        customerName: dto.customerName.trim(),
        whatsappNumber: dto.whatsappNumber.trim(),
        serviceName: dto.serviceName.trim(),
        packageName: dto.packageName.trim(),
        shootDate: shootDateObj,
        preferredTime,
        startTime: dto.startTime,
        endTime: dto.endTime,
        location: dto.location.trim(),
        notes: dto.notes ? dto.notes.trim() : null,
        internalNotes: dto.internalNotes ? dto.internalNotes.trim() : null,
        status: desiredStatus,
        estimatedPrice: dto.estimatedPrice ? Number(dto.estimatedPrice) : null,
        isManual: true,
      },
    });
  }

  /**
   * Admin mengedit booking / jadwal
   */
  async updateManualBooking(id: string, dto: UpdateManualBookingDto) {
    const existing = await this.prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Booking ID ${id} tidak ditemukan.`);
    }

    const nextDateStr = dto.shootDate ? dto.shootDate.slice(0, 10) : existing.shootDate.toISOString().slice(0, 10);
    const nextStart = dto.startTime || existing.startTime || '08:30';
    const nextEnd = dto.endTime || existing.endTime || '10:30';
    const nextStatus = dto.status || existing.status;

    // Jika status diubah ke CONFIRMED atau waktu diubah, lakukan collision check
    if (nextStatus === BookingStatus.CONFIRMED) {
      const collision = await this.checkCollision(nextDateStr, nextStart, nextEnd, id);
      if (collision.hasCollision) {
        throw new ConflictException(collision.reason);
      }
    }

    const updateData: Prisma.BookingUpdateInput = {};
    if (dto.customerName) updateData.customerName = dto.customerName.trim();
    if (dto.whatsappNumber) updateData.whatsappNumber = dto.whatsappNumber.trim();
    if (dto.serviceName) updateData.serviceName = dto.serviceName.trim();
    if (dto.packageName) updateData.packageName = dto.packageName.trim();
    if (dto.shootDate) updateData.shootDate = new Date(dto.shootDate);
    if (dto.startTime) updateData.startTime = dto.startTime;
    if (dto.endTime) updateData.endTime = dto.endTime;
    if (dto.startTime || dto.endTime) {
      updateData.preferredTime = `${nextStart} - ${nextEnd} WIB`;
    }
    if (dto.location) updateData.location = dto.location.trim();
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.internalNotes !== undefined) updateData.internalNotes = dto.internalNotes;
    if (dto.status) updateData.status = dto.status;
    if (dto.estimatedPrice !== undefined) updateData.estimatedPrice = dto.estimatedPrice ? Number(dto.estimatedPrice) : null;

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Admin membuat blokir jadwal (satu hari penuh atau rentang jam tertentu)
   */
  async createScheduleBlock(dto: CreateScheduleBlockDto) {
    const dateStr = dto.blockDate.slice(0, 10);
    const blockDateObj = new Date(dto.blockDate);

    if (!dto.isAllDay) {
      if (!dto.startTime || !dto.endTime) {
        throw new BadRequestException('Jam mulai dan jam selesai wajib diisi untuk blokir jadwal parsial.');
      }
      this.validateTimeRange(dto.startTime, dto.endTime);
    }

    return this.prisma.scheduleBlock.create({
      data: {
        title: dto.title.trim(),
        blockDate: blockDateObj,
        isAllDay: dto.isAllDay,
        startTime: dto.isAllDay ? null : dto.startTime,
        endTime: dto.isAllDay ? null : dto.endTime,
        reason: dto.reason ? dto.reason.trim() : null,
      },
    });
  }

  /**
   * Admin menghapus blokir jadwal
   */
  async deleteScheduleBlock(id: string) {
    const existing = await this.prisma.scheduleBlock.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Blokir jadwal ID ${id} tidak ditemukan.`);
    }
    return this.prisma.scheduleBlock.delete({ where: { id } });
  }

  /**
   * Admin melihat daftar semua blokir jadwal aktif
   */
  async getAllScheduleBlocks() {
    return this.prisma.scheduleBlock.findMany({
      orderBy: { blockDate: 'asc' },
    });
  }
}
