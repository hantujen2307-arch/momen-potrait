'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  X,
  FileCheck,
  Upload,
  Image as ImageIcon,
  Archive,
  Check,
  Eye,
  Camera,
  FolderArchive,
  Layers,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  getAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  deleteAdminPackage,
  uploadAdminFile,
} from '@/lib/admin-api';
import { PhotographyPackage } from '@/lib/api';

const PRESET_COVERS = [
  {
    label: 'Solo Editorial Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Warm Couple & Graduation',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Cinematic Prewedding',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Studio Natural Light',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Intimate Sacred Wedding',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Minimalist Editorial',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PhotographyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailPkg, setDetailPkg] = useState<PhotographyPackage | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('ALL');
  const [editingPkg, setEditingPkg] = useState<PhotographyPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'service' | 'display'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State: 1. Informasi Utama
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tier, setTier] = useState('Signature');
  const [category, setCategory] = useState('Couple & Graduation');
  const [price, setPrice] = useState(300000);
  const [priceNote, setPriceNote] = useState('Paling diminati pelanggan');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [galleryImagesText, setGalleryImagesText] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');

  // Form State: 2. Detail Layanan
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [editedPhotoCount, setEditedPhotoCount] = useState(10);
  const [includesOriginalFiles, setIncludesOriginalFiles] = useState(false);
  const [originalFileDeliveryDetails, setOriginalFileDeliveryDetails] = useState('');
  const [deliveryFormats, setDeliveryFormats] = useState('JPEG Resolusi Tinggi');
  const [outfitCount, setOutfitCount] = useState('1–2 Outfit');
  const [conceptCount, setConceptCount] = useState('1–2 Konsep Harmonis');
  const [locationCount, setLocationCount] = useState('1–2 Spot Berdekatan');
  const [deliveryEstimate, setDeliveryEstimate] = useState('5–7 Hari Kerja');
  const [benefitsText, setBenefitsText] = useState('');
  const [terms, setTerms] = useState('');

  // Form State: 3. Pengaturan Tampilan
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');
  const [active, setActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [badgeLabel, setBadgeLabel] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState(1);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getAdminPackages();
      setPackages(data);
    } catch (err) {
      console.error('Error fetching admin packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openAddModal = () => {
    setEditingPkg(null);
    setActiveTab('info');
    setName('');
    setSlug('');
    setTier('Signature');
    setCategory('Couple & Graduation');
    setPrice(300000);
    setPriceNote('Paling diminati pelanggan');
    setCoverImageUrl(PRESET_COVERS[1].url);
    setGalleryImagesText('');
    setShortDesc('Pilihan ideal untuk merayakan momen berharga dengan visual sinematik.');
    setDescription(
      'Sesi pemotretan berdurasi 60 menit dengan arahan pose natural dan eksplorasi spot leluasa.',
    );
    setDurationMinutes(60);
    setEditedPhotoCount(10);
    setIncludesOriginalFiles(false);
    setOriginalFileDeliveryDetails(
      '10 Master edit beresolusi penuh + Web Preview seluruh foto yang belum diedit',
    );
    setDeliveryFormats('JPEG Resolusi Tinggi & Galeri Digital Interaktif');
    setOutfitCount('1–2 Outfit');
    setConceptCount('1–2 Konsep Harmonis');
    setLocationCount('1–2 Spot Berdekatan');
    setDeliveryEstimate('5–7 Hari Kerja');
    setBenefitsText(
      '60 Menit sesi pemotretan santai & leluasa\n10 Foto pilihan dengan signature editorial retouch\nPreview seluruh foto via galeri web pribadi\nEksplorasi hingga 2 sudut spot berdekatan\nKonsultasi moodboard & arahan gaya busana',
    );
    setTerms(
      'DP 30% untuk mengunci jadwal pemotretan. Reschedule 1x gratis minimal H-3 sebelum sesi.',
    );
    setStatus('PUBLISHED');
    setActive(true);
    setIsFeatured(true);
    setIsPopular(false);
    setBadgeLabel('BEST SELLER');
    setDisplayOrder(packages.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (pkg: PhotographyPackage) => {
    setEditingPkg(pkg);
    setActiveTab('info');
    setName(pkg.name);
    setSlug(pkg.slug);
    setTier(pkg.tier);
    setCategory(pkg.category || 'Portrait');
    setPrice(pkg.price);
    setPriceNote(pkg.priceNote || '');
    setCoverImageUrl(pkg.coverImageUrl || '');
    setGalleryImagesText(
      Array.isArray(pkg.galleryImages) ? pkg.galleryImages.join('\n') : '',
    );
    setShortDesc(pkg.shortDesc || '');
    setDescription(pkg.description || '');
    setDurationMinutes(pkg.durationMinutes);
    setEditedPhotoCount(pkg.editedPhotoCount);
    setIncludesOriginalFiles(pkg.includesOriginalFiles);
    setOriginalFileDeliveryDetails(pkg.originalFileDeliveryDetails || '');
    setDeliveryFormats(pkg.deliveryFormats || 'JPEG Resolusi Tinggi');
    setOutfitCount(pkg.outfitCount || '');
    setConceptCount(pkg.conceptCount || '');
    setLocationCount(pkg.locationCount || '1 Lokasi');
    setDeliveryEstimate(pkg.deliveryEstimate || '5–7 Hari Kerja');
    setBenefitsText(Array.isArray(pkg.benefits) ? pkg.benefits.join('\n') : '');
    setTerms(pkg.terms || '');
    setStatus((pkg.status as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') || 'PUBLISHED');
    setActive(pkg.active);
    setIsFeatured(pkg.isFeatured);
    setIsPopular(pkg.isPopular);
    setBadgeLabel(pkg.badgeLabel || '');
    setDisplayOrder(pkg.displayOrder || 1);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadAdminFile(file);
      setCoverImageUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Gagal mengupload foto');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetStatus = async (
    pkg: PhotographyPackage,
    nextStatus: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
  ) => {
    try {
      await updateAdminPackage(pkg.id, { status: nextStatus });
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, status: nextStatus } : p)),
      );
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status paket');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nama paket wajib diisi');
    if (!coverImageUrl.trim()) return alert('Foto cover paket wajib diisi atau diunggah');

    setIsSubmitting(true);
    const benefitsArray = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const galleryArray = galleryImagesText
      .split('\n')
      .map((g) => g.trim())
      .filter(Boolean);

    const generatedSlug =
      slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      name: name.trim(),
      slug: generatedSlug,
      tier,
      category: category.trim(),
      shortDesc: shortDesc.trim(),
      description: description.trim(),
      coverImageUrl: coverImageUrl.trim(),
      galleryImages: galleryArray,
      price: Number(price),
      priceNote: priceNote.trim(),
      durationMinutes: Number(durationMinutes),
      editedPhotoCount: Number(editedPhotoCount),
      includesOriginalFiles: Boolean(includesOriginalFiles),
      originalFileDeliveryDetails: originalFileDeliveryDetails.trim() || undefined,
      deliveryFormats: deliveryFormats.trim(),
      outfitCount: outfitCount.trim() || undefined,
      conceptCount: conceptCount.trim() || undefined,
      locationCount: locationCount.trim(),
      deliveryEstimate: deliveryEstimate.trim(),
      benefits: benefitsArray,
      terms: terms.trim() || undefined,
      badgeLabel: badgeLabel.trim() ? badgeLabel.trim() : null,
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular),
      status,
      active: Boolean(active),
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingPkg) {
        await updateAdminPackage(editingPkg.id, payload);
      } else {
        await createAdminPackage(payload);
      }
      setModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan paket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket fotografi ini?')) return;
    try {
      await deleteAdminPackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus paket');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Visual Photography Offerings
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Pengelolaan Paket Foto Visual
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Atur foto cover visual, harga transparan, durasi, jumlah foto edit, ketentuan file asli, dan label badge untuk seluruh paket publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPackages}
            className="p-2 border border-[#2B2B28] text-[#999690] hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Baru</span>
          </button>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
            statusFilter === 'ALL'
              ? 'bg-[#C5A880] text-[#141414]'
              : 'bg-[#181817] text-[#8C8984] hover:text-white border border-[#2B2B28]'
          }`}
        >
          Semua ({packages.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
            statusFilter === 'PUBLISHED'
              ? 'bg-emerald-800 text-emerald-100 border border-emerald-500'
              : 'bg-[#181817] text-[#8C8984] hover:text-white border border-[#2B2B28]'
          }`}
        >
          Published ({packages.filter((p) => p.status === 'PUBLISHED').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('DRAFT')}
          className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
            statusFilter === 'DRAFT'
              ? 'bg-amber-800 text-amber-100 border border-amber-500'
              : 'bg-[#181817] text-[#8C8984] hover:text-white border border-[#2B2B28]'
          }`}
        >
          Draft ({packages.filter((p) => p.status === 'DRAFT').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('ARCHIVED')}
          className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
            statusFilter === 'ARCHIVED'
              ? 'bg-neutral-700 text-neutral-200 border border-neutral-500'
              : 'bg-[#181817] text-[#8C8984] hover:text-white border border-[#2B2B28]'
          }`}
        >
          Archived ({packages.filter((p) => p.status === 'ARCHIVED').length})
        </button>
      </div>

      {/* Visual Cards Grid in Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#7A7875]">
            Memuat daftar visual paket fotografi...
          </div>
        ) : packages.filter((p) => statusFilter === 'ALL' || p.status === statusFilter).length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#7A7875] border border-dashed border-[#242422] p-8">
            {statusFilter === 'ALL'
              ? 'Belum ada paket fotografi yang terdaftar. Klik tombol di atas untuk menambahkan.'
              : `Tidak ada paket dengan status "${statusFilter}".`}
          </div>
        ) : (
          packages
            .filter((p) => statusFilter === 'ALL' || p.status === statusFilter)
            .map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-[#141414] border flex flex-col justify-between overflow-hidden shadow-md transition-all duration-300 ${
                  pkg.status === 'PUBLISHED'
                    ? 'border-[#2B2B28] hover:border-[#C5A880]'
                    : pkg.status === 'DRAFT'
                    ? 'border-[#443311] opacity-85'
                    : 'border-[#222222] opacity-60'
                }`}
              >
                {/* Card Photo Preview */}
                <div className="relative aspect-[4/3] w-full bg-[#111111] overflow-hidden">
                  <Image
                    src={pkg.coverImageUrl}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-transparent" />

                  {/* Status Badge (Draft vs Published vs Archived) */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        pkg.status === 'PUBLISHED'
                          ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/40'
                          : pkg.status === 'DRAFT'
                          ? 'bg-amber-900/90 text-amber-200 border border-amber-500/40'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-600/40'
                      }`}
                    >
                      {pkg.status}
                    </span>
                    {pkg.badgeLabel && (
                      <span className="bg-[#C5A880] text-[#141414] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {pkg.badgeLabel}
                      </span>
                    )}
                  </div>

                  {/* Display Order Pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-black/70 text-white/80 px-2 py-0.5 text-[9px] font-mono border border-white/20">
                      Urutan #{pkg.displayOrder || 1}
                    </span>
                  </div>

                  {/* Category Pill */}
                  {pkg.category && (
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="text-[9px] uppercase tracking-wider text-[#FAF8F5] bg-black/70 px-2 py-0.5 border border-white/10 font-semibold">
                        {pkg.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body Info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4 font-sans">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold">
                          {pkg.tier} Moments
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#FAF8F5] mt-0.5">
                          {pkg.name}
                        </h3>
                      </div>
                    </div>

                    {pkg.shortDesc && (
                      <p className="text-[11px] text-[#8C8984] line-clamp-2 leading-relaxed">
                        {pkg.shortDesc}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="pt-2 pb-3 border-y border-[#242422] flex items-baseline justify-between">
                      <div>
                        <span className="font-serif text-2xl font-bold text-[#FAF8F5]">
                          Rp{pkg.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] text-[#7A7875] ml-1">/ sesi</span>
                      </div>
                      <span className="text-[10px] text-[#C5A880]">{pkg.priceNote}</span>
                    </div>

                    {/* Service Specs summary */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#B3B0A8]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{pkg.durationMinutes} menit</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{pkg.editedPhotoCount} foto edit</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <FolderArchive className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span className="truncate">
                          {pkg.includesOriginalFiles
                            ? 'Termasuk Seluruh File Asli'
                            : 'Hanya Foto Pilihan'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-[#242422] flex items-center justify-between text-xs gap-2">
                    {/* Quick Status Select */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={pkg.status}
                        onChange={(e) =>
                          handleSetStatus(
                            pkg,
                            e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
                          )
                        }
                        className={`text-[10px] uppercase font-semibold px-2 py-1 bg-[#1A1A19] border rounded-none focus:outline-none cursor-pointer ${
                          pkg.status === 'PUBLISHED'
                            ? 'text-emerald-400 border-emerald-900/60'
                            : pkg.status === 'DRAFT'
                            ? 'text-amber-400 border-amber-900/60'
                            : 'text-neutral-400 border-neutral-700'
                        }`}
                        title="Ubah Status Paket"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailPkg(pkg)}
                        className="p-1.5 text-[#B3B0A8] hover:text-[#C5A880] hover:bg-white/5 transition-colors"
                        title="Lihat Detail Lengkap Paket"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(pkg)}
                        className="p-1.5 text-[#B3B0A8] hover:text-[#C5A880] hover:bg-white/5 transition-colors"
                        title="Ubah Paket & Foto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Hapus Paket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#141414] border border-[#2B2B28] max-w-3xl w-full p-4 sm:p-8 shadow-2xl relative space-y-5 sm:space-y-6 text-[#FAF8F5] my-auto max-h-[96vh] sm:max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#242422]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold block">
                  Package Studio Editor
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {editingPkg ? 'Ubah Paket Fotografi' : 'Tambah Paket Fotografi Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#7A7875] hover:text-white"
                aria-label="Tutup form paket"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs - Horizontally scrollable on smartphones */}
            <div className="flex border-b border-[#242422] text-xs font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`py-3 px-4 border-b-2 transition-colors min-h-[44px] shrink-0 ${
                  activeTab === 'info'
                    ? 'border-[#C5A880] text-[#C5A880]'
                    : 'border-transparent text-[#7A7875] hover:text-white'
                }`}
              >
                1. Informasi & Foto Cover
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('service')}
                className={`py-3 px-4 border-b-2 transition-colors min-h-[44px] shrink-0 ${
                  activeTab === 'service'
                    ? 'border-[#C5A880] text-[#C5A880]'
                    : 'border-transparent text-[#7A7875] hover:text-white'
                }`}
              >
                2. Detail & Layanan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('display')}
                className={`py-3 px-4 border-b-2 transition-colors min-h-[44px] shrink-0 ${
                  activeTab === 'display'
                    ? 'border-[#C5A880] text-[#C5A880]'
                    : 'border-transparent text-[#7A7875] hover:text-white'
                }`}
              >
                3. Tampilan & Visibilitas
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
              {/* TAB 1: INFORMASI UTAMA & FOTO COVER */}
              {activeTab === 'info' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Nama Paket *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Signature Moments"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Slug URL (Otomatis jika kosong)
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="signature-moments"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Kategori Fotografi *
                      </label>
                      <input
                        type="text"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Contoh: Portrait, Graduation, Couple"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Tier Paket *
                      </label>
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Signature">Signature</option>
                        <option value="Exclusive">Exclusive</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Harga (IDR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="10000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  {/* FOTO COVER DENGAN PREVIEW & UPLOAD */}
                  <div className="p-4 bg-[#181817] border border-[#2B2B28] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        Foto Cover Fotografi Utama *
                      </span>
                      <span className="text-[10px] text-[#7A7875]">Rasio 4:3 disarankan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                      {/* Visual Preview */}
                      <div className="relative aspect-[4/3] w-full bg-[#111111] border border-[#2E2E2C] overflow-hidden">
                        {coverImageUrl ? (
                          <Image
                            src={coverImageUrl}
                            alt="Cover preview"
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#7A7875] text-[10px] p-2 text-center">
                            <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                            Belum ada foto cover
                          </div>
                        )}
                      </div>

                      {/* URL input & Upload actions */}
                      <div className="sm:col-span-2 space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#B3B0A8] mb-1">
                            URL Gambar Langsung:
                          </label>
                          <input
                            type="url"
                            required
                            value={coverImageUrl}
                            onChange={(e) => setCoverImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-[#111111] border border-[#2E2E2C] p-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                          />
                        </div>

                        {/* File Upload Button */}
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider transition-colors disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                            <span>{uploadingImage ? 'Mengunggah...' : 'Upload File Gambar'}</span>
                          </button>
                          <span className="text-[10px] text-[#7A7875]">
                            Maks. 10MB (JPG, PNG, WEBP)
                          </span>
                        </div>

                        {/* Presets Quick Picker */}
                        <div className="pt-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#7A7875] block mb-1.5">
                            Atau Pilih Preset Gambar Fotografi:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_COVERS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setCoverImageUrl(preset.url)}
                                className={`text-[9px] px-2 py-1 border transition-colors ${
                                  coverImageUrl === preset.url
                                    ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/10'
                                    : 'border-[#2B2B28] text-[#8C8984] hover:text-white'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                      Deskripsi Singkat (Tampil di Card Publik)
                    </label>
                    <input
                      type="text"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Sesi potret esensial berkarakter untuk profil profesional atau wisuda solo."
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                      Deskripsi Lengkap (Tampil di Modal Detail)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Rincian pengalaman sesi fotografi, arahan gaya, dan kenyamanan pemotretan..."
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                      Galeri Foto Tambahan (1 baris per URL gambar)
                    </label>
                    <textarea
                      rows={2}
                      value={galleryImagesText}
                      onChange={(e) => setGalleryImagesText(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: DETAIL LAYANAN & SPESIFIKASI */}
              {activeTab === 'service' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Durasi Sesi (Menit) *
                      </label>
                      <input
                        type="number"
                        required
                        min="10"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Jumlah Foto Diedit (Retouch) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={editedPhotoCount}
                        onChange={(e) => setEditedPhotoCount(Number(e.target.value))}
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Format File Hasil Akhir
                      </label>
                      <input
                        type="text"
                        value={deliveryFormats}
                        onChange={(e) => setDeliveryFormats(e.target.value)}
                        placeholder="JPEG Resolusi Tinggi"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  {/* Pengaturan Penyerahan File Foto Asli */}
                  <div className="p-4 bg-[#181817] border border-[#2B2B28] space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesOriginalFiles}
                        onChange={(e) => setIncludesOriginalFiles(e.target.checked)}
                        className="accent-[#C5A880] w-4 h-4"
                      />
                      <span className="font-semibold text-white">
                        Seluruh file foto asli (original) diberikan kepada pelanggan
                      </span>
                    </label>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1">
                        Rincian Penyerahan File Asli / RAW:
                      </label>
                      <input
                        type="text"
                        value={originalFileDeliveryDetails}
                        onChange={(e) => setOriginalFileDeliveryDetails(e.target.value)}
                        placeholder="Contoh: Seluruh file original JPEG via Google Drive atau 10 Master edit beresolusi penuh"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Jumlah Outfit
                      </label>
                      <input
                        type="text"
                        value={outfitCount}
                        onChange={(e) => setOutfitCount(e.target.value)}
                        placeholder="1-2 Outfit"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Jumlah Konsep
                      </label>
                      <input
                        type="text"
                        value={conceptCount}
                        onChange={(e) => setConceptCount(e.target.value)}
                        placeholder="1-2 Konsep"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Lokasi / Spot *
                      </label>
                      <input
                        type="text"
                        required
                        value={locationCount}
                        onChange={(e) => setLocationCount(e.target.value)}
                        placeholder="1-2 Spot Berdekatan"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Estimasi Penyerahan
                      </label>
                      <input
                        type="text"
                        value={deliveryEstimate}
                        onChange={(e) => setDeliveryEstimate(e.target.value)}
                        placeholder="5–7 Hari Kerja"
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                      Daftar Benefit & Fasilitas (1 baris per benefit) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={benefitsText}
                      onChange={(e) => setBenefitsText(e.target.value)}
                      placeholder="60 Menit sesi pemotretan santai & leluasa&#10;10 Foto pilihan dengan signature editorial retouch&#10;Akses galeri digital privat selama 90 hari"
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                      Ketentuan Reservasi & Biaya Tambahan
                    </label>
                    <textarea
                      rows={2}
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      placeholder="DP 30% untuk mengunci jadwal pemotretan. Reschedule 1x gratis minimal H-3 sebelum sesi."
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PENGATURAN TAMPILAN & VISIBILITAS */}
              {activeTab === 'display' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Status Publikasi *
                      </label>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(
                            e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
                          )
                        }
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="PUBLISHED">PUBLISHED (Tampil di Website Publik)</option>
                        <option value="DRAFT">DRAFT (Draft Belum Siap Rilis)</option>
                        <option value="ARCHIVED">ARCHIVED (Diarsipkan / Tidak Tampil)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Badge Label Opsional
                      </label>
                      <select
                        value={badgeLabel}
                        onChange={(e) => setBadgeLabel(e.target.value)}
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="">Tanpa Badge</option>
                        <option value="BEST SELLER">BEST SELLER</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="REKOMENDASI">REKOMENDASI</option>
                        <option value="LIMITED">LIMITED SLOT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                        Urutan Tampilan Card *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(Number(e.target.value))}
                        className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                      Catatan Tambahan Harga (Opsional)
                    </label>
                    <input
                      type="text"
                      value={priceNote}
                      onChange={(e) => setPriceNote(e.target.value)}
                      placeholder="Contoh: Paling diminati pelanggan atau Estimasi awal"
                      className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="p-4 bg-[#181817] border border-[#2B2B28] space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="accent-[#C5A880] w-4 h-4"
                      />
                      <div>
                        <span className="font-semibold text-white block">Tampilkan sebagai Featured Package</span>
                        <span className="text-[10px] text-[#7A7875]">Paket akan disorot di Beranda dan Halaman Paket</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                        className="accent-[#C5A880] w-4 h-4"
                      />
                      <div>
                        <span className="font-semibold text-white block">Tandai Sebagai Paket Terpopuler</span>
                        <span className="text-[10px] text-[#7A7875]">Memberikan penekanan visual khusus</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="accent-[#C5A880] w-4 h-4"
                      />
                      <div>
                        <span className="font-semibold text-white block">Paket Aktif</span>
                        <span className="text-[10px] text-[#7A7875]">Dapat dipesan melalui formulir booking</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-[#242422]">
                <div className="flex items-center gap-2">
                  {activeTab !== 'info' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(activeTab === 'display' ? 'service' : 'info')
                      }
                      className="flex-1 sm:flex-none px-4 py-2.5 border border-[#2B2B28] text-xs uppercase tracking-wider text-[#999690] hover:text-white min-h-[44px] flex items-center justify-center"
                    >
                      ← Sebelumnya
                    </button>
                  )}
                  {activeTab !== 'display' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(activeTab === 'info' ? 'service' : 'display')
                      }
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-xs uppercase tracking-wider text-white min-h-[44px] flex items-center justify-center"
                    >
                      Selanjutnya →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 border border-[#2B2B28] text-xs uppercase tracking-wider hover:bg-white/5 min-h-[44px] flex items-center justify-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] font-semibold text-xs uppercase tracking-wider shadow-sm disabled:opacity-50 min-h-[44px] flex items-center justify-center"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Paket'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Preview Modal */}
      {detailPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#141414] border border-[#2B2B28] max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative space-y-5 text-[#FAF8F5] my-auto max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#242422]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold block">
                  Detail Paket Fotografi
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {detailPkg.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailPkg(null)}
                className="w-10 h-10 flex items-center justify-center text-[#7A7875] hover:text-white"
                aria-label="Tutup detail paket"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cover Image & Badges */}
            <div className="relative aspect-[16/9] w-full bg-[#111111] overflow-hidden border border-[#2E2E2C]">
              <Image
                src={detailPkg.coverImageUrl}
                alt={detailPkg.name}
                fill
                sizes="600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    detailPkg.status === 'PUBLISHED'
                      ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-500/40'
                      : detailPkg.status === 'DRAFT'
                      ? 'bg-amber-900/90 text-amber-200 border border-amber-500/40'
                      : 'bg-neutral-800 text-neutral-300 border border-neutral-600/40'
                  }`}
                >
                  {detailPkg.status}
                </span>
                {detailPkg.badgeLabel && (
                  <span className="bg-[#C5A880] text-[#141414] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    {detailPkg.badgeLabel}
                  </span>
                )}
                <span className="bg-black/80 text-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                  {detailPkg.tier}
                </span>
              </div>
            </div>

            {/* Price & Summary */}
            <div className="flex items-baseline justify-between p-3.5 bg-[#181817] border border-[#242422]">
              <div>
                <span className="font-serif text-2xl font-bold text-[#FAF8F5]">
                  Rp{detailPkg.price.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-[#7A7875] ml-1.5">/ sesi</span>
              </div>
              <span className="text-xs text-[#C5A880] font-medium">
                {detailPkg.priceNote}
              </span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#111111] border border-[#242422]">
                <span className="text-[10px] uppercase text-[#7A7875] block">Durasi Sesi</span>
                <span className="font-semibold text-white mt-0.5 block">{detailPkg.durationMinutes} Menit</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#242422]">
                <span className="text-[10px] uppercase text-[#7A7875] block">Foto Diedit</span>
                <span className="font-semibold text-white mt-0.5 block">{detailPkg.editedPhotoCount} Master Foto</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#242422]">
                <span className="text-[10px] uppercase text-[#7A7875] block">File Asli (Original)</span>
                <span className="font-semibold text-white mt-0.5 block">
                  {detailPkg.includesOriginalFiles ? 'Termasuk Diberikan' : 'Hanya Foto Terpilih'}
                </span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#242422]">
                <span className="text-[10px] uppercase text-[#7A7875] block">Lokasi & Spot</span>
                <span className="font-semibold text-white mt-0.5 block">{detailPkg.locationCount}</span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#242422]">
                <span className="text-[10px] uppercase text-[#7A7875] block">Outfit & Konsep</span>
                <span className="font-semibold text-white mt-0.5 block">
                  {detailPkg.outfitCount || '-'} • {detailPkg.conceptCount || '-'}
                </span>
              </div>
              <div className="p-3 bg-[#111111] border border-[#242422]">
                <span className="text-[10px] uppercase text-[#7A7875] block">Estimasi Hasil</span>
                <span className="font-semibold text-white mt-0.5 block">{detailPkg.deliveryEstimate}</span>
              </div>
            </div>

            {/* Description */}
            {(detailPkg.description || detailPkg.shortDesc) && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#B3B0A8] tracking-wider block">
                  Deskripsi Paket
                </span>
                <p className="text-xs text-[#999690] leading-relaxed">
                  {detailPkg.description || detailPkg.shortDesc}
                </p>
              </div>
            )}

            {/* Benefits */}
            {Array.isArray(detailPkg.benefits) && detailPkg.benefits.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#B3B0A8] tracking-wider block">
                  Fasilitas & Benefit yang Didapat
                </span>
                <div className="space-y-1.5 bg-[#111111] p-3 border border-[#242422]">
                  {detailPkg.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#E5E2DC]">
                      <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms */}
            {detailPkg.terms && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#B3B0A8] tracking-wider block">
                  Ketentuan Reservasi
                </span>
                <p className="text-[11px] text-[#7A7875] leading-relaxed bg-[#111111] p-2.5 border border-[#242422]">
                  {detailPkg.terms}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#242422] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDetailPkg(null)}
                className="px-4 py-2 border border-[#2B2B28] text-xs uppercase tracking-wider text-[#999690] hover:text-white"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = detailPkg;
                  setDetailPkg(null);
                  openEditModal(target);
                }}
                className="px-5 py-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] font-semibold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Ubah Paket Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
