# MOMEN.POTRAIT — Professional Photography Studio Website

> *"Every Moment Tells a Story."*

Website jasa fotografi profesional **MOMEN.POTRAIT** dibangun dengan standar visual editorial premium, tipografi berkarakter (Cormorant Garamond & Plus Jakarta Sans), palet warna hangat (charcoal, warm white, cream, muted gold), arsitektur full-stack modern, serta alur reservasi terintegrasi WhatsApp dan dashboard manajemen admin yang lengkap.

---

## 📸 Fitur Utama

### 1. Website Publik (Editorial & Responsif)
- **Wordmark & Identitas Visual Bersih:** Tipografi serif elegan berpadu sans-serif modern dengan whitespace luas dan komposisi foto asimetris.
- **Homepage:** Hero section sinematik, filosofi brand (*The MOMEN.POTRAIT Ethos*), cuplikan portofolio, ringkasan 7 kategori layanan, paket unggulan, 4 langkah alur booking, ulasan klien otentik, dan FAQ accordion interaktif.
- **Portfolio Gallery (`/portfolio`):** Filter kategori instan (*Portrait, Graduation, Couple, Prewedding, Wedding, Event, Product*), grid editorial responsif, dan modal **Lightbox** resolusi tinggi dengan navigasi Sebelumnya/Berikutnya dan keyboard shortcut (Esc/Panah).
- **Layanan Lengkap (`/services`):** Eksplorasi mendalam untuk seluruh 7 disiplin fotografi lengkap dengan target subjek, pendekatan visual, dan tombol booking langsung.
- **Pilihan Paket Transparan (`/packages`):** Tiga tingkatan paket (*Basic Moments*, *Signature Moments*, *Exclusive Moments*) dengan tabel matriks perbandingan fitur dan tombol pemilihan paket langsung.
- **Sistem Booking Terintegrasi (`/booking`):**
  - Parameter URL otomatis (`?package=...&service=...`) langsung mengisi paket dan layanan yang dipilih.
  - Live Order Summary yang menghitung estimasi biaya dan menampilkan rincian benefit secara langsung saat form diisi.
  - Validasi input ketat (nama, nomor WhatsApp, tanggal sesi, preferensi waktu, dan lokasi).
  - **Penyimpanan Database & Integrasi WhatsApp:** Permintaan booking tersimpan ke PostgreSQL dengan status **`PENDING`** dan kode booking unik (contoh: `MP-20261016-9256`), lalu membuka WhatsApp dengan pesan terformat otomatis ke nomor resmi studio.
  - Penegasan status: tidak mengklaim booking terkonfirmasi otomatis sebelum verifikasi jadwal dan pembayaran DP oleh tim studio.
- **Halaman Profil (`/about`):** Narasi filosofi studio, tiga pilar estetika visual, dan prinsip kerja di balik lensa.
- **Halaman Kontak (`/contact`):** Informasi kontak dinamis (WhatsApp, Instagram, Email), jam operasional, area cakupan pemotretan, dan formulir konsultasi.

### 2. Admin Management Console (`/admin`)
- **Autentikasi Terproteksi (`/admin/login`):** Login aman dengan hashing password bcrypt dan validasi token JWT.
- **Dashboard Ringkasan Metrik:** KPI cards (Total Booking, Menunggu Konfirmasi/Pending, Sesi Terkonfirmasi, Sesi Selesai, Estimasi Omset Terkumpul, Portofolio Aktif) serta tabel 5 booking terbaru.
- **Manajemen Reservasi (`/admin/bookings`):**
  - Pencarian fleksibel berdasarkan kode booking, nama klien, atau nomor WhatsApp.
  - Filter status (Semua, Pending, Terkonfirmasi, Selesai, Batal).
  - Modal detail lengkap pemesanan (jadwal, waktu, lokasi, catatan khusus, dan estimasi biaya).
  - Tombol aksi cepat pengubah status booking (`PENDING` → `CONFIRMED` → `COMPLETED` / `CANCELLED`).
  - Tombol 1-klik untuk membuka obrolan WhatsApp langsung dengan klien terkait kode booking mereka.
- **Manajemen Paket Foto (`/admin/packages`):** Tambah, ubah, dan hapus paket fotografi, durasi sesi, jumlah foto retouch, dan daftar benefit.
- **Manajemen Portofolio (`/admin/portfolio`):** Tambah karya baru dengan kategori, URL gambar resolusi tinggi, deskripsi, lokasi, tanggal pemotretan, dan penanda *Featured* di beranda.
- **Pengaturan Studio (`/admin/settings`):** Pengelolaan dinamis untuk nomor WhatsApp bisnis, email studio, akun Instagram, cakupan wilayah layanan, dan jam operasional.

---

## 🛠️ Tech Stack

