'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck2,
  Package,
  Image as ImageIcon,
  Sparkles,
  PhoneCall,
  FileEdit,
  ShieldCheck,
  MessageSquareQuote,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
} from 'lucide-react';
import { getAdminToken, getAdminUser, removeAdminToken } from '@/lib/admin-api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname === '/admin/login') return;

    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    const currentUser = getAdminUser();
    setUser(currentUser);
  }, [pathname, router]);

  const handleLogout = () => {
    removeAdminToken();
    router.push('/admin/login');
  };

  // If on login page, render children directly without dashboard sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-xs text-[#7A7875]">
        Memuat konsol admin...
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Paket Fotografi', href: '/admin/packages', icon: Package },
    { name: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
    { name: 'Testimoni Klien', href: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Konten Homepage', href: '/admin/homepage', icon: FileEdit },
    { name: 'Informasi Brand', href: '/admin/brand', icon: Sparkles },
    { name: 'Kontak & Medsos', href: '/admin/contact', icon: PhoneCall },
    { name: 'Daftar Booking', href: '/admin/bookings', icon: CalendarCheck2 },
    { name: 'Pengaturan Akun', href: '/admin/account', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0D] text-[#FAF8F5] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-[#141414] border-b border-[#242422] z-30 sticky top-0">
        <Link href="/admin" className="font-serif text-lg font-bold tracking-wider uppercase flex items-center min-h-[44px]">
          MOMEN<span className="text-[#C5A880]">.</span>ADMIN
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#FAF8F5] active:bg-white/10 transition-colors"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-[#141414] border-r border-[#242422] flex flex-col justify-between p-6 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Brand Wordmark */}
          <div>
            <Link href="/admin" className="block group">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#FAF8F5] group-hover:text-[#C5A880] transition-colors uppercase">
                MOMEN<span className="text-[#C5A880]">.</span>POTRAIT
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#876E49] block mt-0.5 font-semibold">
                Studio Management
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] text-xs font-medium tracking-wide uppercase transition-colors rounded-none ${
                    isActive
                      ? 'bg-[#C5A880] text-[#141414] font-semibold shadow-sm'
                      : 'text-[#999690] hover:text-[#FAF8F5] hover:bg-[#1D1D1C]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with user profile & logout */}
        <div className="pt-6 border-t border-[#242422] space-y-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-[#999690] hover:text-[#FAF8F5] transition-colors min-h-[44px] py-1"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Lihat Website</span>
            </span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#242422] border border-[#333330] flex items-center justify-center text-[#C5A880]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-semibold block truncate max-w-[100px]">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-[9px] text-[#7A7875]">Logged In</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar"
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#7A7875] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
