import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get('testimonials')
  async getPublicTestimonials() {
    return this.testimonialsService.getPublishedTestimonials();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/testimonials')
  async getAdminTestimonials() {
    return this.testimonialsService.getAdminTestimonials();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/testimonials')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.createTestimonial(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/testimonials/:id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.updateTestimonial(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return this.testimonialsService.deleteTestimonial(id);
  }
}
