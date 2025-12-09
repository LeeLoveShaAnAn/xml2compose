'use client';

import Link from 'next/link';
import { useApp } from '../lib/contexts/AppContext';
import { useThemeAnimation } from '../lib/hooks/useThemeAnimation';

export function SiteHeader() {
  const { language, setLanguage, t } = useApp();
  const { toggleTheme } = useThemeAnimation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          <div className="logo-text">
            <Link href="/">xml2compose.dev</Link>
          </div>
        </div>
        <nav>
          <ul>
            <li><Link href="/">{t('nav.home')}</Link></li>
            <li><Link href="/converter">{t('nav.converter')}</Link></li>
            <li><Link href="/blog">{t('nav.blog')}</Link></li>
            <li><a href="/#faq">{t('nav.faq')}</a></li>
          </ul>
        </nav>
        <div className="header-controls">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={t('theme.toggle') || "Toggle theme"}
            aria-label="Toggle theme"
            style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg className="moon-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <div className="lang-switch">
            <button
              onClick={toggleLanguage}
              className={language === 'en' ? 'active' : ''}
            >
              EN
            </button>
            <button
              onClick={toggleLanguage}
              className={language === 'zh' ? 'active' : ''}
            >
              中文
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
