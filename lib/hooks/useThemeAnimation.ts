'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type Theme = 'light' | 'dark';

interface UseThemeAnimationReturn {
    theme: Theme;
    toggleTheme: (event: React.MouseEvent) => void;
}

/**
 * React Hook for theme management with circular ripple animation
 */
export function useThemeAnimation(): UseThemeAnimationReturn {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);
    const isAnimating = useRef(false);
    const rippleRef = useRef<HTMLDivElement | null>(null);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('xml2compose_theme') as Theme | null;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setTheme(savedTheme);
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(systemDark ? 'dark' : 'light');
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark', 'dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.remove('dark', 'dark-theme');
            root.classList.add('light-theme');
        }
        root.setAttribute('data-theme', theme);

        // Update meta theme-color
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.setAttribute('name', 'theme-color');
            document.head.appendChild(metaTheme);
        }
        metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#FFFFFF');
    }, [theme, mounted]);

    // Create ripple overlay element
    useEffect(() => {
        if (!mounted) return;

        // Check if ripple element already exists
        let ripple = document.getElementById('theme-ripple-overlay') as HTMLDivElement | null;
        if (!ripple) {
            ripple = document.createElement('div');
            ripple.id = 'theme-ripple-overlay';
            ripple.innerHTML = '<div class="theme-ripple-circle"></div>';
            ripple.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
        visibility: hidden;
      `;
            document.body.appendChild(ripple);
        }
        rippleRef.current = ripple;

        return () => {
            // Don't remove on unmount - other components might use it
        };
    }, [mounted]);

    // Inject ripple styles
    useEffect(() => {
        if (!mounted) return;

        if (!document.getElementById('theme-ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-ripple-styles';
            style.textContent = `
        .theme-ripple-circle {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
        }
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
      `;
            document.head.appendChild(style);
        }
    }, [mounted]);

    // Update button icons based on theme
    useEffect(() => {
        if (!mounted) return;

        const buttons = document.querySelectorAll('.theme-toggle-btn');
        buttons.forEach(btn => {
            const sunIcon = btn.querySelector('.sun-icon') as HTMLElement | null;
            const moonIcon = btn.querySelector('.moon-icon') as HTMLElement | null;

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
    }, [theme, mounted]);

    const toggleTheme = useCallback((event: React.MouseEvent) => {
        if (isAnimating.current || !mounted) return;

        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        // Get click position for ripple origin
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        // Perform ripple animation
        const overlay = rippleRef.current;
        if (!overlay) {
            // Fallback: just change theme without animation
            setTheme(newTheme);
            localStorage.setItem('xml2compose_theme', newTheme);
            return;
        }

        const circle = overlay.querySelector('.theme-ripple-circle') as HTMLElement | null;
        if (!circle) {
            setTheme(newTheme);
            localStorage.setItem('xml2compose_theme', newTheme);
            return;
        }

        isAnimating.current = true;

        // Calculate max radius to cover entire screen
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        ) * 2;

        // Set ripple appearance
        circle.style.backgroundColor = newTheme === 'dark' ? '#000000' : '#FFFFFF';
        circle.style.left = x + 'px';
        circle.style.top = y + 'px';
        circle.style.width = maxRadius + 'px';
        circle.style.height = maxRadius + 'px';
        circle.style.transform = 'translate(-50%, -50%) scale(0)';
        circle.style.opacity = '1';
        overlay.style.visibility = 'visible';

        // Force reflow
        void circle.offsetWidth;

        // Start expansion animation
        circle.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        circle.style.transform = 'translate(-50%, -50%) scale(1)';

        // Switch theme at 50% of animation
        setTimeout(() => {
            setTheme(newTheme);
            localStorage.setItem('xml2compose_theme', newTheme);
        }, 350);

        // Fade out ripple after expansion
        setTimeout(() => {
            circle.style.transition = 'opacity 0.4s ease';
            circle.style.opacity = '0';

            // Reset after fade out
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
                circle.style.transform = 'translate(-50%, -50%) scale(0)';
                circle.style.opacity = '1';
                circle.style.transition = '';
                isAnimating.current = false;
            }, 400);
        }, 700);
    }, [theme, mounted]);

    return { theme, toggleTheme };
}
