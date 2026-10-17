import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowUpRight, Lock } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';

interface FooterProps {
  brandName?: string;
  tagline?: string;
  footerText?: string;
  whatsappNumber?: string;
  email?: string;
  instagram?: string;
  serviceArea?: string;
  transportPolicy?: string;
  operatingHours?: string;
}

export function Footer({
  brandName = 'MOMEN.POTRAIT',
  tagline = 'Every Moment Tells a Story.',
  footerText,
  whatsappNumber = '6285157335443',
  email = 'halo@momenpotrait.com',
  instagram = '@momen.potrait',
  serviceArea = 'Sesuai konfirmasi & kesepakatan pemesanan',
  transportPolicy,
  operatingHours = 'Senin - Minggu: 08:30 - 20:30 WIB',
}: FooterProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const displayPhone = cleanPhone.startsWith('62') ? '0' + cleanPhone.slice(2) : cleanPhone;

  return (
    <footer className="bg-[#111111] text-[#E5E2DC] pt-14 sm:pt-20 pb-12 border-t border-[#262624]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 sm:pb-16 border-b border-[#242422]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#FAF8F5] uppercase">
                {brandName.includes('.') ? (
                  <>
                    {brandName.split('.')[0]}
                    <span className="text-[#C5A880]">.</span>
                    {brandName.split('.').slice(1).join('.')}
                  </>
                ) : (
                  brandName
                )}
              </span>
              <p className="font-serif italic text-[#C5A880] text-sm tracking-wide mt-1">
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
            <p className="text-[#999690] text-xs sm:text-sm leading-relaxed max-w-md font-sans">
              {footerText ||
                `${brandName} adalah studio fotografi berbasis editorial yang mengabadikan kenangan Anda melalui visual hangat, tulus, dan abadi. Kami menghargai setiap emosi otentik tanpa kepura-puraan.`}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] border border-[#2E2E2C] flex items-center justify-center text-[#C5A880] hover:text-white hover:border-[#C5A880] active:bg-white/5 transition-colors"
                aria-label="Instagram MOMEN.POTRAIT"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] border border-[#2E2E2C] flex items-center justify-center text-[#C5A880] hover:text-white hover:border-[#C5A880] active:bg-white/5 transition-colors"
                aria-label="WhatsApp MOMEN.POTRAIT"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-11 h-11 min-w-[44px] min-h-[44px] border border-[#2E2E2C] flex items-center justify-center text-[#C5A880] hover:text-white hover:border-[#C5A880] active:bg-white/5 transition-colors"
                aria-label="Email MOMEN.POTRAIT"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Eksplorasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#999690] hover:text-[#FAF8F5] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-[#999690] hover:text-[#FAF8F5] transition-colors">
                  Galeri Portofolio
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-[#999690] hover:text-[#FAF8F5] transition-colors">
                  Paket & Biaya
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#999690] hover:text-[#FAF8F5] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#999690] hover:text-[#FAF8F5] transition-colors">
                  Kontak Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Packages Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Paket Fotografi
            </h4>
            <ul className="space-y-2.5 text-sm text-[#999690]">
              <li>
                <Link href="/booking?package=basic-moments" className="hover:text-[#FAF8F5] transition-colors">
                  Basic Moments
                </Link>
              </li>
              <li>
                <Link href="/booking?package=signature-moments" className="hover:text-[#FAF8F5] transition-colors">
                  Signature Moments (Best Seller)
                </Link>
              </li>
              <li>
                <Link href="/booking?package=exclusive-moments" className="hover:text-[#FAF8F5] transition-colors">
                  Exclusive Moments (Premium)
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-[#C5A880] transition-colors inline-flex items-center gap-1 font-medium">
                  <span>Lihat Seluruh Paket</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Info */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Info Studio
            </h4>
            <div className="space-y-3 text-xs text-[#999690]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{serviceArea}</span>
              </div>
              {transportPolicy && (
                <div className="text-[11px] text-[#A88A62] pl-6 -mt-1 leading-relaxed">
                  * {transportPolicy}
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{operatingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  {displayPhone}
                </a>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#C5A880] hover:text-white group font-medium"
              >
                <span>Reservasi Sekarang</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6862]">
          <p>© {new Date().getFullYear()} {brandName}. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-[#6B6862] hover:text-[#C5A880] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Portal Admin</span>
            </Link>
            <span>Editorial Photography Studio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
