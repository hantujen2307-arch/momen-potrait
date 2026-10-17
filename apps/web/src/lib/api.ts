export interface PhotographyService {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;
  description: string;
  coverImage: string;
  features?: string[];
  idealFor?: string;
  active: boolean;
  sortOrder: number;
}

export interface PhotographyPackage {
  id: string;
  slug: string;
  name: string;
  tier: string;
  category?: string;
  shortDesc?: string;
  description?: string;
  coverImageUrl: string;
  galleryImages?: string[];
  price: number;
  priceNote: string;
  durationMinutes: number;
  editedPhotoCount: number;
  includesOriginalFiles: boolean;
  originalFileDeliveryDetails?: string;
  deliveryFormats: string;
  outfitCount?: string;
  conceptCount?: string;
  locationCount: string;
  deliveryEstimate: string;
  benefits: string[];
  terms?: string;
  isPopular: boolean;
  isFeatured: boolean;
  badgeLabel?: string | null;
  status: string;
  active: boolean;
  sortOrder: number;
  displayOrder: number;
  serviceId?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  clientName?: string;
  shootDate?: string;
  location?: string;
  isFeatured: boolean;
  published?: boolean;
  sortOrder: number;
}

export interface HomepageContent {
  id?: string;
  heroHeadline: string;
  heroDescription: string;
  heroImageUrl: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  aboutTitle: string;
  aboutTagline: string;
  aboutDescription: string;
  ctaHeadline: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  faqItems: { question: string; answer: string }[];
  footerText?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  whatsappNumber: string;
  serviceName: string;
  packageName: string;
  shootDate: string;
  preferredTime: string;
  location: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  estimatedPrice?: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  reviewText: string;
  sessionType?: string;
  avatarUrl?: string;
  isPublished: boolean;
  rating?: number;
  sortOrder: number;
  createdAt: string;
}

export interface ContactSettings {
  id: string;
  studioName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  instagram: string;
  serviceArea: string;
  transportPolicy?: string;
  operatingHours: string;
  bookingNotice?: string;
}

export interface AdminMetrics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalPortfolio: number;
  totalPackages: number;
  totalServices: number;
  totalRevenue: number;
  recentBookings: Booking[];
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.API_INTERNAL_URL || 'http://localhost:4000/api';
}

const API_BASE = typeof window !== 'undefined' ? '/api' : (process.env.API_INTERNAL_URL || 'http://localhost:4000/api');

// Fallback data in case API is offline or during SSR
export const FALLBACK_SETTINGS: ContactSettings = {
  id: 'default',
  studioName: 'MOMEN.POTRAIT',
  tagline: 'Every Moment Tells a Story.',
  whatsappNumber: '6285157335443',
  email: 'halo@momenpotrait.com',
  instagram: '@momen.potrait',
  serviceArea: 'Sesuai konfirmasi & kesepakatan pemesanan',
  transportPolicy: 'Biaya transportasi dikonfirmasi secara transparan untuk sesi di luar area operasional utama.',
  operatingHours: 'Senin - Minggu: 08:30 - 20:30 WIB',
  bookingNotice: 'Reservasi disarankan H-7 untuk memastikan ketersediaan tanggal dan slot fotografer utama.',
};

