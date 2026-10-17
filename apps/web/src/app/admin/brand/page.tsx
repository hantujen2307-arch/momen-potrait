'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Building2,
  FileText,
} from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '@/lib/admin-api';

export default function AdminBrandPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [studioName, setStudioName] = useState('MOMEN.POTRAIT');
  const [tagline, setTagline] = useState('Every Moment Tells a Story.');
  const [serviceArea, setServiceArea] = useState('');
  const [transportPolicy, setTransportPolicy] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [bookingNotice, setBookingNotice] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminSettings();
      setStudioName(data.studioName || 'MOMEN.POTRAIT');
      setTagline(data.tagline || 'Every Moment Tells a Story.');
      setServiceArea(data.serviceArea || '');
      setTransportPolicy(data.transportPolicy || '');
      setOperatingHours(data.operatingHours || '');
      setBookingNotice(data.bookingNotice || '');
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateAdminSettings({
        studioName,
        tagline,
        serviceArea,
        transportPolicy,
        operatingHours,
        bookingNotice,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan informasi brand');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#7A7875]">
        Memuat informasi brand...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Brand Identity Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Informasi Brand
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Kelola nama resmi studio, tagline utama, jangkauan area pemotretan, dan jam kerja operasional studio.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 border border-[#2B2B28] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-950/60 border-l-4 border-green-500 text-green-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span>Informasi brand berhasil diperbarui dan aktif di seluruh komponen publik.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand Identity Card Preview */}
      <div className="bg-[#181817] border border-[#2B2B28] p-6 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-[#C5A880]" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold block">
          Live Brand Preview
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#FAF8F5]">
          {studioName}
        </h2>
        <p className="font-serif italic text-sm text-[#C5A880]">
          &ldquo;{tagline}&rdquo;
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#999690]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
            {serviceArea || 'Area Layanan'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
            {operatingHours || 'Jam Operasional'}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-[#141414] border border-[#242422] p-5 sm:p-8 space-y-6 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
              Nama Brand Studio *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
              <input
                type="text"
                required
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
              Tagline Brand *
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Coverage Area */}
        <div>
          <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
            Cakupan Area Layanan Pemotretan *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
            <input
              type="text"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="Area Studio & Sesi Luar Kota Sesuai Kesepakatan"
              className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
            />
          </div>
          <span className="text-[10px] text-[#7A7875] mt-1 block">
            Ditampilkan di footer, halaman kontak, dan penjelasan cakupan sesi.
          </span>
        </div>

        {/* Transport Policy */}
        <div>
          <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
            Kebijakan Transportasi & Akomodasi
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
            <input
              type="text"
              value={transportPolicy}
              onChange={(e) => setTransportPolicy(e.target.value)}
              placeholder="Gratis transport area studio; biaya transport & akomodasi berlaku untuk pemotretan luar area."
              className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
            />
          </div>
          <span className="text-[10px] text-[#7A7875] mt-1 block">
            Memberi kepastian bagi klien terkait biaya tambahan untuk pemotretan luar area atau luar kota.
          </span>
        </div>

        {/* Operating Hours */}
        <div>
          <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
            Jam Operasional & Konsultasi Studio *
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
            <input
              type="text"
              required
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              placeholder="Senin - Minggu: 08:30 - 20:30 WIB"
              className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
            />
          </div>
        </div>

        {/* Booking Notice */}
        <div>
          <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
            Pemberitahuan Khusus / Panduan Booking Pelanggan
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={bookingNotice}
              onChange={(e) => setBookingNotice(e.target.value)}
              placeholder="Reservasi disarankan H-7 untuk memastikan ketersediaan tanggal dan slot fotografer utama."
              className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#242422] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-3 px-8 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Informasi Brand'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
