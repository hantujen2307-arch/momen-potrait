import { AdminMetrics, Booking, ContactSettings, PhotographyPackage, PhotographyService, PortfolioItem } from './api';

const API_BASE = typeof window !== 'undefined' ? '/api' : (process.env.API_INTERNAL_URL || 'http://localhost:4000/api');

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mp_admin_token');
}

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mp_admin_token', token);
  }
}

export function removeAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mp_admin_token');
    localStorage.removeItem('mp_admin_user');
  }
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('mp_admin_user');
  return user ? JSON.parse(user) : null;
}

export function setAdminUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mp_admin_user', JSON.stringify(user));
  }
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function loginAdmin(email: string, pass: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login gagal. Periksa kembali email dan password Anda.');
  }
  const data = await res.json();
  setAdminToken(data.accessToken);
  setAdminUser(data.user);
  return data;
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const res = await fetch(`${API_BASE}/admin/metrics`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data metrik');
  return res.json();
}

export async function getAdminBookings(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Booking[]; total: number; totalPages: number }> {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.status && params.status !== 'ALL') q.set('status', params.status);
  if (params.page) q.set('page', params.page.toString());
  if (params.limit) q.set('limit', params.limit.toString());

  const res = await fetch(`${API_BASE}/admin/bookings?${q.toString()}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil daftar booking');
  return res.json();
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Gagal mengubah status booking');
  return res.json();
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus booking');
}

// Admin Packages CRUD
export async function getAdminPackages(): Promise<PhotographyPackage[]> {
  const res = await fetch(`${API_BASE}/admin/packages`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil daftar paket');
  return res.json();
}

export async function createAdminPackage(data: any): Promise<PhotographyPackage> {
  const res = await fetch(`${API_BASE}/admin/packages`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal menambah paket baru');
  return res.json();
}

export async function updateAdminPackage(id: string, data: any): Promise<PhotographyPackage> {
  const res = await fetch(`${API_BASE}/admin/packages/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal memperbarui paket');
  return res.json();
}

export async function deleteAdminPackage(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/packages/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus paket');
}

export async function uploadAdminFile(
  file: File,
  folder?: string,
): Promise<{ url: string; secure_url?: string; public_id?: string; filename?: string }> {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengunggah foto');
  }

  const data = await res.json();
  if (data.url && data.url.startsWith('/')) {
    data.url = `${API_BASE.replace('/api', '')}${data.url}`;
  }
  return data;
}

// Admin Portfolio CRUD
export async function getAdminPortfolio(): Promise<PortfolioItem[]> {
  const res = await fetch(`${API_BASE}/admin/portfolio`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil daftar portofolio');
  return res.json();
}

export async function createAdminPortfolio(data: any): Promise<PortfolioItem> {
  const res = await fetch(`${API_BASE}/admin/portfolio`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal menambah portofolio');
  return res.json();
}

export async function updateAdminPortfolio(id: string, data: any): Promise<PortfolioItem> {
  const res = await fetch(`${API_BASE}/admin/portfolio/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal memperbarui portofolio');
  return res.json();
}

export async function deleteAdminPortfolio(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/portfolio/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus portofolio');
}

// Admin Settings
export async function getAdminSettings(): Promise<ContactSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil pengaturan studio');
  return res.json();
}

export async function updateAdminSettings(data: Partial<ContactSettings>): Promise<ContactSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal menyimpan pengaturan studio');
  return res.json();
}

// Admin Homepage Content
export async function getAdminHomepageContent(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/content/homepage`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil konten homepage');
  return res.json();
}

export async function updateAdminHomepageContent(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/content/homepage`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal menyimpan konten homepage');
  return res.json();
}

// Admin Account Management
export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/password`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengubah kata sandi');
  }
  return res.json();
}

export async function updateAdminProfile(name: string): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal memperbarui profil');
  }
  const data = await res.json();
  const currentUser = getAdminUser();
  if (currentUser) {
    setAdminUser({ ...currentUser, name: data.name });
  }
  return data;
}

