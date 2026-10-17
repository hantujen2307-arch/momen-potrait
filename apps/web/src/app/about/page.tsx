import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Sun,
  Eye,
  Sparkles,
} from 'lucide-react';
import { getSettings } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tentang Kami — MOMEN.POTRAIT',
  description:
    'Mengenal filosofi, gaya fotografi editorial, dan pendekatan MOMEN.POTRAIT dalam mengabadikan setiap momen berharga Anda menjadi cerita visual yang tulus dan abadi.',
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar whatsappNumber={settings.whatsappNumber} />

      <main className="flex-grow pt-24 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
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
              <span>Filosofi & Pendekatan</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#141414] tracking-tight">
              Foto yang Terasa Seperti Anda.
            </h1>

            <p className="text-xs sm:text-base text-[#5A5854] font-sans leading-relaxed">
              Kami memandang fotografi sebagai sarana merawat ingatan. Ketika waktu terus berlalu, sebuah potret yang tulus mampu menghadirkan kembali getaran emosi, senyuman, dan kehangatan yang sama seperti saat momen tersebut berlangsung.
            </p>
          </div>

          {/* Editorial Story Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-5 sm:p-10 md:p-14 border border-[#EAE3DB] shadow-sm">
            <div className="lg:col-span-6 relative aspect-[4/5] w-full overflow-hidden bg-[#141414] shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1200&q=80"
                alt="Proses pemotretan editorial MOMEN.POTRAIT"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                <span className="font-serif italic text-sm text-[#DFCA9B] block">
                  "Menangkap yang tak terkatakan melalui keheningan lensa."
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#999690] mt-1 block">
                  Dokumentasi di balik proses pemotretan editorial
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
                Pendekatan Kami
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414] leading-snug">
                Bukan Sekadar Mengambil Gambar, Kami Menjaga Keaslian Momen.
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5854] font-sans leading-relaxed">
                Di MOMEN.POTRAIT, kami menghindari sesi pemotretan yang terasa seperti tugas formal yang kaku. Kami merancang setiap sesi agar mengalir layaknya perbincangan hangat, memberi ruang bagi Anda untuk merasa nyaman dan rileks.
              </p>
              <p className="text-xs sm:text-sm text-[#5A5854] font-sans leading-relaxed">
                Kekuatan dokumentasi kami berakar pada observasi: menangkap jeda di antara tawa, tatapan bangga keluarga saat kelulusan, atau genggaman tangan sederhana pasangan yang terjadi secara spontan tanpa rekayasa berlebihan.
              </p>

              <div className="pt-4 border-t border-[#EAE3DB] grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="font-serif font-bold text-[#141414] text-base block">
                    Warm & Natural
                  </span>
                  <span className="text-[#7A7875]">Tone warna hangat alami dengan warna kulit yang akurat.</span>
                </div>
                <div>
                  <span className="font-serif font-bold text-[#141414] text-base block">
                    Arahan Lembut
                  </span>
                  <span className="text-[#7A7875]">Panduan pose bersahabat tanpa membuat subjek canggung.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars of Aesthetic */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C5A880] uppercase">
                Karakter Visual
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#141414]">
                Tiga Karakter Visual MOMEN.POTRAIT
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white border border-[#EAE3DB] space-y-4">
                <Sun className="w-8 h-8 text-[#A88A62] stroke-1" />
                <h3 className="font-serif text-xl font-bold text-[#141414]">
                  Pencahayaan Bernyawa
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed font-sans">
                  Kami mengutamakan cahaya alami (natural daylight dan golden hour) dipadu tata cahaya halus, menjaga bayangan lembut dan dimensi kedalaman objek secara artistik.
                </p>
              </div>

              <div className="p-8 bg-white border border-[#EAE3DB] space-y-4">
                <Eye className="w-8 h-8 text-[#A88A62] stroke-1" />
                <h3 className="font-serif text-xl font-bold text-[#141414]">
                  Kejujuran Emosi
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed font-sans">
                  Foto yang bernilai tinggi bukan yang paling kaku posenya, melainkan yang paling tulus menyampaikan perasaan dan kehangatan subjek pada saat itu.
                </p>
              </div>

              <div className="p-8 bg-white border border-[#EAE3DB] space-y-4">
                <Sparkles className="w-8 h-8 text-[#A88A62] stroke-1" />
                <h3 className="font-serif text-xl font-bold text-[#141414]">
                  Editorial & Abadi
                </h3>
                <p className="text-xs text-[#5A5854] leading-relaxed font-sans">
                  Sentuhan kurasi warna kami menghadirkan nuansa majalah seni yang elegan, tidak berlebihan, dan tetap relevan dipandang bertahun-tahun mendatang.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="bg-[#141414] text-[#FAF8F5] p-10 sm:p-14 border border-[#262624] text-center space-y-6">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
              Mulai Kolaborasi Visual Anda
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold">
              Mari Ceritakan Kisah Anda Bersama Kami
            </h3>
            <p className="text-xs text-[#999690] max-w-lg mx-auto font-sans leading-relaxed">
              Jelajahi paket sesi fotografi kami atau diskusikan konsep khusus Anda langsung dengan tim MOMEN.POTRAIT.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#C5A880] text-[#FAF8F5] hover:bg-white/10 py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-colors min-h-[44px]"
              >
                <span>Lihat Portofolio</span>
              </Link>
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C5A880] text-[#141414] hover:bg-[#DFCA9B] py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-colors shadow-md min-h-[44px]"
              >
                <span>Booking Sesi Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
