import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://momenpotrait.com'),
  title: {
    default: 'MOMEN.POTRAIT — Every Moment Tells a Story',
    template: '%s | MOMEN.POTRAIT',
  },
  description:
    'Studio fotografi profesional dengan estetika editorial, hangat, dan abadi. Melayani Personal Portrait, Graduation, Couple, Prewedding, Wedding, Event, dan Commercial Photography.',
  keywords: [
    'fotografer profesional',
    'jasa foto wisuda',
    'foto prewedding jakarta',
    'wedding photography indonesia',
    'portrait photographer',
    'momen potrait',
  ],
  authors: [{ name: 'MOMEN.POTRAIT Studio' }],
  openGraph: {
    title: 'MOMEN.POTRAIT — Every Moment Tells a Story',
    description:
      'Dokumentasi momen berharga dengan pendekatan editorial yang artistik, tulus, dan bernilai abadi.',
    url: 'https://momenpotrait.com',
    siteName: 'MOMEN.POTRAIT',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MOMEN.POTRAIT Photography Editorial',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141414] antialiased selection:bg-[#C5A880] selection:text-white">
        {children}
      </body>
    </html>
  );
}
