import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async getPublishedTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getAdminTestimonials() {
    return this.prisma.testimonial.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getTestimonialById(id: string) {
    const item = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Testimonial dengan ID ${id} tidak ditemukan`);
    }
    return item;
  }

  async createTestimonial(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        clientName: dto.clientName,
        reviewText: dto.reviewText,
        sessionType: dto.sessionType,
        avatarUrl: dto.avatarUrl,
        isPublished: dto.isPublished ?? false,
        rating: dto.rating ?? 5,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    await this.getTestimonialById(id);
    return this.prisma.testimonial.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTestimonial(id: string) {
    await this.getTestimonialById(id);
    return this.prisma.testimonial.delete({
      where: { id },
    });
  }
}
