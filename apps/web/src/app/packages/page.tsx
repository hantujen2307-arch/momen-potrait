import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Camera,
  FolderArchive,
} from 'lucide-react';
import { getPackages, getSettings } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PackagesGridSection } from '@/components/packages/PackagesGridSection';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Paket & Biaya Fotografi — MOMEN.POTRAIT',
  description:
    'Rincian paket fotografi MOMEN.POTRAIT dengan harga transparan, benefit konkret, dan alur booking terintegrasi langsung.',
};

export default async function PackagesPage() {
  const [packages, settings] = await Promise.all([
    getPackages(),
    getSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Navbar whatsappNumber={settings.whatsappNumber} />

      <main className="flex-grow pt-24 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A7875] hover:text-[#141414] transition-colors min-h-[44px] py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EFEA] border border-[#EAE3DB] text-[#876E49] text-[10px] font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 text-[#C5A880]" />
              <span>Pilihan Investasi Dokumentasi</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#141414] tracking-tight">
              Paket & Biaya
            </h1>

            <p className="text-xs sm:text-base text-[#5A5854] font-sans leading-relaxed">
              Kami menyajikan informasi harga, durasi sesi, dan benefit yang transparan. Seluruh paket terhubung langsung dengan sistem reservasi untuk kemudahan Anda.
            </p>
          </div>

          {/* Pricing Disclaimer Alert */}
          <div className="p-4 bg-amber-50 border-l-4 border-amber-600 text-xs text-amber-900 leading-relaxed max-w-4xl font-sans">
            <span className="font-semibold block mb-0.5">Catatan Transparansi Biaya:</span>
            Harga yang tercantum merupakan estimasi paket standar untuk sesi foto sesuai durasi yang dipilih. Biaya sewa studio berbayar khusus, izin tiket lokasi komersial, atau pemotretan luar area layanan dikonfirmasikan secara transparan sebelum pembayaran uang muka (DP).
          </div>

          {/* Visual Photography Package Cards Grid with Detail Modal */}
          <PackagesGridSection packages={packages} />

          {/* Dynamic Comparison Matrix Table based on Admin Packages */}
          {packages && packages.length > 0 && (
            <div className="bg-white border border-[#EAE3DB] p-5 sm:p-8 md:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                  Perbandingan Fitur Paket
                </h3>
                <span className="sm:hidden text-[10px] text-[#876E49] bg-[#FAF8F5] px-2.5 py-1 border border-[#EAE3DB] inline-block font-sans">
                  Geser ke kanan untuk melihat rincian →
                </span>
              </div>

              <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full text-left text-xs font-sans border-collapse min-w-[580px]">
                  <thead>
                    <tr className="border-b border-[#EAE3DB] text-[11px] uppercase tracking-wider text-[#7A7875]">
                      <th className="py-3 px-4">Fitur Layanan</th>
                      {packages.map((pkg) => (
                        <th
                          key={pkg.id}
                          className={`py-3 px-4 ${pkg.isPopular ? 'text-[#876E49] font-bold' : ''}`}
                        >
                          {pkg.name} {pkg.badgeLabel && `(${pkg.badgeLabel})`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3DB] text-[#5A5854]">
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Biaya Paket</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4 font-semibold text-[#141414]">
                          Rp{pkg.price.toLocaleString('id-ID')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Durasi Sesi</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4">
                          {pkg.durationMinutes} Menit
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Foto Retouch Pilihan</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4">
                          {pkg.editedPhotoCount} Foto
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Lokasi / Spot</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4">
                          {pkg.locationCount}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Pilihan Pakaian</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4">
                          {pkg.outfitCount || '1 Outfit'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">File Foto Asli</td>
                      {packages.map((pkg) => (
                        <td
                          key={pkg.id}
                          className={`py-3 px-4 ${
                            pkg.includesOriginalFiles
                              ? 'text-green-700 font-semibold'
                              : 'text-[#876E49]'
                          }`}
                        >
                          {pkg.includesOriginalFiles ? 'Termasuk Seluruh File' : 'Foto Pilihan Hasil Edit'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Estimasi Penyerahan</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4">
                          {pkg.deliveryEstimate}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#141414]">Aksi Booking</td>
                      {packages.map((pkg) => (
                        <td key={pkg.id} className="py-3 px-4">
                          <Link
                            href={`/booking?package=${pkg.slug}`}
                            className="min-h-[44px] inline-flex items-center text-[11px] font-semibold text-[#141414] hover:text-[#C5A880] uppercase tracking-wider"
                          >
                            Pilih Paket →
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Custom Inquiry Box */}
          <div className="bg-[#141414] text-[#FAF8F5] p-6 sm:p-10 md:p-12 border border-[#262624] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                Kebutuhan Khusus atau Event?
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold">
                Konsultasi Konsep & Sesi Khusus
              </h3>
              <p className="text-xs text-[#999690] max-w-xl font-sans">
                Untuk pemotretan pernikahan penuh, dokumentasi gathering, liputan produk komersial, atau sesi luar area layanan, silakan hubungi tim kami untuk proposal penawaran khusus.
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(settings.studioName || 'MOMEN.POTRAIT')},%20saya%20ingin%20konsultasi%20paket%20sesi%20khusus`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] shrink-0 inline-flex items-center justify-center gap-2 bg-[#C5A880] text-[#141414] hover:bg-[#DFCA9B] py-3.5 px-8 text-xs font-semibold uppercase tracking-[0.2em] transition-colors shadow-md"
            >
              <span>Hubungi via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
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
