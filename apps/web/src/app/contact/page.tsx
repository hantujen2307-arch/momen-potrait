import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getSettings } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Kontak Studio — MOMEN.POTRAIT',
  description:
    'Hubungi MOMEN.POTRAIT untuk konsultasi jadwal, booking sesi foto, atau pertanyaan seputar paket fotografi editorial.',
};

export default async function ContactPage() {
  const settings = await getSettings();
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  const displayPhone = cleanPhone.startsWith('62') ? '0' + cleanPhone.slice(2) : cleanPhone;

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
              <span>Get in Touch</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#141414] tracking-tight">
              Hubungi Kami
            </h1>

            <p className="text-xs sm:text-base text-[#5A5854] font-sans leading-relaxed">
              Punya pertanyaan seputar konsep pemotretan, ketersediaan tanggal khusus, atau proposal kerjasama komersial? Tim MOMEN.POTRAIT dengan senang hati membantu Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Contact Channels Grid */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              {/* WhatsApp Card */}
              <div className="bg-white p-5 sm:p-8 border border-[#EAE3DB] shadow-sm space-y-4">
                <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A7875] font-semibold">
                    Saluran Komunikasi Utama
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#141414] mt-0.5">
                    WhatsApp Chat
                  </h3>
                  <p className="text-xs text-[#5A5854] mt-1">
                    Respon cepat dalam hitungan jam operasional untuk konsultasi jadwal, paket, dan arahan busana.
                  </p>
                  <p className="font-mono text-sm font-semibold text-[#141414] mt-2">
                    {displayPhone}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${cleanPhone}?text=Halo%20MOMEN.POTRAIT,%20saya%20ingin%20berkonsultasi%20seputar%20sesi%20fotografi`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-6 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>Chat di WhatsApp ({displayPhone})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Instagram Card */}
              <div className="bg-white p-5 sm:p-8 border border-[#EAE3DB] shadow-sm space-y-4">
                <div className="w-10 h-10 bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A7875] font-semibold">
                    Koleksi Visual Terbaru
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#141414] mt-0.5">
                    Instagram Official
                  </h3>
                  <p className="text-xs text-[#5A5854] mt-1">
                    Lihat behind-the-scenes dan hasil pemotretan terbaru di <span className="font-semibold text-[#141414]">{settings.instagram}</span>.
                  </p>
                </div>
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 border border-[#141414] text-[#141414] hover:bg-[#141414] hover:text-white py-3 px-6 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <span>Kunjungi Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-white p-5 sm:p-8 border border-[#EAE3DB] shadow-sm space-y-4">
                <div className="w-10 h-10 bg-[#C5A880]/15 text-[#876E49] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A7875] font-semibold">
                    Kemitraan & Proposal Komersial
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#141414] mt-0.5">
                    Surat Elektronik
                  </h3>
                  <p className="text-xs text-[#5A5854] mt-1">
                    Untuk penawaran korporat, kerja sama media, atau pengiriman dokumen brief.
                  </p>
                </div>
                <a
                  href={`mailto:${settings.email}`}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 border border-[#EAE3DB] text-[#5A5854] hover:text-[#141414] hover:border-[#141414] py-3 px-6 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <span>{settings.email}</span>
                </a>
              </div>
            </div>

            {/* Studio Information & Operational Details */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 border border-[#EAE3DB] shadow-sm space-y-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
                  Studio Info & Coverage
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141414] mt-1">
                  Wilayah Layanan & Waktu Operasional
                </h2>
              </div>

              <div className="space-y-6 text-xs sm:text-sm font-sans divide-y divide-[#EAE3DB]">
                <div className="flex items-start gap-4 pb-6">
                  <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#141414] text-sm mb-1">
                      Cakupan Area Pemotretan
                    </h4>
                    <p className="text-[#5A5854] leading-relaxed">
                      {settings.serviceArea}
                    </p>
                    {settings.transportPolicy && (
                      <p className="text-[11px] text-[#876E49] mt-1.5 font-medium leading-relaxed">
                        * Kebijakan Transportasi: {settings.transportPolicy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 py-6">
                  <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#141414] text-sm mb-1">
                      Jam Kerja & Konsultasi
                    </h4>
                    <p className="text-[#5A5854] leading-relaxed">
                      {settings.operatingHours}
                    </p>
                    <span className="text-[11px] text-[#7A7875] mt-1 block">
                      * Sesi pemotretan di lapangan (outdoor / indoor) dapat dimulai dari subuh (sunrise) atau malam hari sesuai kesepakatan jadwal.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-6">
                  <MessageSquare className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#141414] text-sm mb-1">
                      Pemberitahuan Khusus
                    </h4>
                    <p className="text-[#5A5854] leading-relaxed">
                      {settings.bookingNotice ||
                        'Reservasi disarankan H-7 untuk memastikan ketersediaan tanggal dan slot fotografer utama.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Booking Redirect Box */}
              <div className="bg-[#FAF8F5] p-6 border border-[#EAE3DB] space-y-4">
                <h4 className="font-serif text-lg font-bold text-[#141414]">
                  Siap Melakukan Reservasi?
                </h4>
                <p className="text-xs text-[#5A5854]">
                  Jika Anda sudah mengetahui tanggal dan paket yang diinginkan, Anda dapat langsung mengisi formulir booking online untuk mendapatkan kode booking resmi.
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-[#141414] text-white hover:bg-[#A88A62] py-3.5 px-6 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px]"
                >
                  <span>Buka Formulir Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
