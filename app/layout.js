import { Inter, Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-zoho',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.pibiopenintelligence.com'),
  title: {
    default: 'PIBI Open Intelligence — Madurai AI Community',
    template: '%s | PIBI Open Intelligence',
  },
  description:
    'Discover, submit, and showcase open-source AI resources — MCP servers, datasets, RAG templates, prompt libraries, and more. Built by PiBi Foundation for the Madurai AI Community.',
  keywords: ['AI', 'open source', 'MCP', 'RAG', 'datasets', 'Madurai', 'PiBi Foundation'],
  openGraph: {
    title: 'PIBI Open Intelligence — Madurai AI Community',
    description: 'Community platform for open-source AI resources',
    url: 'https://www.pibiopenintelligence.com',
    siteName: 'PIBI Open Intelligence',
    images: [{ url: '/pii.webp', width: 264, height: 264, alt: 'PIBI Open Intelligence' }],
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/pii.webp', type: 'image/webp' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
};

import ScrollToTop from '../components/ScrollToTop';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.pibiopenintelligence.com/#website',
      url: 'https://www.pibiopenintelligence.com',
      name: 'PIBI Open Intelligence',
      alternateName: ['PiBi Open Intelligence', 'Open Intelligence Hub'],
      publisher: {
        '@id': 'https://www.pibiopenintelligence.com/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.pibiopenintelligence.com/#organization',
      name: 'PIBI Open Intelligence',
      url: 'https://www.pibiopenintelligence.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pibiopenintelligence.com/pii.webp',
        width: 264,
        height: 264,
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakarta.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
        <ScrollToTop />
      </body>
    </html>
  );
}
