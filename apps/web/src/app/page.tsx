import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import {
  getPackages,
  getPortfolio,
  getSettings,
  getHomepageContent,
  getTestimonials,
} from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { PackagesGridSection } from '@/components/packages/PackagesGridSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export default async function HomePage() {
  const [packages, portfolio, settings, homepageContent, testimonials] = await Promise.all([
    getPackages(),
    getPortfolio(undefined, true),
    getSettings(),
    getHomepageContent(),
    getTestimonials(),
  ]);

  const highlightPortfolio = portfolio.slice(0, 6);

  // Concrete factual data derived directly from active package offerings
  const minDuration = packages.length > 0 ? Math.min(...packages.map((p) => p.durationMinutes)) : 30;
  const maxDuration = packages.length > 0 ? Math.max(...packages.map((p) => p.durationMinutes)) : 120;
  const minEdited = packages.length > 0 ? Math.min(...packages.map((p) => p.editedPhotoCount)) : 5;
  const maxEdited = packages.length > 0 ? Math.max(...packages.map((p) => p.editedPhotoCount)) : 20;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar whatsappNumber={settings.whatsappNumber} />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[auto] lg:min-h-[88vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 overflow-hidden bg-[#FAF8F5]">
          {/* Subtle background tone lines */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EFEA] border border-[#EAE3DB] text-[#876E49] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Editorial & Timeless Photography</span>
              </div>

              <h1 className="font-serif text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#141414] leading-[1.1] sm:leading-[1.08]">
                {homepageContent.heroHeadline.includes('\n') ? (
                  homepageContent.heroHeadline.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))
                ) : homepageContent.heroHeadline.includes('<br') ? (
                  <span dangerouslySetInnerHTML={{ __html: homepageContent.heroHeadline }} />
                ) : (
                  homepageContent.heroHeadline
                )}
              </h1>

              <p className="text-xs sm:text-base text-[#5A5854] max-w-xl font-sans leading-relaxed">
                {homepageContent.heroDescription}
              </p>

              {/* Main CTAs: Booking Sekarang & Lihat Paket */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Link
                  href={homepageContent.heroPrimaryCtaLink || '/booking'}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-3 bg-[#141414] text-[#FAF8F5] hover:bg-[#A88A62] py-3.5 px-7 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md group"
                >
                  <span>{homepageContent.heroPrimaryCtaText || 'Booking Sekarang'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={homepageContent.heroSecondaryCtaLink || '/packages'}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 border border-[#141414] text-[#141414] hover:bg-[#141414] hover:text-[#FAF8F5] py-3.5 px-7 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300"
                >
                  <span>{homepageContent.heroSecondaryCtaText || 'Lihat Paket'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Concrete Verified Package Highlights (No Unverified Claims) */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-[#EAE3DB] max-w-lg">
                <div>
                  <span className="font-serif text-xl sm:text-3xl font-bold text-[#141414]">
                    {minDuration}–{maxDuration}m
                  </span>
                  <p className="text-[9px] sm:text-xs text-[#7A7875] tracking-wider uppercase mt-0.5">
                    Durasi Sesi
                  </p>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-3xl font-bold text-[#141414]">
                    {minEdited}–{maxEdited}
                  </span>
                  <p className="text-[9px] sm:text-xs text-[#7A7875] tracking-wider uppercase mt-0.5">
                    Foto Retouch
                  </p>
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-3xl font-bold text-[#141414]">
                    Master
                  </span>
                  <p className="text-[9px] sm:text-xs text-[#7A7875] tracking-wider uppercase mt-0.5">
                    Resolusi Penuh
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition (Unique Asset) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative aspect-[3/4] w-full max-w-sm sm:max-w-md mx-auto shadow-2xl border-4 sm:border-8 border-white bg-[#141414]">
                <Image
                  src={
                    homepageContent.heroImageUrl ||
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={`${settings.studioName || 'MOMEN.POTRAIT'} Editorial Hero`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Editorial Card - Clamped cleanly on mobile */}
                <div className="absolute bottom-3 left-3 sm:-bottom-6 sm:-left-6 bg-[#141414] text-[#FAF8F5] p-3.5 sm:p-5 border border-[#262624] shadow-xl max-w-[190px] sm:max-w-[220px]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] block font-semibold mb-1">
                    Visual Signature
                  </span>
                  <p className="font-serif text-xs sm:text-sm italic leading-snug">
                    "True-to-life skin tones & subtle cinematic warmth."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION & PHILOSOPHY (Section About & Ethos yang dipadatkan) */}
        <section id="about" className="scroll-mt-24 py-14 sm:py-20 md:py-24 px-4 sm:px-8 bg-white border-y border-[#EAE3DB]">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C5A880] uppercase">
              {homepageContent.aboutTagline || 'Filosofi Fotografi Kami'}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#141414] max-w-3xl mx-auto leading-tight">
              {homepageContent.aboutTitle || 'Foto yang Terasa Seperti Anda.'}
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C5A880] mx-auto my-4 sm:my-6" />
            <p className="text-xs sm:text-base text-[#5A5854] max-w-2xl mx-auto font-sans leading-relaxed">
              {homepageContent.aboutDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8 sm:pt-12 text-left">
              <div className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#EAE3DB]">
                <Compass className="w-6 h-6 text-[#A88A62] mb-4" />
                <h3 className="font-serif text-lg font-bold text-[#141414] mb-2">
                  Arahan Alami & Rileks
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Tak perlu cemas jika Anda merasa tidak terbiasa di depan kamera. Fotografer kami memberikan panduan pose santai agar ekspresi Anda mengalir apa adanya.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#EAE3DB]">
                <Sparkles className="w-6 h-6 text-[#A88A62] mb-4" />
                <h3 className="font-serif text-lg font-bold text-[#141414] mb-2">
                  Signature Warm Tone
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Color grading editorial yang lembut dengan warna kulit alami (true skin-tone), menghadirkan visual yang tidak lekang oleh tren sesaat.
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#EAE3DB]">
                <ShieldCheck className="w-6 h-6 text-[#A88A62] mb-4" />
                <h3 className="font-serif text-lg font-bold text-[#141414] mb-2">
                  Transparan & Terpercaya
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Rincian benefit dan biaya tercatat jelas, koordinasi WhatsApp yang responsif, serta penyerahan file digital dalam resolusi penuh siap simpan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO HIGHLIGHTS */}
        <section id="portfolio" className="scroll-mt-24 py-14 sm:py-20 md:py-24 px-4 sm:px-8 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 border-b border-[#EAE3DB]">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
                  Kurasi Karya
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141414] mt-1">
                  Galeri Pilihan
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7875] mt-1 font-sans">
                  Koleksi potret pilihan yang merangkum cerita, tatapan tulus, dan sukacita. Showcase editorial ini merepresentasikan estetika visual MOMEN.POTRAIT.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#A88A62] group min-h-[44px] py-1"
              >
                <span>Lihat Seluruh Portofolio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <PortfolioGallery initialItems={highlightPortfolio} showFilter={false} />

            <div className="text-center text-[11px] text-[#7A7875] pt-2">
              * Kurasi visual di atas merupakan showcase estetika & mood fotografi MOMEN.POTRAIT. Hubungi kami untuk melihat portofolio sesi klien privat.
            </div>
          </div>
        </section>

        {/* FEATURED PACKAGES */}
        <section id="packages" className="scroll-mt-24 py-14 sm:py-20 md:py-24 px-4 sm:px-8 bg-white border-t border-[#EAE3DB]">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C5A880] uppercase">
                Pilihan Investasi Dokumentasi
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#141414]">
                Pilihan Paket Fotografi
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7875] leading-relaxed font-sans">
                Paket sesi berdurasi terarah dengan jumlah foto edit yang transparan. Seluruh paket terhubung langsung ke formulir reservasi online.
              </p>
            </div>

            {/* Visual Photography Package Cards Grid with Detail Modal */}
            <PackagesGridSection packages={packages} />

            <div className="text-center text-[11px] sm:text-xs text-[#7A7875] max-w-xl mx-auto pt-2 sm:pt-4 leading-relaxed">
              * Biaya yang tercantum merupakan estimasi paket standar. Untuk kebutuhan durasi kustom, pemotretan luar area operasional, atau sewa studio khusus, silakan konsultasikan langsung dengan tim kami.
            </div>
          </div>
        </section>

        {/* 4-STEP BOOKING WORKFLOW */}
        <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 bg-[#FAF8F5] border-t border-[#EAE3DB]">
          <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C5A880] uppercase">
                Alur Praktis
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141414]">
                Alur Reservasi yang Mudah
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7875] font-sans">
                Empat langkah terarah untuk memastikan sesi pemotretan Anda berjalan nyaman dan berkesan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white p-5 sm:p-6 border border-[#EAE3DB] relative space-y-3 sm:space-y-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A880]/40">
                  01
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#141414]">
                  Pilih Paket & Tanggal
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Tentukan paket yang sesuai, dan isi perkiraan tanggal serta lokasi sesi Anda di formulir website.
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 border border-[#EAE3DB] relative space-y-3 sm:space-y-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A880]/40">
                  02
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#141414]">
                  Koordinasi WhatsApp
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Data booking tersimpan dan Anda diarahkan ke WhatsApp studio untuk konfirmasi ketersediaan slot dan moodboard.
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 border border-[#EAE3DB] relative space-y-3 sm:space-y-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A880]/40">
                  03
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#141414]">
                  Sesi Pemotretan
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Nikmati sesi foto santai bersama fotografer kami dengan arahan pose natural tanpa rasa kaku.
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6 border border-[#EAE3DB] relative space-y-3 sm:space-y-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C5A880]/40">
                  04
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#141414]">
                  Penyerahan Galeri Digital
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed">
                  Akses galeri digital berkecepatan tinggi sesuai estimasi paket untuk mengunduh master foto resolusi penuh.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AUTHENTIC CLIENT EXPERIENCES (Hanya muncul jika ada testimoni nyata yang diinput dan disetujui admin) */}
        <TestimonialsSection testimonials={testimonials} />

        {/* FAQ SECTION */}
        <section id="faq" className="scroll-mt-24 py-14 sm:py-20 md:py-24 px-4 sm:px-8 bg-[#FAF8F5] border-t border-[#EAE3DB]">
          <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C5A880] uppercase">
                Informasi & Panduan
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141414]">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7875] font-sans">
                Transparansi informasi seputar alur booking, uang muka, kebijakan perubahan jadwal, dan penyerahan file.
              </p>
            </div>

            <FaqAccordion items={homepageContent.faqItems} />
          </div>
        </section>

        {/* FINAL CLOSING CTA BANNER */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-8 bg-[#111111] text-[#FAF8F5] text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C5A880] uppercase">
              Mulai Kisah Visual Anda
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {homepageContent.ctaHeadline || 'Siap Mengabadikan Momen Berharga Anda?'}
            </h2>
            <p className="text-xs sm:text-sm text-[#999690] leading-relaxed max-w-xl mx-auto font-sans">
              {homepageContent.ctaDescription ||
                'Hubungi kami sekarang untuk berkonsultasi mengenai konsep pemotretan dan mengamankan tanggal terbaik Anda.'}
            </p>
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href={homepageContent.ctaButtonLink || '/booking'}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#C5A880] text-[#141414] hover:bg-[#DFCA9B] py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg"
              >
                <span>{homepageContent.ctaButtonText || 'Booking Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(settings.studioName || 'MOMEN.POTRAIT')},%20saya%20ingin%20konsultasi%20sesi%20fotografi`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 border border-[#C5A880] text-[#FAF8F5] hover:bg-white/10 py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300"
              >
                <span>Konsultasi WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp Quick Contact for Mobile & Desktop */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        studioName={settings.studioName}
      />

      <Footer
        brandName={settings.studioName}
        tagline={settings.tagline}
        footerText={homepageContent.footerText}
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
