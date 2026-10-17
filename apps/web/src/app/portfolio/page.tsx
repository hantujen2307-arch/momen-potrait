import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { getPortfolio, getSettings } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Galeri Portofolio — MOMEN.POTRAIT',
  description:
    'Jelajahi galeri portofolio fotografi editorial MOMEN.POTRAIT: Personal Portrait, Wisuda, Pasangan, Prewedding, Wedding, Event, dan Produk komersial.',
  openGraph: {
    title: 'Galeri Portofolio — MOMEN.POTRAIT',
    description:
      'Dokumentasi momen berharga dengan estetika visual hangat, otentik, dan abadi.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MOMEN.POTRAIT Portfolio Gallery',
      },
    ],
  },
};

export default async function PortfolioPage() {
  const [portfolioItems, settings] = await Promise.all([
    getPortfolio(),
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
              <span>Arsip Visual Kurasi</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#141414] tracking-tight">
              Galeri Portofolio
            </h1>

            <p className="text-xs sm:text-base text-[#5A5854] font-sans leading-relaxed">
              Koleksi karya fotografi kami yang merangkum cerita, tatapan tulus, dan sukacita. Gunakan filter di bawah ini untuk melihat portofolio berdasarkan kategori, dan klik gambar untuk membuka tampilan resolusi tinggi.
            </p>
          </div>

          {/* Interactive Gallery with touch & swipe enabled Lightbox */}
          <PortfolioGallery initialItems={portfolioItems} showFilter={true} />

          <div className="text-center text-[11px] text-[#7A7875] pt-2">
            * Seluruh visual yang ditampilkan merupakan showcase gaya estetika & mood fotografi MOMEN.POTRAIT. Untuk portofolio sesi klien privat atau konsep khusus, silakan hubungi tim kami.
          </div>

          {/* Bottom CTA Box */}
          <div className="bg-[#141414] text-[#FAF8F5] p-8 sm:p-12 border border-[#262624] flex flex-col md:flex-row items-center justify-between gap-6 mt-16">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                Tertarik dengan Visual Kami?
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Jadwalkan Sesi Pemotretan Anda
              </h3>
              <p className="text-xs text-[#999690] max-w-lg font-sans">
                Konsultasikan konsep yang Anda impikan, dan biarkan tim fotografer kami merancang moodboard terbaik untuk Anda.
              </p>
            </div>
            <Link
              href="/booking"
              className="shrink-0 inline-flex items-center gap-2 bg-[#C5A880] text-[#141414] hover:bg-[#DFCA9B] py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-colors shadow-md"
            >
              <span>Booking Sesi Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Quick Contact */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        studioName={settings.studioName}
      />

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
    </div>
  );
}
