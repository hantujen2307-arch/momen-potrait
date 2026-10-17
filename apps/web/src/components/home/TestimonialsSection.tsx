'use client';

import React from 'react';
import Image from 'next/image';
import { Quote, Sparkles } from 'lucide-react';
import { Testimonial } from '@/lib/api';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // If there are no published testimonials from real clients, hide the section completely from visitors
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 bg-white border-t border-[#EAE3DB]">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EFEA] border border-[#EAE3DB] text-[#876E49] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Kisah & Pengalaman Nyata</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#141414]">
            Refleksi Klien Kami
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7875] font-sans leading-relaxed">
            Pengalaman dan kesan tulus dari mereka yang telah mempercayakan kenangan pentingnya bersama MOMEN.POTRAIT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 bg-[#FAF8F5] border border-[#EAE3DB] flex flex-col justify-between shadow-xs hover:border-[#C5A880] transition-colors"
            >
              <div className="space-y-4">
                <Quote className="w-6 h-6 text-[#C5A880] opacity-60" />
                <p className="font-serif italic text-sm sm:text-base text-[#141414] leading-relaxed">
                  &ldquo;{item.reviewText}&rdquo;
                </p>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-[#EAE3DB] flex items-center gap-3">
                {item.avatarUrl ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#C5A880]/40">
                    <Image
                      src={item.avatarUrl}
                      alt={item.clientName}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#141414] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <span className="font-serif font-bold text-sm text-[#141414] block">
                    {item.clientName}
                  </span>
                  {item.sessionType && (
                    <span className="text-[10px] sm:text-[11px] text-[#876E49] uppercase tracking-wider block font-sans">
                      {item.sessionType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
