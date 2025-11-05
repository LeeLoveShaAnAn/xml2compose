/**
 * 国际化核心模块
 * 处理多语言切换和翻译
 */

import enTranslations from './en.js';
import zhTranslations from './zh.js';

export class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('xml2compose_lang') || 'en';
        this.translations = {
            en: enTranslations,
            zh: zhTranslations
        };
    }
    
    /**
     * 设置语言
     * @param {string} lang - 语言代码（en/zh）
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('xml2compose_lang', lang);
            this.updateUI();
            
            // 更新html lang属性
            document.documentElement.lang = lang;
            
            // 触发语言切换事件
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        }
    }
    
    /**
     * 获取翻译文本
     * @param {string} key - 翻译键
     * @param {Object} params - 参数对象（用于插值）
     * @returns {string} 翻译后的文本
     */
    t(key, params = {}) {
        let text = this.translations[this.currentLang]?.[key] || key;
        
        // 处理参数插值
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    /**
     * 更新UI中的所有翻译
     */
    updateUI() {
        // 更新所有带有data-i18n属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        });
        
        // 更新placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        });
        
        // 更新title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = this.t(key);
        });
        
        // 更新aria-label
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.dataset.i18nAria;
            el.setAttribute('aria-label', this.t(key));
        });
    }
    
    /**
     * 获取当前语言
     * @returns {string} 当前语言代码
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    /**
     * 获取可用语言列表
     * @returns {Array} 语言列表
     */
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English' },
            { code: 'zh', name: '中文' }
        ];
    }
}

// 创建全局i18n实例
export const i18n = new I18n();

