'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { PortfolioItem } from '@/lib/api';

interface LightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [isOpen, onClose, onPrev, onNext],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      onNext();
    } else if (diff < -40) {
      onPrev();
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-8 animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button (>= 44x44px) */}
      <button
        onClick={onClose}
        aria-label="Tutup foto"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#E5E2DC] hover:text-[#C5A880] bg-black/60 hover:bg-black/80 rounded-full transition-all border border-white/20 active:scale-95"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Prev button (>= 44x44px) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Foto sebelumnya"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#FAF8F5] hover:text-[#C5A880] bg-black/60 hover:bg-black/80 rounded-full transition-all border border-white/20 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Next button (>= 44x44px) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Foto selanjutnya"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#FAF8F5] hover:text-[#C5A880] bg-black/60 hover:bg-black/80 rounded-full transition-all border border-white/20 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Content wrapper */}
      <div
        className="relative max-w-5xl w-full max-h-[94vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[52vh] sm:h-[70vh] flex items-center justify-center">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            className="object-contain rounded-sm"
          />
        </div>

        {/* Caption & details bar */}
        <div className="w-full max-w-2xl mt-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-white px-2">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C5A880] bg-[#C5A880]/15 px-2 py-0.5 border border-[#C5A880]/30">
                {currentItem.category}
              </span>
              <span className="text-xs text-[#999690]">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#FAF8F5]">
              {currentItem.title}
            </h3>
            {currentItem.description && (
              <p className="text-xs text-[#999690] mt-0.5 max-w-md font-sans">
                {currentItem.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#999690] font-sans shrink-0">
            {currentItem.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{currentItem.location}</span>
              </div>
            )}
            {currentItem.shootDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{currentItem.shootDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