export const FALLBACK_SERVICES: PhotographyService[] = [
  {
    id: 's1',
    slug: 'personal-portrait',
    name: 'Personal Portrait',
    tagline: 'Authentic presence, captured with editorial depth.',
    shortDesc: 'Sesi potret personal berkarakter untuk personal branding, editorial, atau kenangan otentik diri Anda.',
    description: 'Personal Portrait di MOMEN.POTRAIT dirancang untuk menangkap esensi dan kepribadian terdalam Anda tanpa kesan kaku. Dengan tata cahaya natural dan arahan pose yang mengalir santai, kami menciptakan potret yang timeless dan bercerita.',
    coverImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Personal branding, seniman, kreator, profil profesional, atau self-reward visual.',
    features: ['Arahan pose natural & relaks', 'Pilihan mood warna hangat & editorial', 'Satu atau dua pilihan pakaian (wardrobe change)'],
    active: true,
    sortOrder: 1,
  },
  {
    id: 's2',
    slug: 'graduation-photography',
    name: 'Graduation Photography',
    tagline: 'Honor your milestone with timeless visual elegance.',
    shortDesc: 'Abadikan puncak perjuangan akademik bersama keluarga dan sahabat dengan estetika editorial berkelas.',
    description: 'Hari kelulusan adalah tonggak sejarah penting. Kami menangkap kebanggaan, senyuman haru orang tua, dan keceriaan bersama sahabat dalam dokumentasi visual yang anggun dan berharga sepanjang masa.',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Wisudawan/wisudawati, perayaan kelulusan kampus, sesi toga individu maupun grup sahabat.',
    features: ['Foto solo toga & bersama keluarga inti', 'Outdoor kampus atau lokasi estetis pilihan', 'Group session bersama sahabat'],
    active: true,
    sortOrder: 2,
  },
  {
    id: 's3',
    slug: 'couple-photography',
    name: 'Couple Photography',
    tagline: 'Intimate, candid warmth celebrating your unique connection.',
    shortDesc: 'Sesi foto pasangan yang intim dan hangat, menangkap tawa tulus dan tatapan tanpa rekayasa kaku.',
    description: 'Bukan sekadar berpose menghadap kamera, sesi Couple Photography adalah tentang merayakan koneksi unik antara Anda berdua. Kami membiarkan momen berjalan organik agar kedekatan yang tertangkap terasa begitu nyata.',
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Anniversary, kencan santai, kenangan perjalanan cinta, atau pertunangan intim.',
    features: ['Pendekatan candid & minim interupsi', 'Eksplorasi lokasi luar ruangan atau indoor santai', 'Panduan moodboard sebelum pemotretan'],
    active: true,
    sortOrder: 3,
  },
  {
    id: 's4',
    slug: 'prewedding',
    name: 'Prewedding',
    tagline: 'Cinematic romance documented before your sacred vows.',
    shortDesc: 'Konsep prewedding sinematik yang mengisahkan perjalanan cinta Anda dengan tone film hangat yang abadi.',
    description: 'Mempersiapkan pernikahan membutuhkan banyak perhatian, dan sesi prewedding Anda harus menjadi momen yang menyenangkan untuk dinikmati bersama. Kami membantu menyusun konsep dari moodboard, pemilihan busana, hingga harmonisasi lokasi.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Calon pengantin yang menginginkan dokumentasi cinta artistik untuk undangan dan dekorasi resepsi.',
    features: ['Konsultasi konsep & moodboard mendalam', 'Multiple outfit & transisi waktu golden hour', 'File resolusi tinggi siap cetak kanvas besar'],
    active: true,
    sortOrder: 4,
  },
  {
    id: 's5',
    slug: 'wedding-photography',
    name: 'Wedding Photography',
    tagline: 'Unobtrusive, heartfelt documentation of your unforgettable day.',
    shortDesc: 'Dokumentasi hari bahagia yang menitikberatkan emosi tulus, detail sakral, dan sukacita keluarga.',
    description: 'Hari pernikahan berlalu dalam sekejap, namun kenangan visualnya bertahan selamanya. Tim fotografer kami mendokumentasikan setiap air mata haru, tawa bahagia, dan interaksi hangat secara halus tanpa mengganggu kesakralan acara.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Akad nikah, pemberkatan, resepsi intim, maupun perayaan pernikahan tradisional & modern.',
    features: ['Liputan menyeluruh dari persiapan hingga resepsi', 'Dokumentasi detail cincin, busana, & dekorasi', 'Kurasi master gallery beresolusi penuh'],
    active: true,
    sortOrder: 5,
  },
  {
    id: 's6',
    slug: 'event-documentation',
    name: 'Event Documentation',
    tagline: 'Dynamic storytelling for private gatherings and corporate celebrations.',
    shortDesc: 'Dokumentasi dinamis dan rapi untuk perayaan ulang tahun, syukuran, gathering, hingga seminar bergengsi.',
    description: 'Setiap acara memiliki dinamika dan energi tersendiri. Kami hadir dengan ketepatan waktu, kepekaan menangkap momen kunci, serta hasil foto beresolusi tinggi yang siap digunakan untuk publikasi maupun kenangan pribadi.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Gathering perusahaan, peluncuran produk, perayaan ulang tahun, pesta keluarga, dan konferensi.',
    features: ['Dokumentasi suasana, pembicara, & peserta', 'Pengiriman kilat foto highlight untuk sosial media', 'Pencahayaan terkalibrasi untuk ruangan redup'],
    active: true,
    sortOrder: 6,
  },
  {
    id: 's7',
    slug: 'product-photography',
    name: 'Product Photography',
    tagline: 'Elevating brands through clean, tactile, and persuasive commercial imagery.',
    shortDesc: 'Foto produk komersial dengan pencahayaan presisi dan penataan visual yang meningkatkan nilai brand Anda.',
    description: 'Visual produk yang memikat adalah faktor penentu keputusan pembeli. Kami memotret produk fashion, kuliner, skincare, dan kerajinan tangan dengan kejelasan tekstur dan komposisi visual yang menginspirasi kepercayaan pasar.',
    coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    idealFor: 'Brand e-commerce, UMKM lokal, lini fashion, beauty brand, dan katalog editorial.',
    features: ['Color accuracy sesuai produk asli', 'Pilihan backdrop studio & styled props', 'High-res untuk banner web & marketplace'],
    active: true,
    sortOrder: 7,
  },
];

