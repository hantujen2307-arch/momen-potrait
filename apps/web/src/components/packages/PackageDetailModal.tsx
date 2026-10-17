'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Clock,
  Camera,
  FileCheck,
  FolderArchive,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PhotographyPackage } from '@/lib/api';

interface PackageDetailModalProps {
  pkg: PhotographyPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PackageDetailModal({
  pkg,
  isOpen,
  onClose,
}: PackageDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pkg) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF8F5] border border-[#C5A880]/40 max-w-3xl w-full max-h-[96vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl my-auto text-[#141414] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Strict >= 44x44px target) */}
        <button
          onClick={onClose}
          aria-label="Tutup rincian paket"
          className="absolute top-3.5 right-3.5 z-20 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/20 shadow-md active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Cover Photo Header */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#141414] overflow-hidden">
          <Image
            src={pkg.coverImageUrl}
            alt={pkg.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-black/20 to-transparent" />

          {/* Badge */}
          {pkg.badgeLabel && (
            <div className="absolute top-4 left-4 z-10 bg-[#C5A880] text-[#141414] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] shadow-md">
              {pkg.badgeLabel}
            </div>
          )}

          {/* Category Tag */}
          {pkg.category && (
            <div className="absolute bottom-4 left-4 sm:left-6 z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#876E49] bg-white/90 backdrop-blur-sm px-2.5 py-1 border border-[#EAE3DB]">
                {pkg.category}
              </span>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-10 space-y-6 sm:space-y-8 font-sans">
          {/* Header Title & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EAE3DB]">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
                {pkg.tier} Moments Tier
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141414] mt-1">
                {pkg.name}
              </h2>
              {pkg.shortDesc && (
                <p className="text-xs sm:text-sm text-[#5A5854] mt-2 max-w-lg leading-relaxed">
                  {pkg.shortDesc}
                </p>
              )}
            </div>

            <div className="sm:text-right shrink-0 bg-[#F4EFEA] p-4 border border-[#EAE3DB]">
              <span className="text-[10px] uppercase tracking-wider text-[#7A7875] block">
                Biaya Sesi
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#141414]">
                Rp{pkg.price.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-[#876E49] block mt-0.5">
                {pkg.priceNote || 'Per sesi pemotretan'}
              </span>
            </div>
          </div>

          {/* Long Description */}
          {pkg.description && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#141414]">
                Deskripsi Sesi
              </h4>
              <p className="text-xs sm:text-sm text-[#5A5854] leading-relaxed">
                {pkg.description}
              </p>
            </div>
          )}

          {/* Key Deliverables & Service Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-[#F4EFEA] border border-[#EAE3DB] text-xs">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#7A7875] block text-[10px] uppercase">Durasi Sesi</span>
                <span className="font-semibold text-[#141414]">{pkg.durationMinutes} Menit</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Camera className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#7A7875] block text-[10px] uppercase">Foto Hasil Edit</span>
                <span className="font-semibold text-[#141414]">{pkg.editedPhotoCount} Foto Retouch</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FolderArchive className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#7A7875] block text-[10px] uppercase">File Foto Asli</span>
                <span className="font-semibold text-[#141414]">
                  {pkg.includesOriginalFiles ? 'Termasuk Seluruh File' : 'Hanya Foto Pilihan'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileCheck className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#7A7875] block text-[10px] uppercase">Format & Resolusi</span>
                <span className="font-semibold text-[#141414]">
                  {pkg.deliveryFormats || 'JPEG Resolusi Tinggi'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#7A7875] block text-[10px] uppercase">Lokasi / Spot</span>
                <span className="font-semibold text-[#141414]">{pkg.locationCount}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#7A7875] block text-[10px] uppercase">Estimasi Penyerahan</span>
                <span className="font-semibold text-[#141414]">
                  {pkg.deliveryEstimate || '5–7 Hari Kerja'}
                </span>
              </div>
            </div>

            {pkg.outfitCount && (
              <div className="flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#7A7875] block text-[10px] uppercase">Pilihan Outfit</span>
                  <span className="font-semibold text-[#141414]">{pkg.outfitCount}</span>
                </div>
              </div>
            )}

            {pkg.conceptCount && (
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#A88A62] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#7A7875] block text-[10px] uppercase">Pilihan Konsep</span>
                  <span className="font-semibold text-[#141414]">{pkg.conceptCount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Original File Specific Notice */}
          {pkg.originalFileDeliveryDetails && (
            <div className="p-4 bg-white border border-[#EAE3DB] text-xs">
              <span className="font-semibold text-[#141414] block mb-1">
                Ketentuan File Foto Asli:
              </span>
              <p className="text-[#5A5854] leading-relaxed">
                {pkg.originalFileDeliveryDetails}
              </p>
            </div>
          )}

          {/* Additional Gallery Preview (if available) */}
          {pkg.galleryImages && Array.isArray(pkg.galleryImages) && pkg.galleryImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#141414]">
                Inspirasi Visual Sesi Ini
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pkg.galleryImages.map((imgUrl, i) => (
                  <div key={i} className="relative aspect-[4/3] bg-[#141414] overflow-hidden border border-[#EAE3DB]">
                    <Image
                      src={imgUrl}
                      alt={`${pkg.name} preview ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 250px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Benefit Checklist */}
          {pkg.benefits && Array.isArray(pkg.benefits) && pkg.benefits.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#141414]">
                Benefit & Fasilitas Termasuk:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#5A5854]">
                {pkg.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Terms & Conditions */}
          {pkg.terms && (
            <div className="p-4 bg-[#FAF8F5] border-l-4 border-[#C5A880] text-xs space-y-1">
              <span className="font-semibold text-[#141414] block">
                Ketentuan Reservasi:
              </span>
              <p className="text-[#5A5854] leading-relaxed">{pkg.terms}</p>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#EAE3DB] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 border border-[#EAE3DB] text-xs uppercase tracking-wider text-[#5A5854] hover:text-[#141414] hover:border-[#141414] transition-colors"
            >
              Tutup Rincian
            </button>

            <Link
              href={`/booking?package=${pkg.slug}`}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#141414] text-[#FAF8F5] hover:bg-[#A88A62] py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-colors shadow-md group"
            >
              <span>Booking Paket Ini Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
