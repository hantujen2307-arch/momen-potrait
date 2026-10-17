'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Camera } from 'lucide-react';
import { PortfolioItem } from '@/lib/api';
import { Lightbox } from '@/components/ui/Lightbox';

interface PortfolioGalleryProps {
  initialItems: PortfolioItem[];
  categories?: string[];
  showFilter?: boolean;
}

const DEFAULT_CATEGORIES = [
  'Semua',
  'Portrait',
  'Graduation',
  'Couple',
  'Prewedding',
  'Wedding',
  'Event',
  'Product',
];

export function PortfolioGallery({
  initialItems,
  categories = DEFAULT_CATEGORIES,
  showFilter = true,
}: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = initialItems.filter((item) => {
    if (selectedCategory === 'Semua' || selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      {/* Category Filter Pills */}
      {showFilter && (
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 sm:gap-3 no-scrollbar mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[44px] px-4 sm:px-5 py-2.5 text-xs uppercase tracking-[0.15em] transition-all duration-200 shrink-0 border cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#141414] text-[#FAF8F5] border-[#141414] shadow-sm font-semibold'
                    : 'bg-white text-[#5A5854] border-[#EAE3DB] hover:border-[#141414] hover:text-[#141414]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-[#EAE3DB] max-w-xl mx-auto my-8">
          <Camera className="w-10 h-10 text-[#C5A880] mx-auto mb-4 stroke-1" />
          <h3 className="font-serif text-xl font-bold text-[#141414] mb-2">
            Belum Ada Foto dalam Kategori Ini
          </h3>
          <p className="text-xs text-[#7A7875] max-w-sm mx-auto mb-6">
            Galeri untuk kategori <strong>{selectedCategory}</strong> sedang dalam proses kurasi editorial. Silakan lihat kategori lainnya atau hubungi kami untuk portofolio privat.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="min-h-[44px] px-6 py-2.5 bg-[#141414] text-white text-xs uppercase tracking-[0.15em] hover:bg-[#A88A62] transition-colors"
          >
            Lihat Semua Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative cursor-pointer overflow-hidden bg-[#141414] shadow-sm transition-all duration-300 hover:shadow-xl active:scale-[0.99]"
            >
              {/* Image Aspect ratio container */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover image-zoom transition-transform duration-700 ease-out"
                />

                {/* Editorial Vignette & Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-75 sm:opacity-60 sm:group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#FAF8F5] bg-black/60 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* View Icon Button on hover/touch */}
                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Bottom Title & Details - Always clearly legible on mobile screens */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] font-medium leading-snug">
                    {item.title}
                  </h3>
                  {item.clientName && (
                    <p className="text-xs text-[#C5A880] mt-1 font-sans">
                      {item.clientName} {item.location ? `• ${item.location}` : ''}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-[#B3B0A8] mt-1 line-clamp-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        items={filteredItems}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
