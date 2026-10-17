'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'Bagaimana cara melakukan booking?',
    answer:
      'Pilih paket yang sesuai pada halaman Paket Foto, isi formulir reservasi dengan informasi sesi Anda, lalu lanjutkan konfirmasi via WhatsApp untuk mengunci tanggal dan konsultasi teknis pemotretan.',
  },
  {
    question: 'Apakah diperlukan uang muka?',
    answer:
      'Ya, uang muka (Down Payment / DP) diperlukan untuk mengunci jadwal fotografer pada kalender kerja kami. Rincian dan tata cara pembayaran akan diinformasikan oleh admin saat konfirmasi booking.',
  },
  {
    question: 'Bagaimana kebijakan perubahan jadwal?',
    answer:
      'Perubahan jadwal (reschedule) dapat diajukan dengan memberi tahu tim kami paling lambat H-3 sebelum tanggal pemotretan, disesuaikan dengan ketersediaan slot kosong berikutnya.',
  },
  {
    question: 'Apakah ada biaya transportasi?',
    answer:
      'Untuk sesi di area operasional utama studio, biaya transportasi sudah termasuk. Untuk pemotretan di luar jangkauan area utama atau luar kota, biaya transportasi dan akomodasi akan dikonfirmasikan secara transparan sebelum sesi dimulai.',
  },
  {
    question: 'Berapa lama proses editing foto?',
    answer:
      'Estimasi pengerjaan editing standar adalah 5–7 hari kerja setelah Anda memilih foto favorit dari galeri pratinjau. Detail estimasi spesifik tertera pada masing-masing paket yang Anda pilih.',
  },
  {
    question: 'Apakah semua file foto asli diberikan?',
    answer:
      'Ketentuan penyerahan file asli bergantung pada paket yang dipilih. Beberapa paket menyertakan seluruh file original resolusi tinggi, sementara paket lainnya berfokus pada foto terpilih yang telah diedit secara optimal.',
  },
  {
    question: 'Bagaimana cara menerima hasil foto?',
    answer:
      'Hasil akhir foto akan diserahkan melalui tautan cloud storage privat (Google Drive / Online Gallery) beresolusi tinggi yang dapat Anda unduh dan bagikan dengan mudah.',
  },
];

export function FaqAccordion({ items }: { items?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const activeFaqs = items && items.length > 0 ? items : DEFAULT_FAQS;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-[#EAE3DB] border-y border-[#EAE3DB]">
      {activeFaqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-4 sm:py-6">
            <button
              onClick={() => toggle(idx)}
              className="w-full min-h-[44px] py-1 flex items-center justify-between gap-4 text-left group focus:outline-none cursor-pointer"
            >
              <span className="font-serif text-base sm:text-xl font-medium text-[#141414] group-hover:text-[#A88A62] transition-colors leading-snug">
                {faq.question}
              </span>
              <span className="shrink-0 w-8 h-8 rounded-full border border-[#EAE3DB] flex items-center justify-center text-[#5A5854] group-hover:border-[#141414] group-hover:text-[#141414] transition-colors">
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="pt-2 sm:pt-3 pr-2 sm:pr-10 text-xs sm:text-sm text-[#5A5854] font-sans leading-relaxed animate-in fade-in duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
