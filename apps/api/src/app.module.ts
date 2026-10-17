import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { PackagesModule } from './packages/packages.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { BookingsModule } from './bookings/bookings.module';
import { SettingsModule } from './settings/settings.module';
import { AdminModule } from './admin/admin.module';
import { ContentModule } from './content/content.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ServicesModule,
    PackagesModule,
    PortfolioModule,
    BookingsModule,
    SettingsModule,
    AdminModule,
    ContentModule,
    TestimonialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
