import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { AppProvider } from '../lib/contexts/AppContext';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://xml2compose.dev'),
  title: {
    default: 'xml2compose.dev | Convert Android XML to Jetpack Compose',
    template: '%s | xml2compose.dev',
  },
  description:
    'The ultimate tool for developers to automatically convert Android XML layout files into clean, modern Jetpack Compose code.',
  keywords: ['Android', 'XML', 'Jetpack Compose', 'Converter', 'UI', 'Layout', 'Tool', 'Migration', 'Kotlin', 'Android Development'],
  authors: [{ name: 'xml2compose.dev', url: 'https://xml2compose.dev' }],
  creator: 'xml2compose.dev',
  publisher: 'xml2compose.dev',
  openGraph: {
    title: 'xml2compose.dev | Convert Android XML to Jetpack Compose',
    description: 'Automatically convert Android XML layouts to Jetpack Compose code. Try it now!',
    url: 'https://xml2compose.dev',
    siteName: 'xml2compose.dev',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'xml2compose - Convert Android XML to Jetpack Compose',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xml2compose.dev | Convert Android XML to Jetpack Compose',
    description: 'Automatically convert Android XML layouts to Jetpack Compose code.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F2G7TSB6Q6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F2G7TSB6Q6');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2819959179592334"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <AppProvider>
          <SiteHeader />
          <main id="home">
            {children}
          </main>
          <SiteFooter />
        </AppProvider>
      </body>
    </html>
  );
}
