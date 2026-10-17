'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdmin } from '@/lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@momenpotrait.com');
  const [password, setPassword] = useState('momenadmin2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginAdmin(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#FAF8F5] flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Editorial subtle pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative w-full max-w-md z-10">
        {/* Brand Wordmark */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#FAF8F5] group-hover:text-[#C5A880] transition-colors uppercase">
              MOMEN<span className="text-[#C5A880]">.</span>POTRAIT
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#876E49] block mt-1 font-semibold">
              Admin & Editorial Console
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#181817] border border-[#2B2B28] p-5 sm:p-10 shadow-2xl relative">
          <div className="flex items-center gap-2.5 text-[#C5A880] mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-[#2B2B28]">
            <Lock className="w-4 h-4" />
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#FAF8F5]">
              Autentikasi Pengelola Studio
            </h2>
          </div>

          {error && (
            <div className="mb-5 sm:mb-6 p-3.5 bg-red-950/60 border-l-4 border-red-500 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#B3B0A8] mb-1.5 sm:mb-2">
                Email Pengelola
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7A7875]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@momenpotrait.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#2E2E2C] text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A880] transition-colors min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#B3B0A8] mb-1.5 sm:mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7A7875]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#2E2E2C] text-sm text-[#FAF8F5] focus:outline-none focus:border-[#C5A880] transition-colors min-h-[44px]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#DFCA9B] text-[#141414] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-md min-h-[44px]"
              >
                {loading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Seed credentials notice */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-[#262624] text-[11px] text-[#7A7875] leading-relaxed">
            <span className="text-[#C5A880] font-medium block mb-1">
              Kredensial Default Development:
            </span>
            <p>Email: <code className="text-[#FAF8F5]">admin@momenpotrait.com</code></p>
            <p>Password: <code className="text-[#FAF8F5]">momenadmin2026</code></p>
          </div>
        </div>

        <div className="text-center mt-5 sm:mt-6">
          <Link
            href="/"
            className="text-xs text-[#7A7875] hover:text-[#C5A880] transition-colors uppercase tracking-wider min-h-[44px] inline-flex items-center justify-center"
          >
            ← Kembali ke Website Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
