'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '../i18n/translations';

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// Context 类型定义
interface AppContextType {
  // 语言
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;

  // 主题
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // 实际应用的主题（解析system后）
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 本地存储的键名
const STORAGE_KEYS = {
  LANGUAGE: 'xml2compose_language',
  THEME: 'xml2compose_theme',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('light');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // 初始化语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguageState(savedLanguage);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        setLanguageState('zh');
      }
    }
  }, []);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setThemeState(savedTheme);
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 监听 theme.js 触发的变更事件
    const handleThemeChange = (e: CustomEvent<{ theme: Theme }>) => {
      if (e.detail && e.detail.theme && e.detail.theme !== theme) {
        setThemeState(e.detail.theme);
        // theme.js 已经更新了 localStorage，这里只同步状态
      }
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    const updateActualTheme = () => {
      if (theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setActualTheme(theme as 'light' | 'dark');
      }
    };

    updateActualTheme();

    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setActualTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, [theme]);

  // 应用主题到document
  useEffect(() => {
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [actualTheme]);

  // 设置语言
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  // 翻译函数
  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text: string = translations[language][key] || translations.en[key] || key;

    // 替换参数
    if (params) {
      Object.keys(params).forEach(paramKey => {
        text = text.replace(`{{${paramKey}}}`, String(params[paramKey]));
      });
    }

    return text;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        actualTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook 使用 Context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

