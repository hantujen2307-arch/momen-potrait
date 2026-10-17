'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Search,
  Filter,
  Phone,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  MapPin,
  Calendar,
  Package,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  getAdminBookings,
  updateBookingStatus,
  deleteBooking,
} from '@/lib/admin-api';
import { Booking } from '@/lib/api';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAdminBookings({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        limit: 50,
      });
      setBookings(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b)),
      );
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan booking ini?')) return;
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus booking');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Pending
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Terkonfirmasi
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-green-500/15 text-green-300 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Selesai
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="bg-red-500/15 text-red-300 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Batal
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Booking Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Daftar Reservasi Sesi
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Total {total} permintaan pemotretan tercatat di database.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 border border-[#2B2B28] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#C5A880] hover:text-[#C5A880] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-[#C5A880] text-[#141414]'
                  : 'bg-[#181817] text-[#999690] hover:text-white border border-[#262624]'
              }`}
            >
              {st === 'ALL' ? 'Semua' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7A7875]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode, nama, WhatsApp..."
              className="w-full bg-[#141414] border border-[#242422] pl-9 pr-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#242422] hover:bg-[#C5A880] hover:text-[#141414] text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Bookings Display: Mobile Cards (<md) + Desktop Table (>=md) */}
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="bg-[#141414] border border-[#242422] p-8 text-center text-xs text-[#7A7875]">
            Memuat daftar reservasi...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#141414] border border-[#242422] p-8 text-center text-xs text-[#7A7875]">
            Tidak ada reservasi yang sesuai dengan kriteria filter.
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#141414] border border-[#242422] p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#242422] pb-3">
                <div>
                  <span className="text-[10px] text-[#7A7875] uppercase tracking-wider block">Kode Reservasi</span>
                  <span className="font-mono font-bold text-sm text-[#FAF8F5]">{b.bookingCode}</span>
                </div>
                <div>{getStatusBadge(b.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#7A7875] uppercase tracking-wider block">Pelanggan</span>
                  <span className="font-medium text-[#FAF8F5] block truncate">{b.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A7875] uppercase tracking-wider block">Paket</span>
                  <span className="text-[#C5A880] font-medium block truncate">{b.packageName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A7875] uppercase tracking-wider block">Jadwal Sesi</span>
                  <span className="text-[#FAF8F5] block">
                    {new Date(b.shootDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[10px] text-[#7A7875]">{b.preferredTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A7875] uppercase tracking-wider block">Lokasi</span>
                  <span className="text-[#999690] block truncate">{b.location}</span>
                </div>
              </div>

              {/* Action Bar for Mobile */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#242422]">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  className="flex-1 py-2 px-3 border border-[#2B2B28] text-xs uppercase tracking-wider text-[#FAF8F5] hover:border-[#C5A880] transition-colors min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Detail</span>
                </button>
                <a
                  href={`https://wa.me/${b.whatsappNumber.replace(
                    /\D/g,
                    '',
                  )}?text=Halo%20${encodeURIComponent(
                    b.customerName,
                  )},%20kami%20dari%20MOMEN.POTRAIT%20ingin%20mengonfirmasi%20jadwal%20booking%20${
                    b.bookingCode
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-red-900/40 text-red-400 hover:bg-red-950/40 transition-colors"
                  aria-label="Hapus reservasi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bookings Desktop Table */}
      <div className="hidden md:block bg-[#141414] border border-[#242422] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#242422] text-[#7A7875] text-[10px] uppercase tracking-wider bg-[#181817]">
                <th className="py-3 px-4">Kode Booking</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Layanan & Paket</th>
                <th className="py-3 px-4">Tgl & Sesi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242422] text-[#B3B0A8]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7A7875]">
                    Memuat daftar reservasi...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7A7875]">
                    Tidak ada reservasi yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#FAF8F5]">
                      {b.bookingCode}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <span className="text-[#FAF8F5] block font-medium">{b.serviceName}</span>
                      <span className="text-[11px] text-[#7A7875]">{b.packageName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[#FAF8F5]">
                        {new Date(b.shootDate).toLocaleDateString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] text-[#7A7875] block">{b.preferredTime}</span>
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(b.status)}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 text-[#999690] hover:text-[#FAF8F5] hover:bg-white/5 transition-colors"
                        title="Lihat Detail Lengkap"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/${b.whatsappNumber.replace(
                          /\D/g,
                          '',
                        )}?text=Halo%20${encodeURIComponent(
                          b.customerName,
                        )},%20kami%20dari%20MOMEN.POTRAIT%20ingin%20mengonfirmasi%20jadwal%20booking%20${
                          b.bookingCode
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 inline-flex items-center text-[#25D366] hover:bg-white/5 transition-colors"
                        title="Chat Pelanggan di WhatsApp"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Hapus Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#141414] border border-[#2B2B28] max-w-xl w-full p-4 sm:p-8 shadow-2xl relative space-y-5 sm:space-y-6 text-[#FAF8F5] my-auto max-h-[96vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#242422]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                  Detail Permintaan Pemotretan
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                  {selectedBooking.bookingCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#7A7875] hover:text-white"
                aria-label="Tutup detail reservasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-sans">
              <div>
                <span className="text-[#7A7875] block">Nama Pelanggan</span>
                <span className="font-semibold text-sm text-[#FAF8F5]">
                  {selectedBooking.customerName}
                </span>
              </div>
              <div>
                <span className="text-[#7A7875] block">Nomor WhatsApp</span>
                <a
                  href={`https://wa.me/${selectedBooking.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#C5A880] hover:underline inline-flex items-center gap-1 min-h-[32px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+{selectedBooking.whatsappNumber}</span>
                </a>
              </div>
              <div>
                <span className="text-[#7A7875] block">Layanan</span>
                <span className="font-medium">{selectedBooking.serviceName}</span>
              </div>
              <div>
                <span className="text-[#7A7875] block">Paket</span>
                <span className="font-medium">{selectedBooking.packageName}</span>
              </div>
              <div>
                <span className="text-[#7A7875] block">Tanggal Pemotretan</span>
                <span className="font-medium">
                  {new Date(selectedBooking.shootDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-[#7A7875] block">Preferensi Waktu</span>
                <span className="font-medium">{selectedBooking.preferredTime}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#7A7875] block">Lokasi Pemotretan</span>
                <span className="font-medium">{selectedBooking.location}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#7A7875] block">Catatan / Konsep Khusus</span>
                <div className="p-3 bg-[#1C1C1B] border border-[#2B2B28] text-xs text-[#FAF8F5] mt-1 font-sans">
                  {selectedBooking.notes || 'Tidak ada catatan tambahan dari pemesan.'}
                </div>
              </div>
              <div>
                <span className="text-[#7A7875] block">Estimasi Biaya</span>
                <span className="font-serif text-lg font-bold text-[#C5A880]">
                  {selectedBooking.estimatedPrice
                    ? `Rp${selectedBooking.estimatedPrice.toLocaleString('id-ID')}`
                    : 'Sesuai Paket'}
                </span>
              </div>
              <div>
                <span className="text-[#7A7875] block">Status Saat Ini</span>
                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
              </div>
            </div>

            {/* Quick Status Changers */}
            <div className="pt-4 border-t border-[#242422] space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-[#7A7875] font-semibold block">
                Ubah Status Reservasi:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedBooking.id, 'CONFIRMED')}
                  className="py-2.5 px-3 bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase font-semibold tracking-wider hover:bg-blue-600 hover:text-white transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Konfirmasi (DP)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedBooking.id, 'COMPLETED')}
                  className="py-2.5 px-3 bg-green-600/20 text-green-300 border border-green-500/30 text-[10px] uppercase font-semibold tracking-wider hover:bg-green-600 hover:text-white transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Tandai Selesai
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedBooking.id, 'CANCELLED')}
                  className="py-2.5 px-3 bg-red-600/20 text-red-300 border border-red-500/30 text-[10px] uppercase font-semibold tracking-wider hover:bg-red-600 hover:text-white transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Batalkan
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2.5 border border-[#2B2B28] text-xs uppercase tracking-wider hover:bg-white/5 min-h-[44px] flex items-center justify-center"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/${selectedBooking.whatsappNumber.replace(
                  /\D/g,
                  '',
                )}?text=Halo%20${encodeURIComponent(
                  selectedBooking.customerName,
                )},%20kami%20dari%20MOMEN.POTRAIT%20ingin%20mengonfirmasi%20jadwal%20booking%20${
                  selectedBooking.bookingCode
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px]"
              >
                <span>Buka Chat WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
