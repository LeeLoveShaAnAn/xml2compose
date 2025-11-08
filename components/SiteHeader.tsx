'use client';

import Link from 'next/link';
import { useApp } from '../lib/contexts/AppContext';

export function SiteHeader() {
  const { language, setLanguage, t, theme, setTheme, actualTheme } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'system') return '⚙️';
    return actualTheme === 'dark' ? '🌙' : '☀️';
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
            <li><a href="#faq">{t('nav.faq')}</a></li>
          </ul>
        </nav>
        <div className="header-controls">
          <button 
            onClick={cycleTheme}
            className="theme-toggle"
            title={`${t('theme.light')} / ${t('theme.dark')} / ${t('theme.system')}`}
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
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
