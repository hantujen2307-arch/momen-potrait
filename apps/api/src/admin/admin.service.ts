import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalPortfolio,
      totalPackages,
      totalServices,
      recentBookings,
      revenueStats,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),
      this.prisma.portfolioItem.count(),
      this.prisma.photographyPackage.count({ where: { active: true } }),
      this.prisma.photographyService.count({ where: { active: true } }),
      this.prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.booking.aggregate({
        where: {
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
        },
        _sum: {
          estimatedPrice: true,
        },
      }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalPortfolio,
      totalPackages,
      totalServices,
      totalRevenue: revenueStats._sum.estimatedPrice || 0,
      recentBookings,
    };
  }
}