- **Monorepo Architecture:** npm workspaces (`apps/web`, `apps/api`)
- **Frontend (`apps/web`):**
  - Framework: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
  - Styling: [Tailwind CSS v4](https://tailwindcss.com/)
  - Tipografi: Google Fonts (`Cormorant Garamond` & `Plus Jakarta Sans`)
  - Icons: [Lucide React](https://lucide.dev/)
- **Backend (`apps/api`):**
  - Framework: [NestJS](https://nestjs.com/) (TypeScript REST API)
  - Database: [PostgreSQL](https://www.postgresql.org/)
  - ORM: [Prisma ORM v6](https://www.prisma.io/)
  - Autentikasi: Passport JWT & bcryptjs
  - Validasi: `class-validator` & `class-transformer`

---

## 📁 Struktur Direktori

```text
phtografer/
├── apps/
│   ├── web/                     # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/             # App Router Pages
│   │   │   │   ├── page.tsx     # Homepage
│   │   │   │   ├── portfolio/   # Galeri Portofolio & Lightbox
│   │   │   │   ├── services/    # Halaman 7 Layanan Fotografi
│   │   │   │   ├── packages/    # Halaman Paket & Biaya
│   │   │   │   ├── booking/     # Halaman Form Pemesanan
│   │   │   │   ├── about/       # Halaman Tentang Brand
│   │   │   │   ├── contact/     # Halaman Kontak Studio
│   │   │   │   └── admin/       # Dashboard Admin (Login, Bookings, Packages, Portfolio, Settings)
│   │   │   ├── components/      # Reusable Components (Navbar, Footer, Lightbox, BookingForm, Faq)
│   │   │   └── lib/             # API Client & Admin Handlers
│   │   └── .env.local           # Environment Frontend
│   │
│   └── api/                     # NestJS Backend API
│       ├── prisma/
│       │   ├── schema.prisma    # Skema Database PostgreSQL
│       │   ├── migrations/      # Prisma Migrations
│       │   └── seed.ts          # Seed Data Awal (Admin, Services, Packages, Portfolio)
│       ├── src/
│       │   ├── auth/            # Modul Autentikasi Admin (JWT & Bcrypt)
│       │   ├── bookings/        # Modul Booking & WhatsApp Formatter
│       │   ├── services/        # Modul CRUD Layanan Fotografi
│       │   ├── packages/        # Modul CRUD Paket Fotografi
│       │   ├── portfolio/       # Modul CRUD Portofolio
│       │   ├── settings/        # Modul Pengaturan Kontak & Studio
│       │   └── admin/           # Modul KPI Metrik & Dashboard
│       └── .env                 # Environment Backend
│
└── package.json                 # Monorepo Scripts
```

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat
- **Node.js**: versi 20 atau lebih baru (disarankan v22+ / v24)
- **PostgreSQL**: terpasang dan sedang berjalan di port `5432`

### 2. Konfigurasi Database PostgreSQL
Buat database bernama `momen_potrait`:
```bash
createdb momen_potrait
```

### 3. Konfigurasi Environment Variables

File environment untuk backend (`apps/api/.env`):
```env
PORT=4000
DATABASE_URL="postgresql://username:password@localhost:5432/momen_potrait?schema=public"
JWT_SECRET="momen-potrait-super-secret-editorial-jwt-key-2026"
CORS_ORIGIN="http://localhost:3000"
DEFAULT_WHATSAPP_NUMBER="6281234567890"
```

File environment untuk frontend (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
NEXT_PUBLIC_STUDIO_NAME="MOMEN.POTRAIT"
```

### 4. Menjalankan Migrasi & Database Seeding
Jalankan perintah berikut di folder backend (`apps/api`) untuk membuat tabel dan mengisi data awal:
```bash
npm --prefix apps/api run db:migrate
npm --prefix apps/api run db:seed
```

### 5. Menjalankan Aplikasi
Jalankan Backend dan Frontend:
```bash
# Di terminal 1: Jalankan Backend API (Port 4000)
npm run dev:api

# Di terminal 2: Jalankan Frontend Web (Port 3000)
npm run dev:web
```
Akses website melalui browser:
- **Website Publik:** [http://localhost:3000](http://localhost:3000)
- **Dashboard Admin:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **REST API Endpoint:** [http://localhost:4000/api](http://localhost:4000/api)

---

## 🔐 Kredensial Admin Default (Development)

Untuk masuk ke konsol admin ([http://localhost:3000/admin/login](http://localhost:3000/admin/login)):
- **Email:** `admin@momenpotrait.com`
- **Password:** `momenadmin2026`

*(Pastikan untuk mengganti kata sandi di environment produksi melalui hash bcrypt yang aman).*

---

## 🧪 Validasi & Pengujian

Kedua aplikasi telah divalidasi dengan build produksi:
```bash
# Build Backend API
npm --prefix apps/api run build

# Build Frontend Web
npm --prefix apps/web run build
```
Seluruh 17 routes berhasil dikompilasi secara statis dengan optimasi performa dan zero TypeScript errors.
