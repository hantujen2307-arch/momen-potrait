'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Lock,
  Unlock,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  getAdminCalendarMonth,
  getAdminCalendarDate,
  createAdminManualBooking,
  updateAdminManualBooking,
  createAdminScheduleBlock,
  deleteAdminScheduleBlock,
  AdminCalendarBooking,
  AdminScheduleBlock,
  AdminCalendarMonthResponse,
  AdminCalendarDateResponse,
  CreateManualBookingDto,
  CreateScheduleBlockDto,
  UpdateManualBookingDto,
  updateBookingStatus,
} from '@/lib/admin-api';
import { getPackages } from '@/lib/api';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function AdminCalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  // Month data
  const [monthData, setMonthData] = useState<AdminCalendarMonthResponse | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [monthError, setMonthError] = useState<string | null>(null);

  // Active selected date (YYYY-MM-DD)
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Date details
  const [dateData, setDateData] = useState<AdminCalendarDateResponse | null>(null);
  const [loadingDate, setLoadingDate] = useState(false);

  // Available packages for dropdown
  const [packages, setPackages] = useState<{ id: string; name: string; category?: string; price: number }[]>([]);

  // Modals state
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<AdminCalendarBooking | null>(null);

  // Form states
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Manual booking form fields
  const [manualForm, setManualForm] = useState<CreateManualBookingDto>({
    customerName: '',
    whatsappNumber: '',
    serviceName: 'Studio Portrait',
    packageName: 'Classic Studio',
    shootDate: todayStr,
    startTime: '10:30',
    endTime: '12:30',
    location: 'Studio MOMEN.POTRAIT',
    notes: '',
    internalNotes: '',
    estimatedPrice: 300000,
    status: 'CONFIRMED',
  });

  // Schedule Block form fields
  const [blockForm, setBlockForm] = useState<CreateScheduleBlockDto>({
    title: 'Studio Libur / Maintenance',
    blockDate: todayStr,
    isAllDay: true,
    startTime: '08:00',
    endTime: '20:00',
    reason: '',
  });

  // Edit booking form fields
  const [editForm, setEditForm] = useState<UpdateManualBookingDto>({});

  // Fetch month data
  const fetchMonth = async (year: number, month: number) => {
    setLoadingMonth(true);
    setMonthError(null);
    try {
      const data = await getAdminCalendarMonth(year, month);
      setMonthData(data);
    } catch (err: any) {
      setMonthError(err.message || 'Gagal memuat jadwal kalender.');
    } finally {
      setLoadingMonth(false);
    }
  };

  // Fetch date details
  const fetchDate = async (dateStr: string) => {
    setLoadingDate(true);
    try {
      const data = await getAdminCalendarDate(dateStr);
      setDateData(data);
    } catch (err) {
      console.error('Error fetching date agenda:', err);
    } finally {
      setLoadingDate(false);
    }
  };

  useEffect(() => {
    fetchMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    if (selectedDate) {
      fetchDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    getPackages().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length > 0 && !manualForm.packageName) {
        setManualForm((prev) => ({
          ...prev,
          packageName: pkgs[0].name,
          serviceName: pkgs[0].category || pkgs[0].name,
          estimatedPrice: pkgs[0].price,
        }));
      }
    });
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Group bookings and blocks by date (YYYY-MM-DD)
  const bookingsByDate = new Map<string, AdminCalendarBooking[]>();
  monthData?.bookings.forEach((b) => {
    const dStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date(b.shootDate));
    const list = bookingsByDate.get(dStr) || [];
    list.push(b);
    bookingsByDate.set(dStr, list);
  });

  const blocksByDate = new Map<string, AdminScheduleBlock[]>();
  monthData?.blocks.forEach((b) => {
    const dStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date(b.blockDate));
    const list = blocksByDate.get(dStr) || [];
    list.push(b);
    blocksByDate.set(dStr, list);
  });

  // Handle Quick Status Change
  const handleQuickStatusChange = async (bookingId: string, newStatus: any) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await fetchMonth(currentYear, currentMonth);
      if (selectedDate) await fetchDate(selectedDate);
    } catch (err: any) {
      alert(`Gagal mengubah status: ${err.message}`);
    }
  };

  // Handle Create Manual Booking
  const handleCreateManualBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await createAdminManualBooking(manualForm);
      setShowManualBookingModal(false);
      await fetchMonth(currentYear, currentMonth);
      if (selectedDate) await fetchDate(selectedDate);
    } catch (err: any) {
      setFormError(err.message || 'Gagal membuat booking manual.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Create Schedule Block
  const handleCreateBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await createAdminScheduleBlock(blockForm);
      setShowBlockModal(false);
      await fetchMonth(currentYear, currentMonth);
      if (selectedDate) await fetchDate(selectedDate);
    } catch (err: any) {
      setFormError(err.message || 'Gagal memblokir jadwal.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete Schedule Block
  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Hapus blokir jadwal ini? Slot akan kembali terbuka bagi pelanggan.')) return;
    try {
      await deleteAdminScheduleBlock(id);
      await fetchMonth(currentYear, currentMonth);
      if (selectedDate) await fetchDate(selectedDate);
    } catch (err: any) {
      alert(`Gagal menghapus blokir: ${err.message}`);
    }
  };

  // Handle Open Edit Booking
  const handleOpenEdit = (b: AdminCalendarBooking) => {
    setEditingBooking(b);
    setEditForm({
      customerName: b.customerName,
      whatsappNumber: b.whatsappNumber,
      serviceName: b.serviceName,
      packageName: b.packageName,
      shootDate: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date(b.shootDate)),
      startTime: b.startTime || '08:30',
      endTime: b.endTime || '10:30',
      location: b.location,
      notes: b.notes || '',
      internalNotes: b.internalNotes || '',
      estimatedPrice: b.estimatedPrice || undefined,
      status: b.status,
    });
  };

  // Handle Save Edit Booking
  const handleSaveEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setFormLoading(true);
    setFormError(null);
    try {
      await updateAdminManualBooking(editingBooking.id, editForm);
      setEditingBooking(null);
      await fetchMonth(currentYear, currentMonth);
      if (selectedDate) await fetchDate(selectedDate);
    } catch (err: any) {
      setFormError(err.message || 'Gagal memperbarui booking.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#242422]">
        <div>
          <div className="flex items-center gap-2 text-[#C5A880] text-xs font-semibold uppercase tracking-[0.2em]">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Manajemen Jadwal Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5] mt-1">
            Kalender Booking & Slot Studio
          </h1>
          <p className="text-xs text-[#8A8780] mt-1">
            Pantau reservasi, input booking manual langsung, dan kelola blokir hari libur atau maintenance studio.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setManualForm((prev) => ({ ...prev, shootDate: selectedDate || todayStr }));
              setFormError(null);
              setShowManualBookingModal(true);
            }}
            className="min-h-[40px] px-3.5 py-2 bg-[#C5A880] hover:bg-[#b0936b] text-[#141414] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Booking Manual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setBlockForm((prev) => ({ ...prev, blockDate: selectedDate || todayStr }));
              setFormError(null);
              setShowBlockModal(true);
            }}
            className="min-h-[40px] px-3.5 py-2 bg-[#1A1A18] hover:bg-[#252522] border border-[#383835] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Blokir Jadwal</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Daily Schedule Agenda on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#242422] p-5 sm:p-6 rounded-sm shadow-sm">
          {/* Navigation Month */}
          <div className="flex items-center justify-between pb-4 border-b border-[#242422]">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF8F5]">
                {MONTH_NAMES[currentMonth - 1]} {currentYear}
              </h2>
              {loadingMonth && <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center border border-[#2E2E2C] hover:border-[#FAF8F5] text-[#FAF8F5] transition-colors"
                title="Bulan Lalu"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setCurrentYear(now.getFullYear());
                  setCurrentMonth(now.getMonth() + 1);
                  setSelectedDate(todayStr);
                }}
                className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border border-[#2E2E2C] hover:border-[#FAF8F5] text-[#FAF8F5] transition-colors"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center border border-[#2E2E2C] hover:border-[#FAF8F5] text-[#FAF8F5] transition-colors"
                title="Bulan Depan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-3 py-3 border-b border-[#242422] text-[10px] text-[#A09E9B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Blokir Studio</span>
            </div>
          </div>

          {/* Calendar Matrix */}
          <div className="pt-3">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold tracking-wider text-[#7A7875] pb-2 uppercase">
              {DAY_NAMES.map((name, i) => (
                <div key={i} className={i === 0 ? 'text-rose-400' : ''}>
                  {name}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[58px] sm:min-h-[70px] bg-[#111110]/40 border border-transparent rounded-xs" />
              ))}

              {/* Days of Month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === todayStr;

                const dayBookings = bookingsByDate.get(dateStr) || [];
                const dayBlocks = blocksByDate.get(dateStr) || [];

                const confirmedCount = dayBookings.filter((b) => b.status === 'CONFIRMED').length;
                const pendingCount = dayBookings.filter((b) => b.status === 'PENDING').length;
                const completedCount = dayBookings.filter((b) => b.status === 'COMPLETED').length;
                const isDayBlocked = dayBlocks.some((b) => b.isAllDay);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`min-h-[58px] sm:min-h-[70px] p-1.5 border text-left flex flex-col justify-between transition-all rounded-xs relative group cursor-pointer ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#1F1E1B] ring-2 ring-[#C5A880]/50 z-10'
                        : isDayBlocked
                        ? 'border-rose-900/60 bg-rose-950/20 hover:border-rose-700'
                        : 'border-[#242422] bg-[#181817] hover:border-[#383835] hover:bg-[#1E1E1C]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs font-semibold ${
                          isSelected
                            ? 'text-[#C5A880] font-bold'
                            : isToday
                            ? 'text-amber-400 font-bold'
                            : 'text-[#FAF8F5]'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[8px] uppercase tracking-tighter text-amber-400 font-bold hidden sm:inline">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Status Dots and Badges */}
                    <div className="space-y-0.5 mt-1">
                      {isDayBlocked && (
                        <span className="flex items-center gap-0.5 text-[8px] font-semibold text-rose-300 bg-rose-900/40 px-1 py-0.2 rounded w-fit">
                          <Lock className="w-2 h-2" />
                          <span className="hidden sm:inline">Blokir</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1 flex-wrap">
                        {confirmedCount > 0 && (
                          <span
                            className="w-2 h-2 rounded-full bg-emerald-500"
                            title={`${confirmedCount} Confirmed`}
                          />
                        )}
                        {pendingCount > 0 && (
                          <span
                            className="w-2 h-2 rounded-full bg-amber-400"
                            title={`${pendingCount} Pending`}
                          />
                        )}
                        {completedCount > 0 && (
                          <span
                            className="w-2 h-2 rounded-full bg-blue-400"
                            title={`${completedCount} Completed`}
                          />
                        )}
                        {dayBlocks.length > 0 && !isDayBlocked && (
                          <span
                            className="w-2 h-2 rounded-full bg-rose-500"
                            title={`${dayBlocks.length} Jam Diblokir`}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Schedule Agenda (5 cols) */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#242422] p-5 sm:p-6 rounded-sm shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                Agenda Harian
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF8F5]">
                {new Date(selectedDate + 'T00:00:00Z').toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </h3>
            </div>
            {loadingDate && <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />}
          </div>

          {/* Active Full Day Blocks */}
          {dateData?.dayBlocks && dateData.dayBlocks.length > 0 && (
            <div className="mt-4 space-y-2">
              {dateData.dayBlocks.map((blk) => (
                <div
                  key={blk.id}
                  className="p-3 bg-rose-950/30 border border-rose-900/60 rounded flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{blk.title}</span>
                      {blk.isAllDay ? (
                        <span className="text-[9px] bg-rose-900/60 px-1 py-0.2 rounded uppercase">
                          Seharian Penuh
                        </span>
                      ) : (
                        <span className="text-[9px] bg-rose-900/60 px-1 py-0.2 rounded font-mono">
                          {blk.startTime} - {blk.endTime}
                        </span>
                      )}
                    </div>
                    {blk.reason && <p className="text-[#A09E9B] text-[11px] mt-1">{blk.reason}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(blk.id)}
                    className="text-rose-400 hover:text-rose-200 text-xs p-1"
                    title="Buka Blokir"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Slots & Bookings Agenda */}
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A09E9B]">
              Slot Waktu & Status Sesi
            </h4>

            {dateData?.slots && Array.isArray(dateData.slots) ? (
              dateData.slots.map((slot) => {
              const b = slot.booking;
              const blk = slot.block;

              return (
                <div
                  key={slot.id}
                  className={`p-3.5 border rounded transition-colors ${
                    b?.status === 'CONFIRMED'
                      ? 'border-emerald-800/60 bg-emerald-950/20'
                      : b?.status === 'PENDING'
                      ? 'border-amber-800/60 bg-amber-950/20'
                      : b?.status === 'COMPLETED'
                      ? 'border-blue-800/60 bg-blue-950/20'
                      : slot.status === 'BLOCKED'
                      ? 'border-rose-900/60 bg-rose-950/20'
                      : 'border-[#242422] bg-[#181817]'
                  }`}
                >
                  {/* Slot Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#FAF8F5]">
                      {slot.startTime} - {slot.endTime} WIB
                    </span>

                    {/* Status Badge */}
                    {b?.status === 'CONFIRMED' && (
                      <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-900/40 px-1.5 py-0.5 rounded uppercase">
                        CONFIRMED
                      </span>
                    )}
                    {b?.status === 'PENDING' && (
                      <span className="text-[9px] font-semibold text-amber-300 bg-amber-900/40 px-1.5 py-0.5 rounded uppercase">
                        PENDING
                      </span>
                    )}
                    {b?.status === 'COMPLETED' && (
                      <span className="text-[9px] font-semibold text-blue-300 bg-blue-900/40 px-1.5 py-0.5 rounded uppercase">
                        COMPLETED
                      </span>
                    )}
                    {b?.status === 'CANCELLED' && (
                      <span className="text-[9px] font-semibold text-[#8A8780] bg-[#2E2E2C] px-1.5 py-0.5 rounded uppercase">
                        CANCELLED
                      </span>
                    )}
                    {slot.status === 'BLOCKED' && !b && (
                      <span className="text-[9px] font-semibold text-rose-300 bg-rose-900/40 px-1.5 py-0.5 rounded uppercase">
                        BLOCKED
                      </span>
                    )}
                    {slot.status === 'AVAILABLE' && (
                      <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded uppercase border border-emerald-800/40">
                        SLOT KOSONG
                      </span>
                    )}
                  </div>

                  {/* Booking Details if Slot Booked */}
                  {b ? (
                    <div className="mt-2.5 pt-2.5 border-t border-[#2E2E2C] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#FAF8F5]">{b.customerName}</span>
                        <a
                          href={`https://wa.me/${b.whatsappNumber.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{b.whatsappNumber}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <div className="text-[11px] text-[#A09E9B]">
                        {b.serviceName} • {b.packageName}
                      </div>

                      <div className="text-[11px] text-[#8A8780] flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{b.location}</span>
                      </div>

                      {b.internalNotes && (
                        <div className="p-2 bg-[#1A1A18] border border-[#2E2E2C] text-[10px] text-amber-200/90 rounded">
                          <span className="font-semibold block text-[#C5A880]">Catatan Internal:</span>
                          {b.internalNotes}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        {/* Quick Status Select */}
                        <select
                          value={b.status}
                          onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                          className="bg-[#111110] border border-[#2E2E2C] text-[11px] text-[#FAF8F5] px-2 py-1 rounded focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="PENDING">Set PENDING</option>
                          <option value="CONFIRMED">Set CONFIRMED</option>
                          <option value="COMPLETED">Set COMPLETED</option>
                          <option value="CANCELLED">Set CANCELLED</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="text-[11px] text-[#C5A880] hover:text-[#e0c49c] flex items-center gap-1 px-2 py-1 bg-[#1E1E1C] border border-[#2E2E2C] rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Detail</span>
                        </button>
                      </div>
                    </div>
                  ) : blk ? (
                    <div className="mt-2 text-[11px] text-rose-300">
                      Diblokir: {blk.title} {blk.reason ? `(${blk.reason})` : ''}
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#7A7875]">
                      <span>Slot siap dipesan oleh pelanggan atau diisi manual.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setManualForm((prev) => ({
                            ...prev,
                            shootDate: selectedDate,
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                          }));
                          setShowManualBookingModal(true);
                        }}
                        className="text-[#C5A880] hover:text-white font-medium"
                      >
                        + Isi Slot
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-[#7A7875]">Memuat slot jadwal...</div>
          )}

            {/* Custom Bookings outside preset slots */}
            {dateData?.customBookings && dateData.customBookings.length > 0 && (
              <div className="pt-4 border-t border-[#242422] space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A09E9B]">
                  Jadwal di Luar Slot Preset ({dateData.customBookings.length})
                </span>
                {dateData.customBookings.map((cb) => (
                  <div key={cb.id} className="p-3 bg-[#181817] border border-[#242422] rounded text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#FAF8F5]">
                        {cb.startTime || '08:30'} - {cb.endTime || '20:30'}
                      </span>
                      <span className="text-[9px] uppercase font-semibold text-[#C5A880] bg-[#1E1E1C] px-1.5 py-0.5 rounded">
                        {cb.status}
                      </span>
                    </div>
                    <div className="font-semibold text-[#FAF8F5] mt-1">{cb.customerName}</div>
                    <div className="text-[#A09E9B] text-[11px]">{cb.packageName}</div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cb)}
                        className="text-[11px] text-[#C5A880] hover:underline"
                      >
                        Edit Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: TAMBAH BOOKING MANUAL */}
      {/* ======================================================== */}
      {showManualBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#242422] max-w-xl w-full p-6 shadow-2xl relative my-auto max-h-[96vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
              <div className="flex items-center gap-2 text-[#C5A880]">
                <Plus className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">
                  Tambah Booking Manual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManualBookingModal(false)}
                className="text-[#8A8780] hover:text-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateManualBookingSubmit} className="mt-4 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Nama Pelanggan *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.customerName}
                    onChange={(e) => setManualForm({ ...manualForm, customerName: e.target.value })}
                    placeholder="Contoh: Rian Anggara"
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualForm.whatsappNumber}
                    onChange={(e) => setManualForm({ ...manualForm, whatsappNumber: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Paket Fotografi *
                  </label>
                  <select
                    value={manualForm.packageName}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = packages.find((p) => p.name === val);
                      setManualForm({
                        ...manualForm,
                        packageName: val,
                        serviceName: matched?.category || matched?.name || manualForm.serviceName,
                        estimatedPrice: matched?.price || manualForm.estimatedPrice,
                      });
                    }}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} (Rp{p.price.toLocaleString('id-ID')})
                      </option>
                    ))}
                    <option value="Custom Special Session">Custom Special Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Jenis Layanan
                  </label>
                  <input
                    type="text"
                    value={manualForm.serviceName}
                    onChange={(e) => setManualForm({ ...manualForm, serviceName: e.target.value })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Date & Time Range */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Tanggal Sesi *
                  </label>
                  <input
                    type="date"
                    required
                    value={manualForm.shootDate}
                    onChange={(e) => setManualForm({ ...manualForm, shootDate: e.target.value })}
                    className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Jam Mulai (HH:mm) *
                  </label>
                  <input
                    type="time"
                    required
                    value={manualForm.startTime}
                    onChange={(e) => setManualForm({ ...manualForm, startTime: e.target.value })}
                    className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Jam Selesai (HH:mm) *
                  </label>
                  <input
                    type="time"
                    required
                    value={manualForm.endTime}
                    onChange={(e) => setManualForm({ ...manualForm, endTime: e.target.value })}
                    className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Status Awal *
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="CONFIRMED">CONFIRMED (Langsung Kunci Slot)</option>
                    <option value="PENDING">PENDING (Menunggu DP/Review)</option>
                    <option value="COMPLETED">COMPLETED (Riwayat Sesi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Harga / Nilai Booking (Rp)
                  </label>
                  <input
                    type="number"
                    value={manualForm.estimatedPrice || ''}
                    onChange={(e) => setManualForm({ ...manualForm, estimatedPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Lokasi Pemotretan *
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.location}
                  onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                  placeholder="Studio Tebet / Outdoor GBK"
                  className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Catatan Pelanggan
                </label>
                <textarea
                  rows={2}
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  placeholder="Catatan dari pelanggan..."
                  className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div>
                <label className="block text-amber-300 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Catatan Internal Studio (Rahasia Admin)
                </label>
                <textarea
                  rows={2}
                  value={manualForm.internalNotes}
                  onChange={(e) => setManualForm({ ...manualForm, internalNotes: e.target.value })}
                  placeholder="Catatan DP, fotografer yang ditugaskan, moodboard internal..."
                  className="w-full p-2.5 bg-[#1C1C1A] border border-amber-900/60 text-amber-100 focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#242422]">
                <button
                  type="button"
                  onClick={() => setShowManualBookingModal(false)}
                  className="px-4 py-2 border border-[#2E2E2C] text-[#FAF8F5] hover:bg-[#1E1E1C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-[#C5A880] hover:bg-[#b0936b] text-[#141414] font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {formLoading ? 'Menyimpan...' : 'Simpan Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BLOKIR TANGGAL / JAM */}
      {/* ======================================================== */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#242422] max-w-lg w-full p-6 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
              <div className="flex items-center gap-2 text-rose-400">
                <Lock className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">
                  Blokir Tanggal / Slot Jam
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="text-[#8A8780] hover:text-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateBlockSubmit} className="mt-4 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Judul Blokir / Alasan Utama *
                </label>
                <input
                  type="text"
                  required
                  value={blockForm.title}
                  onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                  placeholder="Contoh: Libur Hari Raya / Maintenance Studio / Private Event"
                  className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Tanggal yang Diblokir *
                </label>
                <input
                  type="date"
                  required
                  value={blockForm.blockDate}
                  onChange={(e) => setBlockForm({ ...blockForm, blockDate: e.target.value })}
                  className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="p-3 bg-[#1C1C1A] border border-[#2E2E2C] rounded">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockForm.isAllDay}
                    onChange={(e) => setBlockForm({ ...blockForm, isAllDay: e.target.checked })}
                    className="w-4 h-4 accent-[#C5A880]"
                  />
                  <span className="font-semibold text-[#FAF8F5]">
                    Blokir Seharian Penuh (Studio Tutup Total)
                  </span>
                </label>
              </div>

              {!blockForm.isAllDay && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                  <div>
                    <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Jam Mulai (HH:mm) *
                    </label>
                    <input
                      type="time"
                      required
                      value={blockForm.startTime}
                      onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                      className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                      Jam Selesai (HH:mm) *
                    </label>
                    <input
                      type="time"
                      required
                      value={blockForm.endTime}
                      onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                      className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Alasan Internal / Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="Keterangan internal untuk tim studio..."
                  className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#242422]">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 border border-[#2E2E2C] text-[#FAF8F5] hover:bg-[#1E1E1C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {formLoading ? 'Memblokir...' : 'Kunci Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT BOOKING DETAIL */}
      {/* ======================================================== */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#242422] max-w-xl w-full p-6 shadow-2xl relative my-auto max-h-[96vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
              <div>
                <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block font-semibold">
                  {editingBooking.bookingCode}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#FAF8F5]">
                  Edit Jadwal & Detail Booking
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="text-[#8A8780] hover:text-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditBooking} className="mt-4 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Nama Pelanggan
                  </label>
                  <input
                    type="text"
                    value={editForm.customerName || ''}
                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={editForm.whatsappNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Tanggal Sesi
                  </label>
                  <input
                    type="date"
                    value={editForm.shootDate || ''}
                    onChange={(e) => setEditForm({ ...editForm, shootDate: e.target.value })}
                    className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={editForm.startTime || ''}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                    className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={editForm.endTime || ''}
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                    className="w-full p-2 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Status Booking *
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED (Slot Bebas Kembali)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Estimasi Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    value={editForm.estimatedPrice || ''}
                    onChange={(e) => setEditForm({ ...editForm, estimatedPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A09E9B] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full p-2.5 bg-[#1C1C1A] border border-[#2E2E2C] text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-amber-300 uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Catatan Internal Studio (Rahasia Admin)
                </label>
                <textarea
                  rows={2}
                  value={editForm.internalNotes || ''}
                  onChange={(e) => setEditForm({ ...editForm, internalNotes: e.target.value })}
                  placeholder="Catatan DP, fotografer bertugas, kesepakatan khusus..."
                  className="w-full p-2.5 bg-[#1C1C1A] border border-amber-900/60 text-amber-100 focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#242422]">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 border border-[#2E2E2C] text-[#FAF8F5] hover:bg-[#1E1E1C]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-[#C5A880] hover:bg-[#b0936b] text-[#141414] font-semibold uppercase tracking-wider disabled:opacity-50"
                >
                  {formLoading ? 'Menyimpan...' : 'Perbarui Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
