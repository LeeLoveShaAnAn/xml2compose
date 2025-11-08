import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { AppProvider } from '../lib/contexts/AppContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'xml2compose.dev | Convert Android XML to Jetpack Compose',
    template: '%s | xml2compose.dev',
  },
  description:
    'The ultimate tool for developers to automatically convert Android XML layout files into clean, modern Jetpack Compose code.',
  keywords: ['Android', 'XML', 'Jetpack Compose', 'Converter', 'UI', 'Layout', 'Tool', 'Migration'],
  authors: [{ name: 'xml2compose.dev' }],
  openGraph: {
    title: 'xml2compose.dev | Convert Android XML to Jetpack Compose',
    description: 'Automatically convert Android XML layouts to Jetpack Compose code. Try it now!',
    url: 'https://xml2compose.dev',
    siteName: 'xml2compose.dev',
    type: 'website',
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
