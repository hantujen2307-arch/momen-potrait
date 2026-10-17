'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
} from 'lucide-react';
import {
  getAdminUser,
  changeAdminPassword,
  updateAdminProfile,
  removeAdminToken,
} from '@/lib/admin-api';

export default function AdminAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Profile Form
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getAdminUser();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name || '');
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const updated = await updateAdminProfile(name);
      setUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Gagal memperbarui profil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setSavingPassword(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Gagal mengubah kata sandi');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    router.push('/admin/login');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#242422]">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
            Security & Profile
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] mt-1">
            Pengaturan Akun Pengelola
          </h1>
          <p className="text-xs text-[#7A7875] mt-1 font-sans">
            Kelola identitas profil admin, kredensial autentikasi, dan keamanan akses dashboard MOMEN.POTRAIT.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 border border-red-900/50 hover:bg-red-950/40 text-red-300 text-xs uppercase tracking-wider px-4 py-2 transition-colors min-h-[44px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar dari Akun</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card & Form */}
        <div className="bg-[#141414] border border-[#242422] p-6 space-y-6">
          <div className="flex items-center gap-2.5 text-[#C5A880] pb-3 border-b border-[#242422]">
            <User className="w-4 h-4" />
            <h2 className="font-serif text-lg font-bold text-[#FAF8F5]">
              Profil Pengelola
            </h2>
          </div>

          {profileSuccess && (
            <div className="p-3.5 bg-green-950/60 border-l-4 border-green-500 text-green-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>Nama profil berhasil diperbarui.</span>
            </div>
          )}

          {profileError && (
            <div className="p-3.5 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Alamat Email (Akun Tetap)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'admin@momenpotrait.com'}
                className="w-full bg-[#181817] border border-[#262624] p-3 text-xs text-[#7A7875] cursor-not-allowed min-h-[44px]"
              />
              <span className="text-[10px] text-[#7A7875] mt-1 block">
                Email pengelola utama terdaftar di sistem.
              </span>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Nama Tampilan Admin *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Momen Editorial Admin"
                className="w-full bg-[#111111] border border-[#2E2E2C] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Menyimpan...' : 'Perbarui Nama Profil'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card & Form */}
        <div className="bg-[#141414] border border-[#242422] p-6 space-y-6">
          <div className="flex items-center gap-2.5 text-[#C5A880] pb-3 border-b border-[#242422]">
            <Lock className="w-4 h-4" />
            <h2 className="font-serif text-lg font-bold text-[#FAF8F5]">
              Ganti Kata Sandi
            </h2>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 bg-green-950/60 border-l-4 border-green-500 text-green-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>Kata sandi berhasil diubah dan tersimpan dengan aman (bcrypt hashed).</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Kata Sandi Saat Ini *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Kata Sandi Baru * (Min. 6 Karakter)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-[10px] font-semibold text-[#B3B0A8] mb-1.5">
                Konfirmasi Kata Sandi Baru *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#7A7875]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-[#2E2E2C] pl-10 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-3 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md min-h-[44px] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingPassword ? 'Memperbarui...' : 'Simpan Kata Sandi Baru'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
