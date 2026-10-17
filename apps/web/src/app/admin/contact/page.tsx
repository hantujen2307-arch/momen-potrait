'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Save,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { getAdminSettings, updateAdminSettings } from '@/lib/admin-api';

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [whatsappNumber, setWhatsappNumber] = useState('6281234567890');
  const [email, setEmail] = useState('halo@momenpotrait.com');
  const [instagram, setInstagram] = useState('@momen.potrait');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminSettings();
      setWhatsappNumber(data.whatsappNumber || '6281234567890');
      setEmail(data.email || 'halo@momenpotrait.com');
      setInstagram(data.instagram || '@momen.potrait');
    } catch (err) {
      console.error('Error fetching contact settings:', err);
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
        whatsappNumber,
        email,
        instagram,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan kontak dan media sosial');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#7A7875]">
        Memuat kontak dan media sosial...
      </div>
    );
  }

  const cleanWa = whatsappNumber.replace(/\D/g, '');

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Channel Integrations
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Kontak & Media Sosial
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Konfigurasi nomor WhatsApp untuk penerimaan booking otomatis, email studio resmi, dan username Instagram.
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
          <span>Kontak dan media sosial berhasil diperbarui ke database.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Direct WhatsApp Test Card */}
      <div className="bg-[#181817] border border-[#2B2B28] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block">
            Uji Integrasi Direct Chat
          </span>
          <h3 className="text-sm font-semibold text-white mt-0.5">
            WhatsApp Nomor: +{whatsappNumber}
          </h3>
          <p className="text-xs text-[#7A7875] mt-0.5">
            Pelanggan yang menekan tombol WhatsApp di website akan diarahkan ke nomor ini.
          </p>
        </div>

        <a
          href={`https://wa.me/${cleanWa}?text=Halo%20MOMEN.POTRAIT%20Studio`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px]"
        >
          <span>Tes Buka WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-[#141414] border border-[#242422] p-5 sm:p-8 space-y-6 text-xs font-sans">
        <div>
          <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
            Nomor WhatsApp Tujuan Booking *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="6281234567890"
              className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
            />
          </div>
          <span className="text-[10px] text-[#7A7875] mt-1 block">
            Gunakan format angka internasional diawali 62 (contoh: 6281234567890 tanpa spasi atau strip).
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
              Email Resmi Studio *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="halo@momenpotrait.com"
                className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>
            <span className="text-[10px] text-[#7A7875] mt-1 block">
              Ditampilkan pada footer dan halaman kontak.
            </span>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
              Akun Instagram Studio *
            </label>
            <div className="relative">
              <InstagramIcon className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
              <input
                type="text"
                required
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@momen.potrait"
                className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>
            <span className="text-[10px] text-[#7A7875] mt-1 block">
              Contoh: @momen.potrait (dengan atau tanpa tanda @).
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#242422] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-3 px-8 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Kontak & Medsos'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
