import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { UpdateHomepageContentDto } from './dto/homepage-content.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('content/homepage')
  async getPublicHomepageContent() {
    return this.contentService.getHomepageContent();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/content/homepage')
  async getAdminHomepageContent() {
    return this.contentService.getHomepageContent();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/content/homepage')
  async updateHomepageContent(@Body() dto: UpdateHomepageContentDto) {
    return this.contentService.updateHomepageContent(dto);
  }
}
