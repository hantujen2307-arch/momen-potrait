import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // Public
  @Get('packages')
  async getPublicPackages() {
    return this.packagesService.findAllPublic();
  }

  @Get('packages/:slug')
  async getPackageBySlug(@Param('slug') slug: string) {
    return this.packagesService.findBySlug(slug);
  }

  // Admin
  @UseGuards(JwtAuthGuard)
  @Get('admin/packages')
  async getAdminPackages() {
    return this.packagesService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/packages')
  async createPackage(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/packages/:id')
  async updatePackage(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/packages/:id')
  async deletePackage(@Param('id') id: string) {
    return this.packagesService.delete(id);
  }
}