export const FALLBACK_PACKAGES: PhotographyPackage[] = [
  {
    id: 'p1',
    slug: 'basic-moments',
    name: 'Basic Moments',
    tier: 'Basic',
    category: 'Portrait & Solo',
    shortDesc: 'Sesi potret esensial berkarakter untuk profil profesional, wisuda solo, atau personal branding.',
    description: 'Paket Basic Moments dirancang untuk Anda yang membutuhkan dokumentasi potret ringkas namun tetap memiliki kualitas estetika editorial. Sesi berlangsung efisien dengan pencahayaan terkalibrasi dan arahan pose yang nyaman.',
    coverImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    ],
    price: 150000,
    priceNote: 'Estimasi awal / paket hemat',
    durationMinutes: 30,
    editedPhotoCount: 5,
    includesOriginalFiles: false,
    originalFileDeliveryDetails: 'Hanya 5 foto pilihan terbaik yang diserahkan dalam resolusi penuh',
    deliveryFormats: 'JPEG Resolusi Penuh Siap Cetak & Profil',
    outfitCount: '1 Outfit Pilihan',
    conceptCount: '1 Konsep Sederhana',
    locationCount: '1 Lokasi / Spot Studio',
    deliveryEstimate: '5–7 Hari Kerja',
    benefits: [
      '30 Menit sesi pemotretan terarah',
      '5 Foto pilihan yang diedit profesional (retouch & signature color grading)',
      '1 Spot lokasi (area indoor studio atau outdoor sekitar)',
      'Akses galeri digital privat selama 30 hari',
      'Panduan outfit & moodboard ringkas via WhatsApp',
    ],
    terms: 'Reservasi minimal H-3. Perubahan jadwal (reschedule) gratis 1x maksimal H-2. Biaya sewa studio khusus di luar studio standar ditanggung klien.',
    badgeLabel: null,
    isPopular: false,
    isFeatured: true,
    status: 'PUBLISHED',
    active: true,
    sortOrder: 1,
    displayOrder: 1,
  },
  {
    id: 'p2',
    slug: 'signature-moments',
    name: 'Signature Moments',
    tier: 'Signature',
    category: 'Couple & Graduation',
    shortDesc: 'Pilihan paling ideal untuk merayakan kelulusan kampus, kencan pasangan, atau portofolio keluarga kecil.',
    description: 'Signature Moments adalah paket paling favorit di MOMEN.POTRAIT. Dengan durasi 60 menit dan eksplorasi hingga 2 spot berdekatan, Anda memiliki waktu yang leluasa untuk mengeksplorasi variasi sudut pengambilan gambar serta pergantian outfit.',
    coverImageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    ],
    price: 300000,
    priceNote: 'Paling diminati pelanggan',
    durationMinutes: 60,
    editedPhotoCount: 10,
    includesOriginalFiles: false,
    originalFileDeliveryDetails: '10 Master edit beresolusi penuh + Web Preview seluruh foto yang belum diedit',
    deliveryFormats: 'JPEG Resolusi Tinggi & Galeri Digital Interaktif',
    outfitCount: '1–2 Outfit',
    conceptCount: '1–2 Konsep Harmonis',
    locationCount: '1–2 Spot Berdekatan',
    deliveryEstimate: '5–7 Hari Kerja',
    benefits: [
      '60 Menit sesi pemotretan santai & leluasa',
      '10 Foto pilihan dengan signature editorial retouch',
      'Preview seluruh foto yang belum diedit via galeri web pribadi',
      'Eksplorasi hingga 2 sudut / spot lokasi berdekatan',
      'Konsultasi moodboard & arahan gaya busana terarah',
      'Akses cloud drive berkecepatan tinggi selama 90 hari',
    ],
    terms: 'DP 30% untuk mengunci jadwal pemotretan. Reschedule 1x gratis minimal H-3 sebelum sesi. Sesi outdoor dapat menyesuaikan cuaca pada hari H.',
    badgeLabel: 'BEST SELLER',
    isPopular: true,
    isFeatured: true,
    status: 'PUBLISHED',
    active: true,
    sortOrder: 2,
    displayOrder: 2,
  },
  {
    id: 'p3',
    slug: 'exclusive-moments',
    name: 'Exclusive Moments',
    tier: 'Exclusive',
    category: 'Prewedding & Full Story',
    shortDesc: 'Pengalaman visual sinematik tanpa batas waktu terburu-buru, dilengkapi seluruh file foto asli dan cetak mini frame.',
    description: 'Didesain khusus untuk momen sakral prewedding, dokumentasi keluarga besar, atau sesi personal portofolio skala penuh. Menghadirkan perencanaan konsep menyeluruh, prioritas pengeditan kilat, dan seluruh file foto asli disertakan.',
    coverImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    ],
    price: 500000,
    priceNote: 'Mulai dari Rp500.000 / paket lengkap',
    durationMinutes: 120,
    editedPhotoCount: 20,
    includesOriginalFiles: true,
    originalFileDeliveryDetails: 'Seluruh file foto asli (original JPEG resolusi penuh) disertakan via Cloud Storage',
    deliveryFormats: 'Master High-Res JPEG, Cloud Archive 1 Tahun, & Cetak Fisik',
    outfitCount: 'Hingga 3 Pilihan Outfit',
    conceptCount: 'Perencanaan Konsep Penuh & Moodboard Sinematik',
    locationCount: 'Bebas / Multi-spot Leluasa',
    deliveryEstimate: 'Prioritas Kilat (3–5 Hari Kerja)',
    benefits: [
      '90–120 Menit sesi pemotretan premium',
      '20 Foto master edit beresolusi penuh siap cetak kanvas besar',
      'SELURUH file foto asli (original JPEG) diberikan via Cloud Drive',
      'Perencanaan konsep mendalam & pendampingan moodboard busana',
      'Prioritas editing kilat (selesai dalam 3–5 hari kerja)',
      'Bonus cetak 1 mini art frame eksklusif ukuran 5R',
      'Akses penyimpanan galeri online privat selama 1 tahun penuh',
    ],
    terms: 'DP 50% untuk penguncian tanggal fotografer utama. Konsultasi tatap muka online/chat sebelum sesi. Tiket masuk lokasi/izin pemotretan berbayar menjadi tanggungan klien.',
    badgeLabel: 'PREMIUM',
    isPopular: false,
    isFeatured: true,
    status: 'PUBLISHED',
    active: true,
    sortOrder: 3,
    displayOrder: 3,
  },
];

