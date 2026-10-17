'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  whatsappNumber?: string;
}

export function Navbar({ whatsappNumber = '6285157335443' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Adjust state when route changes (idiomatic React pattern instead of useEffect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Portofolio', href: '/portfolio' },
    { name: 'Paket Foto', href: '/packages' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Kontak', href: '/contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) {
    // Admin has its own dedicated navigation
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? 'bg-[#FAF8F5] border-b border-[#EAE3DB] py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            : 'bg-[#FAF8F5]/80 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Wordmark Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-decoration-none focus:outline-none min-h-[44px] py-1"
          >
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#141414] group-hover:text-[#A88A62] transition-colors uppercase">
                MOMEN<span className="text-[#C5A880]">.</span>POTRAIT
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#7A7875] uppercase font-sans -mt-1 font-medium">
                Editorial Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#141414] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#C5A880]'
                      : 'text-[#5A5854] hover:text-[#141414]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#141414] text-[#FAF8F5] hover:bg-[#A88A62] hover:text-white px-5 py-2.5 rounded-none text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 shadow-sm group min-h-[44px]"
            >
              <span>Booking Sekarang</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle (Strict >= 44x44px touch target) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#141414] hover:text-[#C5A880] focus:outline-none rounded-sm active:bg-[#EAE3DB]/50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-[#EAE3DB] bg-[#FAF8F5] px-5 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`min-h-[44px] flex items-center px-3 text-sm font-serif tracking-[0.15em] uppercase transition-colors rounded-none ${
                      isActive
                        ? 'text-[#C5A880] font-bold bg-[#F4EFEA] border-l-2 border-[#C5A880]'
                        : 'text-[#141414] hover:text-[#A88A62] active:bg-[#EAE3DB]/40'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-[#EAE3DB] flex flex-col gap-3">
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#141414] text-white py-3 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-[#A88A62] active:bg-[#876E49] transition-colors shadow-sm"
                >
                  <span>Booking Sekarang</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Halo%20MOMEN.POTRAIT,%20saya%20ingin%20bertanya%20seputar%20sesi%20foto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 border border-[#141414] text-[#141414] py-2.5 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#141414] hover:text-white transition-colors"
                >
                  <span>WhatsApp Tim Studio</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile drawer dismiss */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}
    </>
  );
}
