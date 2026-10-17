import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { getPackages, getSettings } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingForm } from '@/components/booking/BookingForm';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Booking Sesi Fotografi — MOMEN.POTRAIT',
  description:
    'Formulir reservasi pemotretan MOMEN.POTRAIT. Pilih jadwal, paket, dan lokasi sesi fotografi Anda dengan integrasi WhatsApp langsung.',
};

export default async function BookingPage() {
  const [packages, settings] = await Promise.all([
    getPackages(),
    getSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar whatsappNumber={settings.whatsappNumber} />

      <main className="flex-grow pt-24 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A7875] hover:text-[#141414] transition-colors min-h-[44px] py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EFEA] border border-[#EAE3DB] text-[#876E49] text-[10px] font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 text-[#C5A880]" />
              <span>Direct Session Reservation</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#141414] tracking-tight">
              Reservasi Sesi Foto
            </h1>

            <p className="text-xs sm:text-base text-[#5A5854] font-sans leading-relaxed">
              Silakan isi formulir di bawah ini dengan detail kebutuhan sesi Anda. Formulir ini akan menyimpan data pemesanan ke database studio kami dan menyiapkan pesan WhatsApp resmi untuk konfirmasi jadwal.
            </p>
          </div>

          {/* Quick Notice Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-[#EAE3DB]">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-[#141414] block">Reservasi H-7</span>
                <span className="text-[#7A7875]">Disarankan pesan 7 hari sebelum sesi untuk slot fotografer utama.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-[#141414] block">Status PENDING Terjamin</span>
                <span className="text-[#7A7875]">Permintaan booking diverifikasi sebelum DP agar tanggal benar-benar aman.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-[#141414] block">WhatsApp Terintegrasi</span>
                <span className="text-[#7A7875]">Pesan booking terformat otomatis langsung ke WhatsApp resmi studio.</span>
              </div>
            </div>
          </div>

          {/* Booking Form wrapped in Suspense for searchParams */}
          <Suspense
            fallback={
              <div className="p-12 text-center text-xs text-[#7A7875] bg-white border border-[#EAE3DB]">
                Memuat formulir pemesanan...
              </div>
            }
          >
            <BookingForm packages={packages} />
          </Suspense>
        </div>
      </main>

      <Footer
        brandName={settings.studioName}
        tagline={settings.tagline}
        whatsappNumber={settings.whatsappNumber}
        email={settings.email}
        instagram={settings.instagram}
        serviceArea={settings.serviceArea}
        transportPolicy={settings.transportPolicy}
        operatingHours={settings.operatingHours}
      />

      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
