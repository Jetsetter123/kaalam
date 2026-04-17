import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Kaalaman | Bilingual Study Intelligence',
  description:
    'Professional bilingual study workspace for document-driven learning. Upload notes, ask in English or Tagalog, and generate summaries, quizzes, explanations, and translations from one interface.',
  keywords: ['study', 'AI', 'Philippine', 'Tagalog', 'education', 'learning'],
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Kaalaman',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Kaalaman | Bilingual Study Intelligence',
    description: 'Document-aware study assistance for English and Tagalog learning workflows.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#050505',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
