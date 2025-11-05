import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xml2compose.dev'),
  title: {
    default: 'xml2compose.dev | Android XML 转 Compose 最佳实践',
    template: '%s | xml2compose.dev',
  },
  description:
    'xml2compose.dev 提供一站式 Android XML 布局迁移服务，涵盖自动转换、最佳实践指南、性能优化以及团队培训资源。',
  keywords: [
    'Jetpack Compose',
    'Android XML 转换',
    'Compose Migration',
    'Next.js 14',
    'SSR',
    '开发工具',
  ],
  authors: [{ name: 'xml2compose.dev Team', url: 'https://www.xml2compose.dev/about' }],
  openGraph: {
    title: 'xml2compose.dev | Android XML 转 Compose 最佳实践',
    description:
      '面向移动团队的完整迁移解决方案：自动转换、质量评估、培训和合规支持。',
    url: 'https://www.xml2compose.dev',
    siteName: 'xml2compose.dev',
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.xml2compose.dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <div className="app-shell">
          <SiteHeader />
          <main id="main-content" className="container" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