export const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'pf1',
    title: 'Solitude in Monochrome & Earth',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
    description: 'Potret editorial dengan bayangan tegas dan ekspresi tenang berbalut nuansa tanah hangat.',
    clientName: 'Nadia S.',
    shootDate: 'September 2026',
    location: 'Studio Tebet, Jakarta Selatan',
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 'pf2',
    title: 'Gentle Sunlight Studio Portrait',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    description: 'Pencahayaan alami dari jendela samping menonjolkan garis rahang dan ketenangan tatapan.',
    clientName: 'Dimas Wicaksono',
    shootDate: 'Agustus 2026',
    location: 'Natural Light Studio, BSD',
    isFeatured: false,
    sortOrder: 2,
  },
  {
    id: 'pf3',
    title: 'Triumph Under the Campanile',
    category: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    description: 'Momen kebanggaan kelulusan bersama sahabat terdekat di pelataran kampus tercinta.',
    clientName: 'Rania & Friends',
    shootDate: 'September 2026',
    location: 'Kampus UI Depok',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: 'pf4',
    title: 'The Golden Degree',
    category: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1000&q=80',
    description: 'Senyum bangga wisudawati memegang ijazah di bawah naungan pohon rindang sore hari.',
    clientName: 'Alisha Putri, S.E.',
    shootDate: 'Oktober 2026',
    location: 'Taman Balairung UI',
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: 'pf5',
    title: 'Whispers in the Pine Forest',
    category: 'Couple',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80',
    description: 'Sesi kencan santai di hutan pinus berkabut dengan tawa lepas yang tulus.',
    clientName: 'Kevin & Sarah',
    shootDate: 'Juli 2026',
    location: 'Sentul Highlands, Bogor',
    isFeatured: true,
    sortOrder: 5,
  },
  {
    id: 'pf6',
    title: 'Coffee Date Melancholy',
    category: 'Couple',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    description: 'Menangkap obrolan hangat sepasang kekasih di sudut kedai kopi bernuansa kayu klasik.',
    clientName: 'Arif & Sheila',
    shootDate: 'Agustus 2026',
    location: 'Blok M, Jakarta Selatan',
    isFeatured: false,
    sortOrder: 6,
  },
  {
    id: 'pf7',
    title: 'Echoes of Coastal Vows',
    category: 'Prewedding',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    description: 'Komposisi sinematik di tebing karang dengan gaun melayang dan ombak dramatis.',
    clientName: 'Radit & Maya',
    shootDate: 'September 2026',
    location: 'Pantai Menganti, Kebumen',
    isFeatured: true,
    sortOrder: 7,
  },
  {
    id: 'pf8',
    title: 'Quiet Minimalist Prewedding',
    category: 'Prewedding',
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    description: 'Gaya editorial modern berbusana earth tone dengan pencahayaan lembut studio.',
    clientName: 'Bima & Clara',
    shootDate: 'Agustus 2026',
    location: 'Studio Minimalis Senopati',
    isFeatured: false,
    sortOrder: 8,
  },
  {
    id: 'pf9',
    title: 'Sacred Tears of Joy',
    category: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    description: 'Momen sungkeman yang sarat doa haru antara kedua mempelai dan orang tua.',
    clientName: 'Ananda & Fajar',
    shootDate: 'September 2026',
    location: 'Plataran Dharmawangsa',
    isFeatured: true,
    sortOrder: 9,
  },
  {
    id: 'pf10',
    title: 'Dance of Two Souls',
    category: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    description: 'Tarian pertama kedua mempelai di bawah gemerlap lampu gantung kristal yang hangat.',
    clientName: 'Vania & Andrew',
    shootDate: 'Oktober 2026',
    location: 'Glass House, Kemang',
    isFeatured: false,
    sortOrder: 10,
  },
  {
    id: 'pf11',
    title: 'Youth & Music Festival Rhythm',
    category: 'Event',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    description: 'Energi penonton dan tata lampu panggung yang dinamis dalam malam konser musik.',
    clientName: 'Art & Harmony Festival',
    shootDate: 'September 2026',
    location: 'Senayan Park, Jakarta',
    isFeatured: false,
    sortOrder: 11,
  },
  {
    id: 'pf12',
    title: 'Tactile Leather & Brass',
    category: 'Product',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
    description: 'Foto detail tekstur dompet kulit artisan dengan pencahayaan sudut rendah bernilai tinggi.',
    clientName: 'Atelier Kriya Leather',
    shootDate: 'Oktober 2026',
    location: 'Momen Studio Tabletop',
    isFeatured: true,
    sortOrder: 12,
  },
];

