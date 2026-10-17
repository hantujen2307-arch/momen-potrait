'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Camera,
  FolderArchive,
  FileCheck,
  Eye,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PhotographyPackage } from '@/lib/api';

interface VisualPackageCardProps {
  pkg: PhotographyPackage;
  onOpenDetail: (pkg: PhotographyPackage) => void;
}

export function VisualPackageCard({
  pkg,
  onOpenDetail,
}: VisualPackageCardProps) {
  return (
    <div className="group bg-white border border-[#EAE3DB] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:border-[#C5A880]">
      {/* 1. BAGIAN ATAS CARD: Large High-Quality Photography Cover */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#141414] cursor-pointer"
        onClick={() => onOpenDetail(pkg)}
      >
        <Image
          src={pkg.coverImageUrl}
          alt={pkg.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover image-zoom group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Optional Badge: BEST SELLER / PREMIUM */}
        {pkg.badgeLabel && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#C5A880] text-[#141414] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-md">
              {pkg.badgeLabel}
            </span>
          </div>
        )}

        {/* Category Pill on Bottom of Cover */}
        {pkg.category && (
          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#FAF8F5] bg-black/60 backdrop-blur-sm px-2.5 py-1 border border-white/10">
              {pkg.category}
            </span>
          </div>
        )}

        {/* View Details Icon Overlay on Hover */}
        <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* 2. BAGIAN INFORMASI DI BAWAH FOTO */}
      <div className="p-5 sm:p-7 flex-grow flex flex-col justify-between space-y-5 sm:space-y-6 font-sans">
        <div className="space-y-4">
          {/* Header Title & Short Description */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#876E49] font-semibold block">
              {pkg.tier} Moments
            </span>
            <h3
              onClick={() => onOpenDetail(pkg)}
              className="font-serif text-xl sm:text-2xl font-bold text-[#141414] mt-0.5 group-hover:text-[#876E49] transition-colors cursor-pointer"
            >
              {pkg.name}
            </h3>
            {pkg.shortDesc && (
              <p className="text-xs text-[#5A5854] mt-2 line-clamp-2 leading-relaxed">
                {pkg.shortDesc}
              </p>
            )}
          </div>

          {/* Pricing Typography */}
          <div className="pt-2 pb-3.5 border-b border-[#EAE3DB]">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight">
                Rp{pkg.price.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-[#7A7875] font-normal">/ sesi</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#876E49] mt-0.5 block">
              {pkg.priceNote || 'Transparan & Tanpa Biaya Tersembunyi'}
            </span>
          </div>

          {/* Key Photography Specs List */}
          <div className="space-y-2 text-xs text-[#4A4844]">
            {/* Duration */}
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>{pkg.durationMinutes} menit sesi pemotretan</span>
            </div>

            {/* Edited Photo Count */}
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>{pkg.editedPhotoCount} foto pilihan yang diedit profesional</span>
            </div>

            {/* Original File Delivery Status */}
            <div className="flex items-center gap-2.5">
              <FolderArchive className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span className="font-medium text-[#141414]">
                {pkg.includesOriginalFiles
                  ? 'Seluruh file foto asli diberikan'
                  : 'Hanya foto pilihan yang diedit'}
              </span>
            </div>

            {/* Resolution / Formats */}
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span className="truncate">{pkg.deliveryFormats || 'File digital resolusi tinggi'}</span>
            </div>

            {/* Key Benefits Preview */}
            {pkg.benefits && Array.isArray(pkg.benefits) && pkg.benefits.length > 0 && (
              <div className="pt-2 border-t border-[#EAE3DB]/80 space-y-1 text-[11px] text-[#5A5854]">
                {pkg.benefits.slice(0, 2).map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. DUA TOMBOL AKSI: Responsive stack on 320px-350px, side-by-side on 360px+ with 44px touch targets */}
        <div className="pt-4 sm:pt-5 border-t border-[#EAE3DB] flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => onOpenDetail(pkg)}
            className="w-full sm:flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 border border-[#141414] text-[#141414] hover:bg-[#141414] hover:text-white py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Detail</span>
          </button>

          <Link
            href={`/booking?package=${pkg.slug}`}
            className="w-full sm:flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-[#141414] text-[#FAF8F5] hover:bg-[#A88A62] py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm group"
          >
            <span>Booking Paket</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
