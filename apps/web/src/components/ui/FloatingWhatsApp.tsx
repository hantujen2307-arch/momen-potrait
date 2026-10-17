'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  studioName?: string;
}

export function FloatingWhatsApp({
  whatsappNumber = '6285157335443',
  studioName = 'MOMEN.POTRAIT',
}: FloatingWhatsAppProps) {
  const pathname = usePathname();

  // Do not show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cleanPhone = whatsappNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(
    `Halo ${studioName}, saya ingin konsultasi seputar jadwal dan paket sesi fotografi.`,
  );

  return (
    <aside aria-label="Kontak Cepat WhatsApp" className="fixed bottom-6 right-4 sm:right-6 z-40 print:hidden">
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi cepat via WhatsApp"
        className="group flex items-center gap-2.5 bg-[#141414] hover:bg-[#25D366] text-[#FAF8F5] px-4 py-3 rounded-full border border-[#C5A880]/40 hover:border-[#25D366] shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-300 min-h-[44px] min-w-[44px] active:scale-95"
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]" />
        </span>
        <MessageCircle className="w-4 h-4 text-[#C5A880] group-hover:text-white transition-colors shrink-0" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wider uppercase font-sans text-white">
          WhatsApp Studio
        </span>
      </a>
    </aside>
  );
}
