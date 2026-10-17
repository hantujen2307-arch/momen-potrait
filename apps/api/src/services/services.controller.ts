import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Public
  @Get('services')
  async getPublicServices() {
    return this.servicesService.findAllPublic();
  }

  @Get('services/:slug')
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  // Admin
  @UseGuards(JwtAuthGuard)
  @Get('admin/services')
  async getAdminServices() {
    return this.servicesService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/services')
  async createService(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/services/:id')
  async updateService(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/services/:id')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
