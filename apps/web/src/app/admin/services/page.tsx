'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Camera,
  CheckCircle2,
  Edit2,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';
import { getServices, PhotographyService } from '@/lib/api';
import { getAdminToken } from '@/lib/admin-api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminServicesPage() {
  const [services, setServices] = useState<PhotographyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSvc, setEditingSvc] = useState<PhotographyService | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [idealFor, setIdealFor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [active, setActive] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_BASE}/admin/services`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        const fallback = await getServices();
        setServices(fallback);
      }
    } catch (err) {
      console.error('Error fetching admin services:', err);
      const fallback = await getServices();
      setServices(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEditModal = (svc: PhotographyService) => {
    setEditingSvc(svc);
    setName(svc.name);
    setTagline(svc.tagline);
    setShortDesc(svc.shortDesc);
    setDescription(svc.description);
    setIdealFor(svc.idealFor || '');
    setCoverImage(svc.coverImage);
    setActive(svc.active);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSvc) return;

    try {
      const token = getAdminToken();
      const res = await fetch(`${API_BASE}/admin/services/${editingSvc.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          tagline,
          shortDesc,
          description,
          idealFor: idealFor || undefined,
          coverImage,
          active,
        }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui layanan');
      setEditingSvc(null);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan layanan');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Photography Disciplines
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Kategori Layanan Fotografi
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Tinjau dan perbarui deskripsi serta cover image untuk 7 kategori layanan utama.
          </p>
        </div>

        <button
          onClick={fetchServices}
          className="inline-flex items-center gap-2 border border-[#2B2B28] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#7A7875]">
            Memuat layanan fotografi...
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc.id}
              className={`bg-[#141414] border border-[#242422] overflow-hidden flex flex-col justify-between group hover:border-[#C5A880] transition-colors ${
                !svc.active ? 'opacity-60' : ''
              }`}
            >
              <div className="relative aspect-[16/10] w-full bg-[#1C1C1B]">
                <Image
                  src={svc.coverImage}
                  alt={svc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-white bg-black/60 px-2 py-0.5 border border-white/10">
                    /{svc.slug}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block">
                    {svc.tagline}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#FAF8F5] mt-0.5">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-[#999690] mt-1.5 line-clamp-2 leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#242422] flex items-center justify-between">
                  <span className="text-[10px] text-[#7A7875]">
                    Status: <span className={svc.active ? 'text-green-400' : 'text-amber-400'}>{svc.active ? 'Aktif' : 'Non-Aktif'}</span>
                  </span>
                  <button
                    onClick={() => openEditModal(svc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#242422] hover:bg-[#C5A880] hover:text-[#141414] text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Ubah</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingSvc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#141414] border border-[#2B2B28] max-w-xl w-full p-4 sm:p-8 shadow-2xl relative space-y-5 sm:space-y-6 text-[#FAF8F5] my-auto max-h-[96vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#242422]">
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Ubah Layanan: {editingSvc.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSvc(null)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#7A7875] hover:text-white"
                aria-label="Tutup edit layanan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Nama Layanan *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Tagline Ringkas *
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Deskripsi Singkat (Card) *
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Deskripsi Lengkap *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Ideal Untuk (Target Pengguna)
                </label>
                <input
                  type="text"
                  value={idealFor}
                  onChange={(e) => setIdealFor(e.target.value)}
                  placeholder="Wisudawan kampus, keluarga, dll."
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  URL Cover Image *
                </label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#C5A880] w-4 h-4"
                  />
                  <span className="text-xs">Tampilkan di Website (Aktif)</span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-[#242422]">
                <button
                  type="button"
                  onClick={() => setEditingSvc(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-[#2B2B28] text-xs uppercase tracking-wider hover:bg-white/5 min-h-[44px] flex items-center justify-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] font-semibold text-xs uppercase tracking-wider shadow-sm min-h-[44px] flex items-center justify-center"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
