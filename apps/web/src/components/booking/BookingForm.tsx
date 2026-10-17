'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Camera,
  Package,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  PhotographyService,
  PhotographyPackage,
  submitBooking,
  BookingResponse,
} from '@/lib/api';

interface BookingFormProps {
  packages: PhotographyPackage[];
}

export function BookingForm({ packages }: BookingFormProps) {
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get('package');

  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [shootDate, setShootDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Golden Hour (16:00 - 18:00)');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResponse | null>(null);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  // Pre-fill selections from query parameters or default to first items
  useEffect(() => {
    if (preselectedPackage) {
      const matchPkg = packages.find(
        (p) => p.slug === preselectedPackage || p.name.toLowerCase() === preselectedPackage.toLowerCase(),
      );
      if (matchPkg) {
        setPackageName(`${matchPkg.name} (Rp${matchPkg.price.toLocaleString('id-ID')})`);
        setServiceName(matchPkg.category || matchPkg.name);
      }
    } else if (packages.length > 0 && !packageName) {
      const popular = packages.find((p) => p.isPopular) || packages[0];
      setPackageName(`${popular.name} (Rp${popular.price.toLocaleString('id-ID')})`);
      setServiceName(popular.category || popular.name);
    }
  }, [preselectedPackage, packages]);

  // Find currently selected package object for price calculation
  const currentPkgObj = packages.find(
    (p) => packageName.includes(p.name) || packageName.includes(p.slug),
  );

  const timeOptions = [
    'Morning Session (08:30 - 11:30)',
    'Afternoon Session (13:00 - 15:30)',
    'Golden Hour Session (16:00 - 18:00)',
    'Night / Studio Evening (18:30 - 20:30)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!customerName.trim()) {
      setError('Mohon isi nama lengkap Anda.');
      return;
    }
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setError('Nomor WhatsApp harus valid (minimal 9 digit angka).');
      return;
    }
    if (!packageName) {
      setError('Mohon pilih paket yang diinginkan.');
      return;
    }
    if (!shootDate) {
      setError('Mohon tentukan tanggal sesi pemotretan.');
      return;
    }
    if (!location.trim()) {
      setError('Mohon masukkan preferensi lokasi pemotretan.');
      return;
    }

    const resolvedServiceName = serviceName || currentPkgObj?.category || 'Photography Session';

    setLoading(true);
    try {
      const response = await submitBooking({
        customerName: customerName.trim(),
        whatsappNumber: cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone,
        serviceName: resolvedServiceName,
        packageName,
        shootDate,
        preferredTime,
        location: location.trim(),
        notes: notes.trim() || undefined,
        estimatedPrice: currentPkgObj?.price,
      });

      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Terjadi kendala saat memproses booking. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Modal Sukses Booking */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#C5A880] max-w-xl w-full p-5 sm:p-8 md:p-10 shadow-2xl relative my-auto max-h-[96vh] overflow-y-auto">
            <div className="flex items-center gap-3 text-[#A88A62] mb-4">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-[#C5A880]" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                Permintaan Reservasi Tersimpan
              </h3>
            </div>

            <div className="bg-[#F4EFEA] border border-[#EAE3DB] p-3.5 sm:p-4 mb-5 sm:mb-6 space-y-2 text-xs font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-[#EAE3DB]">
                <span className="text-[#7A7875] uppercase tracking-wider text-[11px]">Kode Booking</span>
                <span className="font-mono font-bold text-[#141414] text-sm">
                  {result.booking.bookingCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A7875]">Nama Pemesan</span>
                <span className="font-medium text-[#141414]">{result.booking.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A7875]">Layanan & Paket</span>
                <span className="font-medium text-[#141414]">
                  {result.booking.serviceName} — {result.booking.packageName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A7875]">Tanggal & Waktu</span>
                <span className="font-medium text-[#141414]">
                  {result.booking.shootDate} ({result.booking.preferredTime})
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#EAE3DB]">
                <span className="text-[#7A7875]">Status Saat Ini</span>
                <span className="bg-[#DFCA9B]/30 text-[#876E49] px-2 py-0.5 rounded font-semibold text-[10px] tracking-wider uppercase border border-[#C5A880]/30">
                  PENDING (Menunggu Konfirmasi Admin)
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-5 sm:mb-6 text-xs text-amber-900 leading-relaxed font-sans">
              <p className="font-medium">Catatan Penting:</p>
              <p className="mt-0.5 text-amber-800">
                Data booking Anda telah tersimpan di sistem kami dengan status <strong>PENDING</strong>. Jadwal belum otomatis terkunci. Klik tombol di bawah ini untuk membuka WhatsApp dan menyelesaikan konsultasi serta konfirmasi jadwal dengan tim fotografer kami.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-6 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Buka WhatsApp Sekarang</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="w-full sm:w-auto min-h-[44px] border border-[#EAE3DB] text-[#5A5854] hover:text-[#141414] hover:border-[#141414] py-3 px-6 text-xs uppercase tracking-wider transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form + Live Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-8 md:p-10 border border-[#EAE3DB] shadow-sm">
          <div className="mb-6 sm:mb-8">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
              Reservasi Sesi Fotografi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141414] mt-1">
              Informasi Pemesanan
            </h2>
            <p className="text-xs text-[#7A7875] mt-2 font-sans leading-relaxed">
              Lengkapi formulir di bawah ini. Tim MOMEN.POTRAIT akan segera meninjau preferensi jadwal Anda dan mengonfirmasinya melalui WhatsApp.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Customer Name */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Nadia Salsabila"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-sm text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Contoh: 081234567890 atau 6281234567890"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-sm text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
              <span className="text-[11px] text-[#7A7875] mt-1 block">
                Kami akan menghubungi Anda di nomor ini untuk koordinasi konsep dan konfirmasi akhir.
              </span>
            </div>

            {/* Photography Package Selection */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                Pilihan Paket Fotografi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                <select
                  value={packageName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPackageName(val);
                    const matched = packages.find((p) => val.includes(p.name));
                    if (matched) {
                      setServiceName(matched.category || matched.name);
                    }
                  }}
                  className="w-full min-h-[44px] pl-10 pr-8 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-xs text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={`${p.name} (Rp${p.price.toLocaleString('id-ID')})`}>
                      {p.name} ({p.tier} Moments) — Rp{p.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                  <option value="Custom Event / Commercial Session">
                    Custom Event / Commercial Session (Inquiry Khusus)
                  </option>
                </select>
              </div>
            </div>

            {/* Shoot Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                  Tanggal Pemotretan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                  <input
                    type="date"
                    required
                    min={minDateString}
                    value={shootDate}
                    onChange={(e) => setShootDate(e.target.value)}
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-xs text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                  Preferensi Waktu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full min-h-[44px] pl-10 pr-8 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-xs text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                  >
                    {timeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shoot Location */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                Preferensi Lokasi Pemotretan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Hutan Kota GBK / Studio Indoor Tebet / Rumah Pribadi"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-sm text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors"
                />
              </div>
            </div>

            {/* Notes / Concept Request */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-semibold text-[#141414] mb-2">
                Catatan Khusus / Permintaan Konsep (Opsional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A88A62]" />
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Membawa 2 set baju bernuansa earth tone; sesi wisuda bersama kedua orang tua."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EAE3DB] text-sm text-[#141414] focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-3 bg-[#141414] text-[#FAF8F5] hover:bg-[#A88A62] py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md active:bg-[#876E49]"
              >
                {loading ? (
                  <span>Menyimpan Reservasi...</span>
                ) : (
                  <>
                    <span>Simpan & Lanjutkan ke WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#7A7875] text-center mt-3 font-sans">
                Dengan melanjutkan, data Anda akan diverifikasi langsung oleh tim fotografer kami.
              </p>
            </div>
          </form>
        </div>

        {/* Live Order Summary Sticky Card */}
        <div className="lg:col-span-5 bg-[#141414] text-[#FAF8F5] p-8 sm:p-10 border border-[#262624] lg:sticky lg:top-28 shadow-xl">
          <div className="flex items-center gap-2 text-[#C5A880] mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase">
              Ringkasan Pesanan
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold mb-6 text-[#FAF8F5]">
            Detail Sesi Anda
          </h3>

          <div className="space-y-4 text-xs font-sans pb-6 border-b border-[#262624]">
            {currentPkgObj?.category && (
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#8A8780]">Kategori Sesi</span>
                <span className="font-medium text-[#FAF8F5] text-right">
                  {currentPkgObj.category}
                </span>
              </div>
            )}

            <div className="flex justify-between items-start gap-4">
              <span className="text-[#8A8780]">Paket Terpilih</span>
              <span className="font-medium text-[#FAF8F5] text-right">
                {packageName || 'Belum dipilih'}
              </span>
            </div>

            {currentPkgObj && (
              <>
                <div className="flex justify-between items-start gap-4 text-[#8A8780]">
                  <span>Durasi Sesi</span>
                  <span className="text-[#FAF8F5]">{currentPkgObj.durationMinutes} Menit</span>
                </div>
                <div className="flex justify-between items-start gap-4 text-[#8A8780]">
                  <span>Jumlah Foto Edit</span>
                  <span className="text-[#FAF8F5]">{currentPkgObj.editedPhotoCount} Foto Retouch</span>
                </div>
                <div className="flex justify-between items-start gap-4 text-[#8A8780]">
                  <span>Area / Spot</span>
                  <span className="text-[#FAF8F5]">{currentPkgObj.locationCount}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-start gap-4">
              <span className="text-[#8A8780]">Tanggal Pemotretan</span>
              <span className="font-medium text-[#FAF8F5] text-right">
                {shootDate || 'Belum ditentukan'}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="text-[#8A8780]">Waktu Sesi</span>
              <span className="font-medium text-[#FAF8F5] text-right">
                {preferredTime}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="text-[#8A8780]">Lokasi</span>
              <span className="font-medium text-[#FAF8F5] text-right truncate max-w-[180px]">
                {location || 'Belum ditentukan'}
              </span>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="py-6 border-b border-[#262624] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">
                Estimasi Biaya Paket
              </span>
              <span className="text-[11px] text-[#C5A880]">
                {currentPkgObj?.priceNote || 'Transparan & Tanpa Biaya Tersembunyi'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-serif text-2xl font-bold text-[#FAF8F5]">
                {currentPkgObj
                  ? `Rp${currentPkgObj.price.toLocaleString('id-ID')}`
                  : 'Rp0'}
              </span>
            </div>
          </div>

          {/* Benefit Checklist of current package */}
          {currentPkgObj?.benefits && currentPkgObj.benefits.length > 0 && (
            <div className="pt-6">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold block mb-3">
                Benefit Termasuk:
              </span>
              <ul className="space-y-2 text-xs text-[#999690]">
                {currentPkgObj.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-[#262624] text-[11px] text-[#7A7875] leading-relaxed">
            * Seluruh harga dan slot jadwal akan dikonfirmasikan oleh tim kami setelah booking diverifikasi. DP pengunci jadwal dibayarkan hanya setelah konsultasi disetujui.
          </div>
        </div>
      </div>
    </div>
  );
}
