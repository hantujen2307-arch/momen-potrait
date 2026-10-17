import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.photographyService.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        packages: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const service = await this.prisma.photographyService.findUnique({
      where: { slug },
      include: {
        packages: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!service) {
      throw new NotFoundException(`Layanan dengan slug "${slug}" tidak ditemukan.`);
    }
    return service;
  }

  async findAllAdmin() {
    return this.prisma.photographyService.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { packages: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.photographyService.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Layanan ID ${id} tidak ditemukan.`);
    }
    return service;
  }

  async create(dto: CreateServiceDto) {
    return this.prisma.photographyService.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    return this.prisma.photographyService.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.photographyService.delete({
      where: { id },
    });
  }
}