// Public Fetchers
export async function getServices(): Promise<PhotographyService[]> {
  try {
    const res = await fetch(`${API_BASE}/services`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch services');
    return await res.json();
  } catch (err) {
    console.warn('Using fallback services data:', err);
    return FALLBACK_SERVICES;
  }
}

export async function getServiceBySlug(slug: string): Promise<PhotographyService | null> {
  try {
    const res = await fetch(`${API_BASE}/services/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch service by slug');
    return await res.json();
  } catch (err) {
    return FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  }
}

export async function getPackages(): Promise<PhotographyPackage[]> {
  try {
    const res = await fetch(`${API_BASE}/packages`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch packages');
    return await res.json();
  } catch (err) {
    console.warn('Using fallback packages data:', err);
    return FALLBACK_PACKAGES;
  }
}

export async function getPortfolio(category?: string, featuredOnly?: boolean): Promise<PortfolioItem[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (featuredOnly) params.set('featured', 'true');
    const url = `${API_BASE}/portfolio${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    return await res.json();
  } catch (err) {
    console.warn('Using fallback portfolio data:', err);
    let items = FALLBACK_PORTFOLIO;
    if (category && category !== 'All') {
      items = items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
    if (featuredOnly) {
      items = items.filter((item) => item.isFeatured);
    }
    return items;
  }
}

export async function getSettings(): Promise<ContactSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    return FALLBACK_SETTINGS;
  }
}

export const FALLBACK_HOMEPAGE_CONTENT: HomepageContent = {
  heroHeadline: 'Every Moment Tells a Story.',
  heroDescription:
    'Fotografi potret editorial, wisuda, pasangan, dan momen berharga yang dikurasi secara artistik dengan pencahayaan sinematik dan arahan pose natural.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  heroPrimaryCtaText: 'Booking Sekarang',
  heroPrimaryCtaLink: '/booking',
  heroSecondaryCtaText: 'Lihat Paket',
  heroSecondaryCtaLink: '/packages',
  aboutTitle: 'Foto yang Terasa Seperti Anda.',
  aboutTagline: 'Filosofi Fotografi Kami',
  aboutDescription:
    'Kami adalah studio fotografi kontemporer yang percaya bahwa keindahan visual terletak pada keaslian ekspresi. Tidak ada pose kaku atau manipulasi berlebihan — hanya Anda, cerita Anda, dan momen terbaik yang diabadikan dengan estetika abadi.',
  ctaHeadline: 'Siap Mengabadikan Momen Berharga Anda?',
  ctaDescription:
    'Konsultasikan konsep sesi pemotretan Anda bersama fotografer kami atau amankan tanggal pilihan Anda sekarang.',
  ctaButtonText: 'Reservasi Sesi Sekarang',
  ctaButtonLink: '/booking',
  faqItems: [
    {
      question: 'Bagaimana cara melakukan booking?',
      answer:
        'Pilih paket yang Anda butuhkan melalui website, kemudian lengkapi formulir reservasi online dengan estimasi tanggal dan lokasi sesi. Data Anda tersimpan di sistem kami dan diteruskan ke WhatsApp resmi studio untuk konfirmasi ketersediaan slot.',
    },
    {
      question: 'Apakah diperlukan uang muka?',
      answer:
        'Ya, pembayaran uang muka (DP) diperlukan setelah ketersediaan tanggal dan jadwal fotografer diverifikasi oleh tim admin, guna mengunci slot pemotretan Anda secara resmi.',
    },
    {
      question: 'Bagaimana kebijakan perubahan jadwal?',
      answer:
        'Perubahan jadwal (reschedule) dapat diajukan dengan konfirmasi lebih awal sebelum hari pemotretan, mengikuti ketersediaan tanggal kosong fotografer berikutnya.',
    },
    {
      question: 'Apakah ada biaya transportasi?',
      answer:
        'Biaya transportasi hanya dikenakan apabila sesi dilakukan di luar area operasional standar atau memerlukan akomodasi khusus. Seluruh rincian biaya akan disampaikan secara transparan sebelum pembayaran DP.',
    },
    {
      question: 'Berapa lama proses editing foto?',
      answer:
        'Proses editing dan kurasi warna diselesaikan sesuai estimasi pada masing-masing paket (umumnya 5–7 hari kerja, atau prioritas kilat untuk paket tertentu).',
    },
    {
      question: 'Apakah semua file foto asli diberikan?',
      answer:
        'Pemberian seluruh file foto asli mengikuti ketentuan masing-masing paket. Paket tertentu menyertakan seluruh file asli via cloud storage, sementara paket lainnya fokus pada master foto pilihan hasil edit.',
    },
    {
      question: 'Bagaimana cara menerima hasil foto?',
      answer:
        'Hasil foto akhir diserahkan dalam format digital JPEG resolusi tinggi melalui tautan cloud storage privat yang aman dan dapat diunduh kapan saja.',
    },
  ],
  footerText: 'Every Moment Tells a Story. Hak Cipta Dilindungi.',
};

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const res = await fetch(`${API_BASE}/content/homepage`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch homepage content');
    return await res.json();
  } catch (err) {
    return FALLBACK_HOMEPAGE_CONTENT;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

// Booking Submission
export interface CreateBookingPayload {
  customerName: string;
  whatsappNumber: string;
  serviceName: string;
  packageName: string;
  shootDate: string;
  preferredTime: string;
  startTime?: string;
  endTime?: string;
  location: string;
  notes?: string;
  estimatedPrice?: number;
}

export interface BookingResponse {
  success: boolean;
  booking: Booking;
  whatsappUrl: string;
  message: string;
}

export async function submitBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal menyimpan booking');
    }

    return await res.json();
  } catch (err: any) {
    if (err?.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Generate graceful fallback WhatsApp link even if backend is offline
    const randomCode = `MP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285157335443';
    const messageLines = [
      `Halo *MOMEN.POTRAIT*, saya ingin reservasi sesi foto:`,
      ``,
      `🔖 *Kode Booking:* ${randomCode}`,
      `👤 *Nama:* ${payload.customerName}`,
      `📱 *No. WhatsApp:* ${payload.whatsappNumber}`,
      `📷 *Layanan:* ${payload.serviceName}`,
      `📦 *Paket:* ${payload.packageName}`,
      `📅 *Tanggal:* ${payload.shootDate}`,
      `⏰ *Waktu:* ${payload.preferredTime}`,
      `📍 *Lokasi:* ${payload.location}`,
      payload.notes ? `📝 *Catatan:* ${payload.notes}` : `📝 *Catatan:* -`,
      ``,
      `Mohon info ketersediaan jadwal. Terima kasih!`,
    ];
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(messageLines.join('\n'))}`;

    return {
      success: true,
      booking: {
        id: 'local-' + Date.now(),
        bookingCode: randomCode,
        customerName: payload.customerName,
        whatsappNumber: payload.whatsappNumber,
        serviceName: payload.serviceName,
        packageName: payload.packageName,
        shootDate: payload.shootDate,
        preferredTime: payload.preferredTime,
        location: payload.location,
        notes: payload.notes,
        status: 'PENDING',
        estimatedPrice: payload.estimatedPrice,
        createdAt: new Date().toISOString(),
      },
      whatsappUrl,
      message: 'Permintaan booking siap diteruskan ke WhatsApp tim MOMEN.POTRAIT.',
    };
  }
}

// ==========================================
// PUBLIC CALENDAR TYPES & FUNCTIONS
// ==========================================

export interface PublicCalendarDaySummary {
  date: string;
  dayOfWeek: number;
  status: 'AVAILABLE' | 'PARTIAL' | 'CONFIRMED' | 'PENDING' | 'BLOCKED';
  hasConfirmed: boolean;
  hasPending: boolean;
  isBlocked: boolean;
  blockTitle?: string;
  availableSlotsCount: number;
  totalSlotsCount: number;
}

export interface PublicCalendarSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  status: 'AVAILABLE' | 'CONFIRMED' | 'PENDING' | 'BLOCKED';
  isBookable: boolean;
}

export interface PublicCalendarDateDetails {
  date: string;
  isDateBlocked: boolean;
  blockReason: string | null;
  slots: PublicCalendarSlot[];
}


export async function getPublicCalendarMonth(
  year: number,
  month: number,
): Promise<PublicCalendarDaySummary[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/calendar/month?year=${year}&month=${month}`, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Server mengembalikan status HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Format data kalender dari server tidak valid.');
    }
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error fetching public calendar month:', error);
    if (error.name === 'AbortError') {
      throw new Error('Koneksi kalender ke server timeout (10 detik). Silakan coba lagi.');
    }
    throw error;
  }
}

export async function getPublicCalendarDate(
  dateStr: string,
): Promise<PublicCalendarDateDetails | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/calendar/date?date=${dateStr}`, {
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Server mengembalikan status HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Error fetching public calendar date slots:', error);
    if (error.name === 'AbortError') {
      throw new Error('Koneksi ketersediaan slot ke server timeout (10 detik). Silakan coba lagi.');
    }
    throw error;
  }
}
