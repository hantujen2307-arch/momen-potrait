'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FileEdit,
  Save,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminHomepageContent,
  updateAdminHomepageContent,
  uploadAdminFile,
} from '@/lib/admin-api';

interface FaqItem {
  question: string;
  answer: string;
}

export default function AdminHomepageContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'faq' | 'cta'>('hero');

  // Form Fields
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('Booking Sekarang');
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState('/booking');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('Lihat Paket');
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState('/packages');

  const [aboutTitle, setAboutTitle] = useState('Foto yang Terasa Seperti Anda.');
  const [aboutTagline, setAboutTagline] = useState('Filosofi Fotografi Kami');
  const [aboutDescription, setAboutDescription] = useState('');

  const [ctaHeadline, setCtaHeadline] = useState('');
  const [ctaDescription, setCtaDescription] = useState('');
  const [ctaButtonText, setCtaButtonText] = useState('Reservasi Sesi Sekarang');
  const [ctaButtonLink, setCtaButtonLink] = useState('/booking');

  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [footerText, setFooterText] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await getAdminHomepageContent();
      setHeroHeadline(data.heroHeadline || '');
      setHeroDescription(data.heroDescription || '');
      setHeroImageUrl(data.heroImageUrl || '');
      setHeroPrimaryCtaText(data.heroPrimaryCtaText || 'Booking Sekarang');
      setHeroPrimaryCtaLink(data.heroPrimaryCtaLink || '/booking');
      setHeroSecondaryCtaText(data.heroSecondaryCtaText || 'Lihat Paket');
      setHeroSecondaryCtaLink(data.heroSecondaryCtaLink || '/packages');

      setAboutTitle(data.aboutTitle || 'Foto yang Terasa Seperti Anda.');
      setAboutTagline(data.aboutTagline || 'Filosofi Fotografi Kami');
      setAboutDescription(data.aboutDescription || '');

      setCtaHeadline(data.ctaHeadline || '');
      setCtaDescription(data.ctaDescription || '');
      setCtaButtonText(data.ctaButtonText || 'Reservasi Sesi Sekarang');
      setCtaButtonLink(data.ctaButtonLink || '/booking');

      setFaqItems(Array.isArray(data.faqItems) ? data.faqItems : []);
      setFooterText(data.footerText || '');
    } catch (err) {
      console.error('Error fetching homepage content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await uploadAdminFile(file, 'homepage');
      setHeroImageUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah foto');
    } finally {
      setUploading(false);
    }
  };

  const handleAddFaq = () => {
    setFaqItems([
      ...faqItems,
      {
        question: 'Pertanyaan baru...',
        answer: 'Jawaban detail untuk pertanyaan ini...',
      },
    ]);
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqItems];
    updated[index][field] = value;
    setFaqItems(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAdminHomepageContent({
        heroHeadline,
        heroDescription,
        heroImageUrl,
        heroPrimaryCtaText,
        heroPrimaryCtaLink,
        heroSecondaryCtaText,
        heroSecondaryCtaLink,
        aboutTitle,
        aboutTagline,
        aboutDescription,
        ctaHeadline,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink,
        faqItems,
        footerText,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan konten homepage');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#7A7875]">
        Memuat editor konten homepage...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Editorial CMS Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Edit Konten Homepage
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Kelola teks hero, foto utama, narasi brand, daftar FAQ, dan ajakan reservasi yang tayang di halaman depan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchContent}
            className="inline-flex items-center gap-2 border border-[#2B2B28] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider px-4 py-2 transition-colors min-h-[44px]"
          >
            <span>Preview Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-950/60 border-l-4 border-green-500 text-green-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span>Perubahan konten homepage berhasil disimpan ke database dan langsung aktif di website publik.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#242422] text-xs font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`py-3 px-5 border-b-2 transition-colors min-h-[44px] shrink-0 flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'border-[#C5A880] text-[#C5A880]'
              : 'border-transparent text-[#7A7875] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Hero Section</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`py-3 px-5 border-b-2 transition-colors min-h-[44px] shrink-0 flex items-center gap-2 ${
            activeTab === 'about'
              ? 'border-[#C5A880] text-[#C5A880]'
              : 'border-transparent text-[#7A7875] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. Cerita & Brand</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          className={`py-3 px-5 border-b-2 transition-colors min-h-[44px] shrink-0 flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'border-[#C5A880] text-[#C5A880]'
              : 'border-transparent text-[#7A7875] hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>3. Konten FAQ ({faqItems.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cta')}
          className={`py-3 px-5 border-b-2 transition-colors min-h-[44px] shrink-0 flex items-center gap-2 ${
            activeTab === 'cta'
              ? 'border-[#C5A880] text-[#C5A880]'
              : 'border-transparent text-[#7A7875] hover:text-white'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>4. Banner CTA & Footer</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
        {/* Tab 1: Hero Section */}
        {activeTab === 'hero' && (
          <div className="bg-[#141414] border border-[#242422] p-5 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF8F5] pb-3 border-b border-[#242422]">
              Pengaturan Hero Utama Beranda
            </h3>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Headline Utama (Serif) *
              </label>
              <input
                type="text"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                placeholder="Every Moment Tells a Story."
                className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-sm text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Deskripsi Singkat Hero *
              </label>
              <textarea
                rows={3}
                required
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="Fotografi potret editorial, wisuda, pasangan..."
                className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
              />
            </div>

            {/* Foto Hero dengan Preview & Upload */}
            <div className="p-4 bg-[#181817] border border-[#2B2B28] space-y-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880] block">
                Foto Utama Hero Pemotretan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="relative aspect-[4/5] w-full bg-[#111111] border border-[#2E2E2C] overflow-hidden">
                  {heroImageUrl ? (
                    <Image
                      src={heroImageUrl}
                      alt="Hero preview"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7A7875] text-[10px] p-2 text-center">
                      Belum ada foto hero
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#7A7875] mb-1 font-semibold">
                      URL Gambar (High-Res)
                    </label>
                    <input
                      type="url"
                      required
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#7A7875] mb-1 font-semibold">
                      Atau Upload Foto Langsung dari HP / Laptop:
                    </label>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#2B2B28] hover:border-[#C5A880] text-white text-xs uppercase tracking-wider cursor-pointer bg-[#141414] min-h-[44px]">
                      <Upload className="w-4 h-4 text-[#C5A880]" />
                      <span>{uploading ? 'Mengunggah...' : 'Pilih File Gambar'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Teks Tombol Utama
                </label>
                <input
                  type="text"
                  value={heroPrimaryCtaText}
                  onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                  placeholder="Booking Sekarang"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Tautan Tombol Utama
                </label>
                <input
                  type="text"
                  value={heroPrimaryCtaLink}
                  onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
                  placeholder="/booking"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Teks Tombol Sekunder
                </label>
                <input
                  type="text"
                  value={heroSecondaryCtaText}
                  onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                  placeholder="Lihat Paket"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Tautan Tombol Sekunder
                </label>
                <input
                  type="text"
                  value={heroSecondaryCtaLink}
                  onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                  placeholder="/packages"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cerita & Brand */}
        {activeTab === 'about' && (
          <div className="bg-[#141414] border border-[#242422] p-5 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF8F5] pb-3 border-b border-[#242422]">
              Tentang Brand MOMEN.POTRAIT di Beranda
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Judul Narasi Brand (Heading)
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="Foto yang Terasa Seperti Anda."
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Tagline Brand
                </label>
                <input
                  type="text"
                  value={aboutTagline}
                  onChange={(e) => setAboutTagline(e.target.value)}
                  placeholder="Setiap Bingkai Menyimpan Makna"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Deskripsi Cerita Filosofi Brand
              </label>
              <textarea
                rows={5}
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                placeholder="Kami adalah studio fotografi kontemporer yang percaya bahwa keindahan visual terletak pada keaslian ekspresi..."
                className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Konten FAQ */}
        {activeTab === 'faq' && (
          <div className="bg-[#141414] border border-[#242422] p-5 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </h3>
                <p className="text-[11px] text-[#7A7875]">
                  Daftar pertanyaan dan jawaban yang tampil di accordion beranda.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#C5A880] text-[#141414] font-semibold text-xs uppercase tracking-wider min-h-[40px]"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ</span>
              </button>
            </div>

            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#181817] border border-[#262624] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-[#C5A880] font-semibold">
                      FAQ #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="text-red-400 hover:text-red-300 p-1 min-h-[32px]"
                      title="Hapus Pertanyaan Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#7A7875] mb-1 font-semibold">
                      Pertanyaan
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#7A7875] mb-1 font-semibold">
                      Jawaban
                    </label>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Banner CTA & Footer */}
        {activeTab === 'cta' && (
          <div className="bg-[#141414] border border-[#242422] p-5 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF8F5] pb-3 border-b border-[#242422]">
              Banner CTA Bagian Bawah & Footer
            </h3>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Headline Banner CTA
              </label>
              <input
                type="text"
                value={ctaHeadline}
                onChange={(e) => setCtaHeadline(e.target.value)}
                placeholder="Siap Mengabadikan Momen Berharga Anda?"
                className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Deskripsi Banner CTA
              </label>
              <textarea
                rows={3}
                value={ctaDescription}
                onChange={(e) => setCtaDescription(e.target.value)}
                placeholder="Konsultasikan konsep sesi pemotretan Anda bersama fotografer utama kami..."
                className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Teks Tombol CTA
                </label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  placeholder="Reservasi Sesi Sekarang"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Tautan Tombol CTA
                </label>
                <input
                  type="text"
                  value={ctaButtonLink}
                  onChange={(e) => setCtaButtonLink(e.target.value)}
                  placeholder="/booking"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#242422]">
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Catatan Footer & Hak Cipta
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Every Moment Tells a Story. Hak Cipta Dilindungi."
                className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>
          </div>
        )}

        {/* Global Save Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#141414] border border-[#242422] sticky bottom-4 z-20 shadow-xl">
          <span className="text-[11px] text-[#7A7875] text-center sm:text-left">
            Pastikan seluruh data sudah sesuai sebelum menekan tombol simpan.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-3 px-8 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan Konten...' : 'Simpan Konten Homepage'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
