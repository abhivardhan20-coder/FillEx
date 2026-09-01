import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  description: 'Multi-agent financial intelligence that turns market signals, filings, and portfolio risk into transparent, profile-aware insights.',
  openGraph: {
    title: 'FillEx — Explainable portfolio intelligence',
    description: 'Market signals, official filings, and portfolio risk — synthesized transparently.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'FillEx explainable portfolio intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FillEx — Explainable portfolio intelligence',
    description: 'Market signals, official filings, and portfolio risk — synthesized transparently.',
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
        {children}
      </body>
    </html>
  );
}
