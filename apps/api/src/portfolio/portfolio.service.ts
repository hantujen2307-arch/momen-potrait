import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(category?: string, featuredOnly?: boolean) {
    const where: any = { published: true };
    if (category && category.toLowerCase() !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (featuredOnly) {
      where.isFeatured = true;
    }

    return this.prisma.portfolioItem.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Portfolio item ID ${id} tidak ditemukan.`);
    }
    return item;
  }

  async findAllAdmin(search?: string, category?: string) {
    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.portfolioItem.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(dto: CreatePortfolioDto) {
    return this.prisma.portfolioItem.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdatePortfolioDto) {
    await this.findOne(id);
    return this.prisma.portfolioItem.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.portfolioItem.delete({
      where: { id },
    });
  }
}
