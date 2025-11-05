import Link from 'next/link';

const navLinks = [
  { href: '/', label: '主页' },
  { href: '/converter', label: '在线转换器' },
  { href: '/blog', label: '博客' },
  { href: '/about', label: '关于我们' },
  { href: '/privacy', label: '隐私政策' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <nav aria-label="主导航">
          <Link className="brand" href="/">
            xml2compose.dev
          </Link>
          <div className="nav-links" role="list">
            {navLinks.map((link) => (
              <Link key={link.href} className="nav-link" href={link.href} role="listitem">
                {link.label}
              </Link>
            ))}
            <Link className="cta-button" href="/converter">
              免费开始转换
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

