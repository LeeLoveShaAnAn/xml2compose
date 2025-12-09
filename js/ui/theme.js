/**
 * 主题管理模块
 * 处理浅色/深色模式切换，带有圆形涟漪动画效果
 */

export class ThemeManager {
    constructor() {
        if (typeof window === 'undefined') return;
        this.currentTheme = this.getSavedTheme() || this.getSystemTheme();
        this.rippleElement = null;
        this.isAnimating = false;
        this.init();
    }

    /**
     * 初始化主题
     */
    init() {
        if (typeof window === 'undefined') return;

        // 应用保存的主题
        // ...
        this.applyTheme(this.currentTheme, false);

        // 创建涟漪遮罩元素
        this.createRippleElement();

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getSavedTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }

    /**
     * 创建涟漪动画元素
     */
    createRippleElement() {
        this.rippleElement = document.createElement('div');
        this.rippleElement.className = 'theme-ripple-overlay';
        this.rippleElement.innerHTML = `<div class="theme-ripple-circle"></div>`;
        document.body.appendChild(this.rippleElement);
    }

    /**
     * 获取系统主题
     */
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * 获取保存的主题
     */
    getSavedTheme() {
        return localStorage.getItem('xml2compose_theme');
    }

    /**
     * 切换主题
     * @param {Event} event - 点击事件（用于获取动画起点）
     */
    toggle(event) {
        if (this.isAnimating) return;

        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';

        // 获取点击位置作为动画起点
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (event && event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        this.animateTransition(x, y, newTheme);
    }

    /**
     * 执行涟漪动画切换
     */
    animateTransition(x, y, newTheme) {
        this.isAnimating = true;
        const overlay = this.rippleElement;
        const circle = overlay.querySelector('.theme-ripple-circle');

        // 计算需要覆盖整个屏幕的最大半径
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        ) * 2;

        // 设置涟漪颜色（使用目标主题的背景色）
        circle.style.backgroundColor = newTheme === 'dark' ? '#000000' : '#FFFFFF';

        // 设置涟漪位置和大小
        circle.style.left = x + 'px';
        circle.style.top = y + 'px';
        circle.style.width = maxRadius + 'px';
        circle.style.height = maxRadius + 'px';

        // 重置状态
        circle.style.transform = 'translate(-50%, -50%) scale(0)';
        circle.style.opacity = '1';
        overlay.style.visibility = 'visible';

        // 强制重绘
        void circle.offsetWidth;

        // 开始扩散动画
        circle.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        circle.style.transform = 'translate(-50%, -50%) scale(1)';

        // 在涟漪覆盖一半屏幕时切换主题
        setTimeout(() => {
            this.applyTheme(newTheme, true);
        }, 350);

        // 涟漪完全展开后，淡出
        setTimeout(() => {
            circle.style.transition = 'opacity 0.4s ease';
            circle.style.opacity = '0';

            // 淡出完成，重置
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
                circle.style.transform = 'translate(-50%, -50%) scale(0)';
                circle.style.opacity = '1';
                circle.style.transition = '';
                this.isAnimating = false;
            }, 400);
        }, 700);
    }

    /**
     * 应用主题
     */
    applyTheme(theme, save = true) {
        this.currentTheme = theme;

        // 设置 data 属性用于 CSS 选择
        document.documentElement.setAttribute('data-theme', theme);

        // 添加/移除 dark 类 (兼容 Next.js 和 static pages)
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-theme');
        } else {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.classList.remove('dark');
        }

        // 更新 meta theme-color
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = theme === 'dark' ? '#000000' : '#FFFFFF';

        // 更新切换按钮图标
        this.updateToggleButton(theme);

        // 保存偏好
        if (save) {
            localStorage.setItem('xml2compose_theme', theme);
        }

        // 触发事件
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    /**
     * 更新切换按钮状态
     */
    updateToggleButton(theme) {
        const buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(btn => {
            const sunIcon = btn.querySelector('.sun-icon');
            const moonIcon = btn.querySelector('.moon-icon');

            if (sunIcon && moonIcon) {
                if (theme === 'dark') {
                    sunIcon.style.opacity = '0';
                    sunIcon.style.transform = 'rotate(-90deg) scale(0)';
                    moonIcon.style.opacity = '1';
                    moonIcon.style.transform = 'rotate(0) scale(1)';
                } else {
                    sunIcon.style.opacity = '1';
                    sunIcon.style.transform = 'rotate(0) scale(1)';
                    moonIcon.style.opacity = '0';
                    moonIcon.style.transform = 'rotate(90deg) scale(0)';
                }
            }
        });
    }

    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// 添加涟漪动画 CSS
if (typeof window !== 'undefined' && !document.getElementById('theme-ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'theme-ripple-styles';
    style.textContent = `
        /* 涟漪遮罩容器 */
        .theme-ripple-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
            visibility: hidden;
        }
        
        /* 涟漪圆形 */
        .theme-ripple-circle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
        }
        
        /* 主题切换按钮 */
        .theme-toggle-btn {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: transparent;
            border: 1px solid var(--border-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            overflow: hidden;
            margin-left: 8px;
        }
        
        .theme-toggle-btn:hover {
            background: var(--bg-secondary);
            border-color: var(--primary-color);
            transform: scale(1.1);
        }
        
        .theme-toggle-btn:active {
            transform: scale(0.95);
        }
        
        /* 太阳/月亮图标 */
        .theme-toggle-btn .sun-icon,
        .theme-toggle-btn .moon-icon {
            position: absolute;
            width: 20px;
            height: 20px;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .theme-toggle-btn .sun-icon {
            color: #FF9500;
        }
        
        .theme-toggle-btn .moon-icon {
            color: #5E5CE6;
        }
        
        /* 太阳光线动画 */
        .theme-toggle-btn:hover .sun-icon {
            animation: sunPulse 0.6s ease;
        }
        
        @keyframes sunPulse {
            0%, 100% { filter: drop-shadow(0 0 0 rgba(255, 149, 0, 0)); }
            50% { filter: drop-shadow(0 0 10px rgba(255, 149, 0, 0.8)); }
        }
        
        /* 月亮闪烁动画 */
        .theme-toggle-btn:hover .moon-icon {
            animation: moonGlow 0.6s ease;
        }
        
        @keyframes moonGlow {
            0%, 100% { filter: drop-shadow(0 0 0 rgba(94, 92, 230, 0)); }
            50% { filter: drop-shadow(0 0 10px rgba(94, 92, 230, 0.8)); }
        }
    `;
    document.head.appendChild(style);
}

// 创建全局实例
export const themeManager = new ThemeManager();

