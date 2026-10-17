-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photography_services" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "features" JSONB,
    "idealFor" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photography_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photography_packages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "priceNote" TEXT NOT NULL DEFAULT 'Per sesi',
    "durationMinutes" INTEGER NOT NULL,
    "locationCount" TEXT NOT NULL DEFAULT '1 Lokasi',
    "photoCount" INTEGER NOT NULL,
    "allRawIncluded" BOOLEAN NOT NULL DEFAULT false,
    "benefits" JSONB NOT NULL,
    "additionalNotes" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photography_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT,
    "shootDate" TEXT,
    "location" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "shootDate" TIMESTAMP(3) NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedPrice" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" TEXT NOT NULL,
    "studioName" TEXT NOT NULL DEFAULT 'MOMEN.POTRAIT',
    "tagline" TEXT NOT NULL DEFAULT 'Every Moment Tells a Story.',
    "whatsappNumber" TEXT NOT NULL DEFAULT '6281234567890',
    "email" TEXT NOT NULL DEFAULT 'halo@momenpotrait.com',
    "instagram" TEXT NOT NULL DEFAULT '@momen.potrait',
    "serviceArea" TEXT NOT NULL DEFAULT 'Jakarta, Bogor, Depok, Tangerang, Bekasi & Travel Available',
    "operatingHours" TEXT NOT NULL DEFAULT 'Senin - Minggu: 09:00 - 20:00 WIB',
    "bookingNotice" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "photography_services_slug_key" ON "photography_services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "photography_packages_slug_key" ON "photography_packages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingCode_key" ON "bookings"("bookingCode");

-- AddForeignKey
ALTER TABLE "photography_packages" ADD CONSTRAINT "photography_packages_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "photography_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
