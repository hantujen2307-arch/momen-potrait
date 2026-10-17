'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Package,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
  Phone,
  RefreshCw,
  FileEdit,
  Sparkles,
} from 'lucide-react';
import {
  getAdminMetrics,
  updateBookingStatus,
} from '@/lib/admin-api';
import { AdminMetrics, Booking } from '@/lib/api';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Reload metrics
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Pending
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Terkonfirmasi
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-green-500/15 text-green-300 border border-green-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Selesai
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="bg-red-500/15 text-red-300 border border-red-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Batal
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#7A7875]">
        Memuat data ringkasan metrik studio...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Studio Operations Overview
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Ringkasan Metrik
          </h1>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            loadData();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 border border-[#2B2B28] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-[#141414] border border-[#242422] p-6 space-y-2">
          <div className="flex items-center justify-between text-[#876E49]">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              Total Booking
            </span>
            <CalendarCheck2 className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#FAF8F5]">
            {metrics?.totalBookings || 0}
          </div>
          <span className="text-[11px] text-[#7A7875] block">
            Seluruh reservasi masuk
          </span>
        </div>

        {/* Pending Action */}
        <div className="bg-[#141414] border border-[#242422] p-6 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              Perlu Tindakan (Pending)
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-bold text-amber-300">
            {metrics?.pendingBookings || 0}
          </div>
          <span className="text-[11px] text-[#7A7875] block">
            Menunggu konfirmasi WhatsApp
          </span>
        </div>

        {/* Confirmed Sessions */}
        <div className="bg-[#141414] border border-[#242422] p-6 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              Terkonfirmasi (DP Masuk)
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#FAF8F5]">
            {metrics?.confirmedBookings || 0}
          </div>
          <span className="text-[11px] text-[#7A7875] block">
            Jadwal sesi pemotretan aktif
          </span>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-[#141414] border border-[#242422] p-6 space-y-2">
          <div className="flex items-center justify-between text-[#C5A880]">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              Estimasi Omset
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#FAF8F5]">
            Rp{(metrics?.totalRevenue || 0).toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-[#7A7875] block">
            Dari sesi terkonfirmasi & selesai
          </span>
        </div>
      </div>

      {/* Quick CMS Action Buttons */}
      <div className="bg-[#141414] border border-[#242422] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
              Pusat Aksi Cepat
            </span>
            <h2 className="font-serif text-lg font-bold text-[#FAF8F5]">
              Akses Cepat Kelola Konten & Media
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/packages"
            className="p-4 bg-[#181817] hover:bg-[#1E1E1C] border border-[#262624] hover:border-[#C5A880] transition-colors flex flex-col justify-between group min-h-[90px]"
          >
            <div className="flex items-center justify-between">
              <Package className="w-5 h-5 text-[#C5A880]" />
              <ArrowRight className="w-3.5 h-3.5 text-[#7A7875] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-2">
              <span className="text-xs font-semibold text-white block">Paket Fotografi</span>
              <span className="text-[10px] text-[#7A7875]">Tambah / Edit Paket</span>
            </div>
          </Link>

          <Link
            href="/admin/portfolio"
            className="p-4 bg-[#181817] hover:bg-[#1E1E1C] border border-[#262624] hover:border-[#C5A880] transition-colors flex flex-col justify-between group min-h-[90px]"
          >
            <div className="flex items-center justify-between">
              <ImageIcon className="w-5 h-5 text-[#C5A880]" />
              <ArrowRight className="w-3.5 h-3.5 text-[#7A7875] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-2">
              <span className="text-xs font-semibold text-white block">Galeri Portfolio</span>
              <span className="text-[10px] text-[#7A7875]">Upload & Kurasi Foto</span>
            </div>
          </Link>

          <Link
            href="/admin/homepage"
            className="p-4 bg-[#181817] hover:bg-[#1E1E1C] border border-[#262624] hover:border-[#C5A880] transition-colors flex flex-col justify-between group min-h-[90px]"
          >
            <div className="flex items-center justify-between">
              <FileEdit className="w-5 h-5 text-[#C5A880]" />
              <ArrowRight className="w-3.5 h-3.5 text-[#7A7875] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-2">
              <span className="text-xs font-semibold text-white block">Konten Homepage</span>
              <span className="text-[10px] text-[#7A7875]">Edit Hero, FAQ & CTA</span>
            </div>
          </Link>

          <Link
            href="/admin/brand"
            className="p-4 bg-[#181817] hover:bg-[#1E1E1C] border border-[#262624] hover:border-[#C5A880] transition-colors flex flex-col justify-between group min-h-[90px]"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-5 h-5 text-[#C5A880]" />
              <ArrowRight className="w-3.5 h-3.5 text-[#7A7875] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-2">
              <span className="text-xs font-semibold text-white block">Informasi Brand</span>
              <span className="text-[10px] text-[#7A7875]">Tagline & Kontak</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#141414] border border-[#242422] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A7875] block">
              Foto Portofolio Aktif
            </span>
            <span className="font-serif text-xl font-bold text-[#FAF8F5]">
              {metrics?.totalPortfolio || 0} Karya
            </span>
          </div>
          <ImageIcon className="w-5 h-5 text-[#876E49]" />
        </div>

        <div className="bg-[#141414] border border-[#242422] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A7875] block">
              Paket Ditawarkan
            </span>
            <span className="font-serif text-xl font-bold text-[#FAF8F5]">
              {metrics?.totalPackages || 0} Paket
            </span>
          </div>
          <Package className="w-5 h-5 text-[#876E49]" />
        </div>

        <div className="bg-[#141414] border border-[#242422] p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A7875] block">
              Koleksi Portofolio
            </span>
            <span className="font-serif text-xl font-bold text-[#FAF8F5]">
              {metrics?.totalPortfolio || 12} Foto
            </span>
          </div>
          <ImageIcon className="w-5 h-5 text-[#876E49]" />
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-[#141414] border border-[#242422] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#242422]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#FAF8F5]">
              5 Booking Terakhir
            </h2>
            <p className="text-xs text-[#7A7875]">
              Reservasi terbaru yang masuk melalui formulir publik website.
            </p>
          </div>

          <Link
            href="/admin/bookings"
            className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] hover:text-white inline-flex items-center gap-1.5"
          >
            <span>Kelola Semua Booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile View (<md) */}
        <div className="block md:hidden space-y-3">
          {metrics?.recentBookings && metrics.recentBookings.length > 0 ? (
            metrics.recentBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#181817] border border-[#242422] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#242422] pb-2.5">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#FAF8F5] block">
                      {b.bookingCode}
                    </span>
                    <span className="text-[11px] text-[#C5A880] font-medium">{b.customerName}</span>
                  </div>
                  <div>{getStatusBadge(b.status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A7875] block uppercase">Paket</span>
                    <span className="text-white block truncate">{b.packageName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A7875] block uppercase">Jadwal</span>
                    <span className="text-[#FAF8F5] block">
                      {new Date(b.shootDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      , {b.preferredTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#242422]">
                  {b.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(b.id, 'CONFIRMED')}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-wider font-semibold transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      Konfirmasi
                    </button>
                  )}
                  {b.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                      className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-500 text-white text-xs uppercase tracking-wider font-semibold transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      Selesai
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${b.whatsappNumber.replace(
                      /\D/g,
                      '',
                    )}?text=Halo%20${encodeURIComponent(
                      b.customerName,
                    )},%20kami%20dari%20tim%20MOMEN.POTRAIT%20ingin%20mengonfirmasi%20booking%20${
                      b.bookingCode
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[#7A7875]">
              Belum ada data booking terbaru.
            </div>
          )}
        </div>

        {/* Desktop Table (>=md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#242422] text-[#7A7875] text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Kode</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3">Layanan & Paket</th>
                <th className="py-3 px-3">Tgl Pemotretan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242422] text-[#B3B0A8]">
              {metrics?.recentBookings && metrics.recentBookings.length > 0 ? (
                metrics.recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono text-[#FAF8F5] font-medium">
                      {b.bookingCode}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-[#FAF8F5] block">{b.customerName}</span>
                      <a
                        href={`https://wa.me/${b.whatsappNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#C5A880] hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>+{b.whatsappNumber}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[#FAF8F5] block">{b.serviceName}</span>
                      <span className="text-[11px] text-[#7A7875]">{b.packageName}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[#FAF8F5]">
                        {new Date(b.shootDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] text-[#7A7875] block">{b.preferredTime}</span>
                    </td>
                    <td className="py-3.5 px-3">{getStatusBadge(b.status)}</td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      {b.status === 'PENDING' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'CONFIRMED')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors"
                        >
                          Konfirmasi
                        </button>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white text-[10px] uppercase tracking-wider font-semibold transition-colors"
                        >
                          Selesai
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${b.whatsappNumber.replace(
                          /\D/g,
                          '',
                        )}?text=Halo%20${encodeURIComponent(
                          b.customerName,
                        )},%20kami%20dari%20tim%20MOMEN.POTRAIT%20ingin%20mengonfirmasi%20booking%20${
                          b.bookingCode
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 inline-flex items-center text-[#25D366] hover:bg-white/5 transition-colors"
                        title="Chat Pelanggan di WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#7A7875]">
                    Belum ada data booking terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