// Admin Testimonials Management
export async function getAdminTestimonials(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/admin/testimonials`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil daftar testimoni');
  return res.json();
}

export async function createAdminTestimonial(data: {
  clientName: string;
  reviewText: string;
  sessionType?: string;
  avatarUrl?: string;
  isPublished?: boolean;
  rating?: number;
  sortOrder?: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/testimonials`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal menambahkan testimoni');
  }
  return res.json();
}

export async function updateAdminTestimonial(
  id: string,
  data: Partial<{
    clientName: string;
    reviewText: string;
    sessionType?: string;
    avatarUrl?: string;
    isPublished?: boolean;
    rating?: number;
    sortOrder?: number;
  }>,
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal memperbarui testimoni');
  }
  return res.json();
}

export async function deleteAdminTestimonial(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus testimoni');
}

// ==========================================
// ADMIN CALENDAR TYPES & FUNCTIONS
// ==========================================

export interface AdminCalendarBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  whatsappNumber: string;
  serviceName: string;
  packageName: string;
  shootDate: string;
  preferredTime: string;
  startTime?: string | null;
  endTime?: string | null;
  location: string;
  notes?: string | null;
  internalNotes?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  estimatedPrice?: number | null;
  isManual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminScheduleBlock {
  id: string;
  title: string;
  blockDate: string;
  isAllDay: boolean;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCalendarMonthResponse {
  year: number;
  month: number;
  bookings: AdminCalendarBooking[];
  blocks: AdminScheduleBlock[];
}

export interface AdminCalendarDateSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  status: 'AVAILABLE' | 'CONFIRMED' | 'PENDING' | 'BLOCKED';
  booking?: AdminCalendarBooking | null;
  block?: AdminScheduleBlock | null;
}

export interface AdminCalendarDateResponse {
  date: string;
  isDateBlocked: boolean;
  dayBlocks: AdminScheduleBlock[];
  slots: AdminCalendarDateSlot[];
  customBookings: AdminCalendarBooking[];
}

export interface CreateManualBookingDto {
  customerName: string;
  whatsappNumber: string;
  serviceName: string;
  packageName: string;
  shootDate: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
  internalNotes?: string;
  estimatedPrice?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateManualBookingDto {
  customerName?: string;
  whatsappNumber?: string;
  serviceName?: string;
  packageName?: string;
  shootDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  notes?: string;
  internalNotes?: string;
  estimatedPrice?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface CreateScheduleBlockDto {
  title: string;
  blockDate: string;
  isAllDay?: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export async function getAdminCalendarMonth(
  year: number,
  month: number,
): Promise<AdminCalendarMonthResponse> {
  const res = await fetch(`${API_BASE}/admin/calendar/month?year=${year}&month=${month}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengambil data kalender bulan admin');
  }
  return res.json();
}

export async function getAdminCalendarDate(
  dateStr: string,
): Promise<AdminCalendarDateResponse> {
  const res = await fetch(`${API_BASE}/admin/calendar/date?date=${dateStr}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengambil detail jadwal tanggal');
  }
  return res.json();
}

export async function createAdminManualBooking(
  data: CreateManualBookingDto,
): Promise<AdminCalendarBooking> {
  const res = await fetch(`${API_BASE}/admin/calendar/booking`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal membuat booking manual');
  }
  return res.json();
}

export async function updateAdminManualBooking(
  id: string,
  data: UpdateManualBookingDto,
): Promise<AdminCalendarBooking> {
  const res = await fetch(`${API_BASE}/admin/calendar/booking/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal memperbarui booking');
  }
  return res.json();
}

export async function createAdminScheduleBlock(
  data: CreateScheduleBlockDto,
): Promise<AdminScheduleBlock> {
  const res = await fetch(`${API_BASE}/admin/calendar/block`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal memblokir jadwal');
  }
  return res.json();
}

export async function deleteAdminScheduleBlock(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/calendar/block/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal menghapus blokir jadwal');
  }
}

export async function getAdminScheduleBlocks(): Promise<AdminScheduleBlock[]> {
  const res = await fetch(`${API_BASE}/admin/calendar/blocks`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Gagal mengambil daftar blokir jadwal');
  }
  return res.json();
}
