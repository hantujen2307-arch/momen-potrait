'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  X,
  Star,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import {
  getAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} from '@/lib/admin-api';

interface TestimonialItem {
  id: string;
  clientName: string;
  reviewText: string;
  sessionType?: string;
  avatarUrl?: string;
  isPublished: boolean;
  rating?: number;
  sortOrder: number;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAdminTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat testimoni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setClientName('');
    setReviewText('');
    setSessionType('');
    setAvatarUrl('');
    setIsPublished(false);
    setRating(5);
    setShowModal(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setClientName(item.clientName);
    setReviewText(item.reviewText);
    setSessionType(item.sessionType || '');
    setAvatarUrl(item.avatarUrl || '');
    setIsPublished(item.isPublished);
    setRating(item.rating || 5);
    setShowModal(true);
  };

  const handleTogglePublish = async (item: TestimonialItem) => {
    try {
      await updateAdminTestimonial(item.id, { isPublished: !item.isPublished });
      setSuccess(`Status publikasi testimoni "${item.clientName}" berhasil diperbarui.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status publikasi');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus testimoni dari "${name}"?`)) return;
    try {
      await deleteAdminTestimonial(id);
      setSuccess(`Testimoni dari "${name}" berhasil dihapus.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus testimoni');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingItem) {
        await updateAdminTestimonial(editingItem.id, {
          clientName: clientName.trim(),
          reviewText: reviewText.trim(),
          sessionType: sessionType.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          isPublished,
          rating,
        });
        setSuccess('Testimoni berhasil diperbarui.');
      } else {
        await createAdminTestimonial({
          clientName: clientName.trim(),
          reviewText: reviewText.trim(),
          sessionType: sessionType.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          isPublished,
          rating,
        });
        setSuccess('Testimoni baru berhasil ditambahkan.');
      }
      setShowModal(false);
      setTimeout(() => setSuccess(null), 3000);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan testimoni');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Social Proof Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Testimoni & Ulasan Klien
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Hanya tampilkan testimoni nyata yang diberikan atas izin pelanggan. Jika tidak ada testimoni aktif, bagian ini otomatis disembunyikan dari halaman depan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            className="inline-flex items-center gap-2 border border-[#2B2B28] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#C5A880] text-[#141414] hover:bg-[#DFCA9B] font-semibold text-xs uppercase tracking-wider px-5 py-2.5 transition-colors shadow-md min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni</span>
          </button>
        </div>
      </div>

      {/* Policy Notice Box */}
      <div className="p-4 bg-amber-950/40 border-l-4 border-[#C5A880] text-amber-200/90 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold block text-[#FAF8F5]">Pedoman Integritas Testimoni:</span>
          <p className="text-[#B3B0A8] leading-relaxed">
            Sesuai standar kredibilitas MOMEN.POTRAIT, dilarang memasukkan ulasan fiktif atau data buatan. Testimoni yang ditandai <strong>"Diterbitkan"</strong> akan tampil di beranda website publik. Jika belum ada ulasan yang dipublikasikan, beranda tidak akan menampilkan bagian testimoni kepada pengunjung.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-950/60 border-l-4 border-green-500 text-green-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Testimonials List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#7A7875]">
          Memuat daftar testimoni...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 px-4 bg-[#141414] border border-[#242422] text-center space-y-4">
          <MessageSquareQuote className="w-12 h-12 text-[#C5A880] mx-auto opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#FAF8F5]">
            Belum Ada Testimoni Nyata yang Tercatat
          </h3>
          <p className="text-xs text-[#7A7875] max-w-md mx-auto">
            Halaman publik saat ini menyembunyikan section ulasan secara aman. Ketika Anda menerima feedback positif dari sesi pemotretan klien, Anda dapat menambahkannya di sini.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#C5A880] text-[#141414] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`p-5 bg-[#141414] border flex flex-col justify-between transition-colors ${
                item.isPublished ? 'border-[#C5A880]/60' : 'border-[#242422] opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#242422]">
                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                      item.isPublished
                        ? 'bg-green-950 text-green-300 border border-green-800'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {item.isPublished ? 'Diterbitkan (Aktif di Web)' : 'Draft (Tidak Tayang)'}
                  </span>
                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="font-serif italic text-sm text-[#FAF8F5] leading-relaxed">
                  "{item.reviewText}"
                </p>

                <div className="pt-3 flex items-center gap-3">
                  {item.avatarUrl ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#C5A880]/40">
                      <Image
                        src={item.avatarUrl}
                        alt={item.clientName}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#242422] text-[#C5A880] flex items-center justify-center font-serif font-bold text-xs shrink-0">
                      {item.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-xs text-white block">
                      {item.clientName}
                    </span>
                    {item.sessionType && (
                      <span className="text-[10px] text-[#A88A62] block">
                        {item.sessionType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#242422] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  className={`text-[10px] uppercase font-semibold tracking-wider px-3 py-1.5 transition-colors min-h-[36px] ${
                    item.isPublished
                      ? 'border border-amber-600 text-amber-400 hover:bg-amber-950/40'
                      : 'border border-green-600 text-green-400 hover:bg-green-950/40'
                  }`}
                >
                  {item.isPublished ? 'Sembunyikan' : 'Terbitkan'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-2 text-[#999690] hover:text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Edit Testimoni"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.clientName)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Hapus Testimoni"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-[#141414] border border-[#2B2B28] max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingItem ? 'Edit Testimoni Pelanggan' : 'Tambah Testimoni Nyata Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#7A7875] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1">
                  Nama Pelanggan / Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: Sarah Aulia atau Sarah & Bima"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1">
                  Paket atau Jenis Sesi Terkait
                </label>
                <input
                  type="text"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  placeholder="Contoh: Graduation Session • UI Depok atau Signature Moments"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1">
                  Ulasan Asli Pelanggan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Salin teks ulasan yang diberikan klien secara sukarela..."
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1">
                  URL Foto Profil (Opsional)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="publishToggle"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A880] cursor-pointer"
                />
                <label htmlFor="publishToggle" className="text-xs text-white cursor-pointer">
                  Terbitkan langsung ke halaman depan website
                </label>
              </div>

              <div className="pt-4 border-t border-[#242422] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#2E2E2C] text-xs uppercase tracking-wider text-[#999690] hover:text-white min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#C5A880] text-[#141414] hover:bg-[#DFCA9B] font-semibold text-xs uppercase tracking-wider px-6 py-2.5 transition-colors disabled:opacity-50 min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Testimoni'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
