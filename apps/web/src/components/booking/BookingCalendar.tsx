'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  getPublicCalendarMonth,
  getPublicCalendarDate,
  PublicCalendarDaySummary,
  PublicCalendarSlot,
  PublicCalendarDateDetails,
} from '@/lib/api';

interface BookingCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  selectedTimeSlot?: string;
  onSelectSlot: (date: string, slot: PublicCalendarSlot) => void;
}

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

export function BookingCalendar({
  selectedDate,
  selectedTimeSlot,
  onSelectSlot,
}: BookingCalendarProps) {
  // Current view year & month
  const today = new Date();
  const validDate = selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);
  const initialYear = validDate ? parseInt(selectedDate.split('-')[0], 10) : today.getFullYear();
  const initialMonth = validDate ? parseInt(selectedDate.split('-')[1], 10) : today.getMonth() + 1;

  const [currentYear, setCurrentYear] = useState(!isNaN(initialYear) ? initialYear : 2026);
  const [currentMonth, setCurrentMonth] = useState(!isNaN(initialMonth) ? initialMonth : 10);

  // Month data
  const [monthData, setMonthData] = useState<PublicCalendarDaySummary[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [monthError, setMonthError] = useState<string | null>(null);

  // Selected date slots
  const [activeDate, setActiveDate] = useState<string>(validDate ? selectedDate : '');
  const [dateDetails, setDateDetails] = useState<PublicCalendarDateDetails | null>(null);
  const [loadingDate, setLoadingDate] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Load month summary from API
  const fetchMonth = async (year: number, month: number) => {
    setLoadingMonth(true);
    setMonthError(null);
    try {
      const data = await getPublicCalendarMonth(year, month);
      setMonthData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('BookingCalendar: Error loading month:', err);
      setMonthError(err?.message || 'Gagal memuat ketersediaan kalender. Periksa koneksi internet Anda.');
    } finally {
      setLoadingMonth(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      setLoadingMonth(true);
      setMonthError(null);
      try {
        const data = await getPublicCalendarMonth(currentYear, currentMonth);
        if (!isCancelled) {
          setMonthData(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('BookingCalendar: fetchMonth failed:', err);
          setMonthError(err?.message || 'Gagal memuat kalender. Pastikan server backend sedang berjalan.');
        }
      } finally {
        if (!isCancelled) {
          setLoadingMonth(false);
        }
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [currentYear, currentMonth]);

  // Load date slots when activeDate changes
  useEffect(() => {
    let isCancelled = false;

    if (!activeDate) {
      setDateDetails(null);
      return;
    }

    const runSlots = async () => {
      setLoadingDate(true);
      setDateError(null);
      try {
        const data = await getPublicCalendarDate(activeDate);
        if (!isCancelled) {
          setDateDetails(data);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('BookingCalendar: fetchDateSlots failed:', err);
          setDateError(err?.message || 'Gagal memuat ketersediaan jam.');
        }
      } finally {
        if (!isCancelled) {
          setLoadingDate(false);
        }
      }
    };

    runSlots();

    return () => {
      isCancelled = true;
    };
  }, [activeDate]);

  // Sync when prop selectedDate changes from parent form
  useEffect(() => {
    if (selectedDate && selectedDate !== activeDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      setActiveDate(selectedDate);
      const [y, m] = selectedDate.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        if (y !== currentYear || m !== currentMonth) {
          setCurrentYear(y);
          setCurrentMonth(m);
        }
      }
    }
  }, [selectedDate]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Build calendar matrix (Sunday to Saturday)
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Map monthData by date string for fast lookup
  const daySummaryMap = new Map<string, PublicCalendarDaySummary>();
  if (Array.isArray(monthData)) {
    monthData.forEach((d) => {
      if (d && d.date) {
        daySummaryMap.set(d.date, d);
      }
    });
  }

  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

  const handleDateClick = (dateStr: string, summary?: PublicCalendarDaySummary) => {
    if (summary?.isBlocked || (summary && summary.availableSlotsCount === 0)) {
      return; // Disabled
    }
    setActiveDate(dateStr);
  };

  return (
    <div className="bg-white border border-[#EAE3DB] p-5 sm:p-7 shadow-sm">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#EAE3DB]">
        <div>
          <div className="flex items-center gap-2 text-[#C5A880] text-xs font-semibold uppercase tracking-[0.2em]">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Ketersediaan Jadwal Studio</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141414] mt-1">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </h3>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-9 h-9 flex items-center justify-center border border-[#EAE3DB] hover:border-[#141414] hover:bg-[#FAF8F5] text-[#141414] transition-colors"
            title="Bulan Sebelumnya"
            aria-label="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setCurrentYear(now.getFullYear());
              setCurrentMonth(now.getMonth() + 1);
            }}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border border-[#EAE3DB] hover:border-[#141414] text-[#141414] transition-colors"
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-9 h-9 flex items-center justify-center border border-[#EAE3DB] hover:border-[#141414] hover:bg-[#FAF8F5] text-[#141414] transition-colors"
            title="Bulan Berikutnya"
            aria-label="Bulan Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-[#EAE3DB] text-[11px] font-sans text-[#7A7875]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
          <span>Terkonfirmasi</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
          <span>Pending (Dalam Review)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
          <span>Penuh / Blokir Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-[#C5A880] bg-[#FAF8F5] shrink-0"></span>
          <span>Slot Tersedia</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="pt-4">
        {loadingMonth ? (
          <div className="py-16 flex flex-col items-center justify-center text-xs text-[#7A7875] gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-[#C5A880]" />
            <span>Memperbarui ketersediaan kalender...</span>
          </div>
        ) : monthError ? (
          <div className="py-8 px-4 text-center text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded">
            <div className="flex items-center justify-center gap-2 mb-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Gagal Memuat Ketersediaan Kalender</span>
            </div>
            <p className="text-rose-700 font-sans max-w-md mx-auto">{monthError}</p>
            <button
              type="button"
              onClick={() => fetchMonth(currentYear, currentMonth)}
              className="mt-3 px-4 py-2 bg-[#141414] hover:bg-[#C5A880] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Day Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wider text-[#7A7875] pb-2 uppercase">
              {DAY_NAMES.map((name, i) => (
                <div key={i} className={i === 0 ? 'text-rose-600' : ''}>
                  {name}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[52px] sm:min-h-[64px] bg-[#FAF8F5]/40 rounded-sm" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const summary = daySummaryMap.get(dateStr);

                const isPast = dateStr < todayStr;
                const isSelected = activeDate === dateStr;
                const isToday = dateStr === todayStr;

                const isBlocked = summary?.isBlocked || false;
                const hasConfirmed = summary?.hasConfirmed || false;
                const hasPending = summary?.hasPending || false;
                const isFullyBooked = summary ? summary.availableSlotsCount === 0 : false;
                const isDisabled = isPast || isBlocked || isFullyBooked;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDateClick(dateStr, summary)}
                    className={`min-h-[52px] sm:min-h-[64px] p-1.5 sm:p-2 border transition-all duration-200 text-left flex flex-col justify-between rounded-sm relative group cursor-pointer ${
                      isSelected
                        ? 'border-[#141414] bg-[#F4EFEA] ring-2 ring-[#C5A880]/60 z-10'
                        : isBlocked || isFullyBooked
                        ? 'bg-rose-50/50 border-rose-200 text-[#A0A0A0] cursor-not-allowed'
                        : isPast
                        ? 'bg-[#FAF8F5]/60 border-[#F0EBE5] text-[#C0BEBA] cursor-not-allowed'
                        : 'border-[#EAE3DB] bg-white hover:border-[#C5A880] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs sm:text-sm font-semibold ${
                          isSelected
                            ? 'text-[#141414] font-bold'
                            : isDisabled
                            ? 'text-[#A0A0A0]'
                            : isToday
                            ? 'text-[#C5A880] font-bold'
                            : 'text-[#141414]'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[9px] uppercase tracking-tighter font-bold text-[#C5A880] hidden sm:inline">
                          Hari Ini
                        </span>
                      )}
                    </div>

                    {/* Status Badges & Dots */}
                    <div className="flex items-center gap-1 mt-1">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-rose-700 bg-rose-100 px-1 py-0.2 rounded">
                          <Lock className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">Libur</span>
                        </span>
                      ) : isFullyBooked ? (
                        <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                          Penuh
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 flex-wrap">
                          {hasConfirmed && (
                            <span
                              className="w-2 h-2 rounded-full bg-emerald-500"
                              title="Ada sesi terkonfirmasi"
                            />
                          )}
                          {hasPending && (
                            <span
                              className="w-2 h-2 rounded-full bg-amber-400"
                              title="Ada sesi pending"
                            />
                          )}
                          {!hasConfirmed && !hasPending && !isDisabled && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-slate-300"
                              title="Semua slot tersedia"
                            />
                          )}
                          {summary && !isDisabled && (
                            <span className="text-[9px] text-[#7A7875] hidden md:inline ml-auto font-medium">
                              {summary.availableSlotsCount} slot
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Date Slot Selection Section */}
      {activeDate && (
        <div className="mt-6 pt-5 border-t border-[#EAE3DB] animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                Slot Waktu Tanggal Terpilih
              </span>
              <h4 className="font-serif text-lg font-bold text-[#141414]">
                {new Date(activeDate + 'T00:00:00Z').toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </h4>
            </div>
            {dateDetails?.isDateBlocked && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{dateDetails.blockReason || 'Studio tidak melayani pemotretan pada tanggal ini'}</span>
              </span>
            )}
          </div>

          {loadingDate ? (
            <div className="py-8 flex items-center justify-center gap-2 text-xs text-[#7A7875]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
              <span>Memeriksa ketersediaan jam...</span>
            </div>
          ) : dateError ? (
            <div className="p-3 bg-red-50 text-red-700 text-xs">{dateError}</div>
          ) : dateDetails?.isDateBlocked ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded">
              <p className="font-semibold">Tanggal Ini Ditutup / Diblokir Studio</p>
              <p className="mt-1 text-rose-700 font-sans">
                {dateDetails.blockReason || 'Studio sedang dalam agenda maintenance atau libur operasional.'}
                Silakan pilih tanggal lain yang masih memiliki slot terbuka.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dateDetails?.slots.map((slot) => {
                const isSlotSelected =
                  selectedTimeSlot === `${slot.startTime} - ${slot.endTime}` ||
                  selectedTimeSlot?.includes(slot.startTime);

                const isConfirmed = slot.status === 'CONFIRMED';
                const isPending = slot.status === 'PENDING';
                const isBlocked = slot.status === 'BLOCKED';
                const isAvailable = slot.status === 'AVAILABLE';

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.isBookable}
                    onClick={() => onSelectSlot(activeDate, slot)}
                    className={`p-3.5 border text-left transition-all rounded-sm flex flex-col justify-between min-h-[92px] ${
                      isSlotSelected
                        ? 'border-[#141414] bg-[#141414] text-[#FAF8F5] shadow-md ring-2 ring-[#C5A880]'
                        : isConfirmed
                        ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 opacity-90 cursor-not-allowed'
                        : isBlocked
                        ? 'border-rose-200 bg-rose-50/70 text-rose-900 opacity-70 cursor-not-allowed'
                        : isPending
                        ? 'border-amber-300 bg-amber-50/50 hover:border-amber-500 text-[#141414] cursor-pointer'
                        : 'border-[#EAE3DB] bg-[#FAF8F5] hover:border-[#C5A880] hover:bg-white text-[#141414] cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-mono font-bold ${
                            isSlotSelected ? 'text-[#FAF8F5]' : 'text-[#141414]'
                          }`}
                        >
                          {slot.startTime} - {slot.endTime} WIB
                        </span>

                        {/* Status Label Badge */}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Terkonfirmasi
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            Dalam Review
                          </span>
                        )}
                        {isBlocked && (
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Diblokir
                          </span>
                        )}
                        {isAvailable && (
                          <span
                            className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isSlotSelected
                                ? 'bg-[#C5A880] text-[#141414]'
                                : 'text-emerald-700 bg-emerald-100'
                            }`}
                          >
                            Tersedia
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[11px] line-clamp-1 ${
                          isSlotSelected ? 'text-[#C5A880]' : 'text-[#5A5854]'
                        }`}
                      >
                        {slot.label}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-dashed border-[#EAE3DB]/40 flex items-center justify-between text-[10px]">
                      {isConfirmed ? (
                        <span className="text-emerald-800 font-medium">Slot sudah terisi</span>
                      ) : isBlocked ? (
                        <span className="text-rose-800 font-medium">Tidak dapat dipesan</span>
                      ) : isPending ? (
                        <span className="text-amber-800 font-medium">
                          Bisa diajukan (menunggu verifikasi)
                        </span>
                      ) : isSlotSelected ? (
                        <span className="text-[#C5A880] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Dipilih
                        </span>
                      ) : (
                        <span className="text-[#7A7875] group-hover:text-[#141414]">
                          Klik untuk memilih slot ini
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
