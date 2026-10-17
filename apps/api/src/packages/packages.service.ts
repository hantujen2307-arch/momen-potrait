import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.photographyPackage.findMany({
      where: {
        active: true,
        status: 'PUBLISHED',
      },
      orderBy: [{ displayOrder: 'asc' }, { sortOrder: 'asc' }],
      include: {
        service: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const pkg = await this.prisma.photographyPackage.findUnique({
      where: { slug },
      include: {
        service: true,
      },
    });
    if (!pkg) {
      throw new NotFoundException(`Paket dengan slug "${slug}" tidak ditemukan.`);
    }
    return pkg;
  }

  async findAllAdmin() {
    return this.prisma.photographyPackage.findMany({
      orderBy: [{ displayOrder: 'asc' }, { sortOrder: 'asc' }],
      include: {
        service: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const pkg = await this.prisma.photographyPackage.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!pkg) {
      throw new NotFoundException(`Paket ID ${id} tidak ditemukan.`);
    }
    return pkg;
  }

  async create(dto: CreatePackageDto) {
    return this.prisma.photographyPackage.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.findOne(id);
    return this.prisma.photographyPackage.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.photographyPackage.delete({
      where: { id },
    });
  }
}
