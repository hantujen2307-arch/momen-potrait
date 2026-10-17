import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Public
  @Get('portfolio')
  async getPublicPortfolio(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ) {
    const isFeatured = featured === 'true';
    return this.portfolioService.findAllPublic(category, isFeatured);
  }

  @Get('portfolio/:id')
  async getPortfolioItem(@Param('id') id: string) {
    return this.portfolioService.findOne(id);
  }

  // Admin
  @UseGuards(JwtAuthGuard)
  @Get('admin/portfolio')
  async getAdminPortfolio(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.portfolioService.findAllAdmin(search, category);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/portfolio')
  async createPortfolio(@Body() dto: CreatePortfolioDto) {
    return this.portfolioService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/portfolio/:id')
  async updatePortfolio(@Param('id') id: string, @Body() dto: UpdatePortfolioDto) {
    return this.portfolioService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/portfolio/:id')
  async deletePortfolio(@Param('id') id: string) {
    return this.portfolioService.delete(id);
  }
}
