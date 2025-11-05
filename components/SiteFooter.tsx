import Link from 'next/link';

const footerLinks = {
  产品: [
    { href: '/converter', label: '转换器功能' },
    { href: '/blog', label: '迁移指南' },
    { href: '/about', label: '团队介绍' },
  ],
  合规: [
    { href: '/privacy', label: '隐私政策' },
    { href: '/privacy#data-usage', label: '数据使用说明' },
    { href: '/privacy#contact', label: '联系我们' },
  ],
  资源: [
    { href: 'https://developer.android.com/jetpack/compose', label: 'Jetpack Compose 文档' },
    { href: 'https://nextjs.org/docs', label: 'Next.js 文档' },
    { href: '/sitemap.xml', label: '站点地图' },
  ],
};

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">
      <div className="container">
        <h2 id="footer-heading" className="sr-only">
          网站页脚
        </h2>
        <div className="footer-grid">
          {Object.entries(footerLinks).map(([section, links]) => (
            <section key={section} aria-label={section}>
              <h4>{section}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                {links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} xml2compose.dev. 保留所有权利。</span>
          <div className="pill-list">
            <span>版本 2.0 · Next.js 14</span>
            <span>MIT License</span>
            <span>内容最后更新：{currentYear}年</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

