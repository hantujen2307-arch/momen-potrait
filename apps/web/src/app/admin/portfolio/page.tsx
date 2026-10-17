'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Search,
  Star,
  ExternalLink,
  RefreshCw,
  X,
  MapPin,
  Calendar,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getAdminPortfolio,
  createAdminPortfolio,
  updateAdminPortfolio,
  deleteAdminPortfolio,
  uploadAdminFile,
} from '@/lib/admin-api';
import { PortfolioItem } from '@/lib/api';

const CATEGORIES = [
  'Portrait',
  'Graduation',
  'Couple',
  'Prewedding',
  'Wedding',
  'Event',
  'Product',
];

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Portrait');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [shootDate, setShootDate] = useState('');
  const [location, setLocation] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAdminPortfolio();
      setItems(data);
    } catch (err) {
      console.error('Error fetching admin portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Portrait');
    setImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80');
    setDescription('');
    setClientName('');
    setShootDate('Oktober 2026');
    setLocation('Studio Jakarta');
    setIsFeatured(false);
    setPublished(true);
    setSortOrder(0);
    setModalOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setImageUrl(item.imageUrl);
    setDescription(item.description || '');
    setClientName(item.clientName || '');
    setShootDate(item.shootDate || '');
    setLocation(item.location || '');
    setIsFeatured(item.isFeatured);
    setPublished(item.published !== false);
    setSortOrder(item.sortOrder || 0);
    setModalOpen(true);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAdminFile(file, 'portfolio');
      setImageUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto');
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePublish = async (item: PortfolioItem) => {
    try {
      const newPublished = item.published === false ? true : false;
      await updateAdminPortfolio(item.id, { published: newPublished });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, published: newPublished } : i)),
      );
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status publikasi');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      category,
      imageUrl,
      description: description || undefined,
      clientName: clientName || undefined,
      shootDate: shootDate || undefined,
      location: location || undefined,
      isFeatured,
      published,
      sortOrder: Number(sortOrder) || 0,
    };

    try {
      if (editingItem) {
        await updateAdminPortfolio(editingItem.id, payload);
      } else {
        await createAdminPortfolio(payload);
      }
      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan karya portofolio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto portofolio ini?')) return;
    try {
      await deleteAdminPortfolio(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus karya');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || (item.clientName && item.clientName.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Curated Visual Gallery
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Kelola Portofolio
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Total {items.length} karya fotografi aktif di galeri publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            className="p-2 border border-[#2B2B28] text-[#999690] hover:text-white"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Foto Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#C5A880] text-[#141414]'
                  : 'bg-[#181817] text-[#999690] hover:text-white border border-[#262624]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#7A7875]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau klien..."
            className="w-full bg-[#141414] border border-[#242422] pl-9 pr-3 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#7A7875]">
            Memuat koleksi portofolio...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#7A7875]">
            Tidak ada foto yang cocok dengan pencarian atau filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141414] border border-[#242422] overflow-hidden flex flex-col justify-between group hover:border-[#C5A880] transition-colors"
            >
              <div className="relative aspect-[4/5] w-full bg-[#1C1C1B]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-white bg-black/60 px-2 py-0.5 border border-white/10">
                    {item.category}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 border ${
                      item.published !== false
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {item.published !== false ? 'Published' : 'Hidden'}
                  </span>
                </div>
                {item.isFeatured && (
                  <div className="absolute top-2.5 right-2.5 z-10 bg-[#C5A880] text-[#141414] p-1 rounded-full shadow-sm" title="Featured di Homepage">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#FAF8F5] line-clamp-1">
                    {item.title}
                  </h3>
                  {item.clientName && (
                    <span className="text-[11px] text-[#C5A880] block font-sans">
                      {item.clientName}
                    </span>
                  )}
                  {item.location && (
                    <span className="text-[10px] text-[#7A7875] flex items-center gap-1 mt-1">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-[#242422] flex items-center justify-between">
                  <span className="text-[10px] text-[#7A7875]">{item.shootDate || '2026'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      className="p-1.5 text-[#999690] hover:text-white transition-colors"
                      title={item.published !== false ? 'Sembunyikan dari Publik' : 'Publikasikan ke Website'}
                    >
                      {item.published !== false ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-[#999690] hover:text-[#C5A880] transition-colors"
                      title="Ubah Foto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#141414] border border-[#2B2B28] max-w-lg w-full p-4 sm:p-8 shadow-2xl relative space-y-5 sm:space-y-6 text-[#FAF8F5] my-auto max-h-[96vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#242422]">
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {editingItem ? 'Ubah Foto Portofolio' : 'Tambah Foto Portofolio'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#7A7875] hover:text-white"
                aria-label="Tutup form foto portofolio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Judul Foto *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Solitude in Earth Tones"
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                    Nama Klien / Subjek
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Nadia S."
                    className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                  />
                </div>
              </div>

              {/* Photo Upload & URL */}
              <div className="p-3.5 bg-[#181817] border border-[#2B2B28] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="uppercase tracking-wider text-[10px] font-semibold text-[#C5A880]">
                    Foto Portofolio *
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#242422] hover:bg-[#2F2F2C] text-white text-[10px] uppercase font-semibold tracking-wider cursor-pointer border border-[#3A3A36] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{uploading ? 'Mengunggah...' : 'Upload dari File/HP'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="relative w-16 h-20 bg-black shrink-0 border border-[#2B2B28] overflow-hidden">
                    {imageUrl ? (
                      <Image src={imageUrl} alt="Preview" fill sizes="80px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-[#7A7875] text-center p-1">No img</div>
                    )}
                  </div>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau upload"
                    className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                    Tanggal Sesi
                  </label>
                  <input
                    type="text"
                    value={shootDate}
                    onChange={(e) => setShootDate(e.target.value)}
                    placeholder="September 2026"
                    className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                    Lokasi Pemotretan
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Studio Tebet, Jakarta"
                    className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                  Deskripsi / Konsep Singkat
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Potret editorial dengan bayangan tegas dan pencahayaan lembut..."
                  className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-[#2E2E2C] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                  />
                </div>

                <div className="space-y-2 pt-2 sm:pt-4">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="accent-[#C5A880] w-4 h-4"
                    />
                    <span className="text-xs">Publikasikan di Website</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-[#C5A880] w-4 h-4"
                    />
                    <span className="text-xs">Featured di Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-[#242422]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-[#2B2B28] text-xs uppercase tracking-wider hover:bg-white/5 min-h-[44px] flex items-center justify-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] font-semibold text-xs uppercase tracking-wider shadow-sm min-h-[44px] flex items-center justify-center"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
