import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppShell } from '@/components/fillex/app-shell';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'FillEx — Explainable portfolio intelligence',
  description: 'Source-first portfolio intelligence for Indian markets, connecting holdings, market context, and official evidence without fabricated signals.',
  openGraph: {
    title: 'FillEx — Explainable portfolio intelligence',
    description: 'Holdings, market context, and official evidence — connected transparently.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'FillEx explainable portfolio intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FillEx — Explainable portfolio intelligence',
    description: 'Holdings, market context, and official evidence — connected transparently.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
