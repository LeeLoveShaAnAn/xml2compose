/**
 * 动画管理模块
 * 处理加载动画和状态过渡
 */

export class AnimationManager {
    /**
     * 显示按钮加载状态
     * @param {HTMLElement} button - 按钮元素
     * @param {string} loadingText - 加载文本
     */
    showButtonLoading(button, loadingText = 'Converting...') {
        button.dataset.originalText = button.textContent;
        button.disabled = true;
        button.classList.add('btn-loading');

        // 添加旋转图标和文本
        button.innerHTML = `
            <span class="btn-spinner"></span>
            <span>${loadingText}</span>
        `;
    }

    /**
     * 隐藏按钮加载状态并显示成功
     * @param {HTMLElement} button - 按钮元素
     * @param {boolean} success - 是否成功
     */
    hideButtonLoading(button, success = true) {
        button.disabled = false;
        button.classList.remove('btn-loading');

        if (success) {
            button.classList.add('btn-success');
            button.innerHTML = `
                <span class="btn-checkmark">✓</span>
                <span>Done!</span>
            `;

            // 1秒后恢复原状
            setTimeout(() => {
                button.classList.remove('btn-success');
                button.textContent = button.dataset.originalText || 'Convert Now';
            }, 1500);
        } else {
            button.textContent = button.dataset.originalText || 'Convert Now';
        }
    }

    /**
     * 复制成功动画
     * @param {HTMLElement} button - 复制按钮
     */
    showCopySuccess(button) {
        const originalText = button.textContent;
        button.classList.add('btn-copied');
        button.innerHTML = `<span class="btn-checkmark">✓</span> Copied!`;

        setTimeout(() => {
            button.classList.remove('btn-copied');
            button.textContent = originalText;
        }, 2000);
    }

    /**
     * 代码输出渐入动画（打字机效果）
     * @param {HTMLElement} element - 代码元素
     * @param {string} code - 代码内容
     * @param {Function} onComplete - 完成回调
     */
    typewriterEffect(element, code, onComplete) {
        element.style.display = 'block';
        element.textContent = '';
        element.classList.add('typewriter-active');

        const lines = code.split('\n');
        let lineIndex = 0;
        let currentText = '';

        const typeNextLine = () => {
            if (lineIndex < lines.length) {
                currentText += (lineIndex > 0 ? '\n' : '') + lines[lineIndex];
                element.textContent = currentText;
                lineIndex++;

                // 自动滚动到底部
                element.scrollTop = element.scrollHeight;

                // 每行间隔时间（越长的文件越快）
                const delay = Math.max(20, 100 - lines.length * 2);
                setTimeout(typeNextLine, delay);
            } else {
                element.classList.remove('typewriter-active');
                if (onComplete) onComplete();
            }
        };

        // 开始打字
        requestAnimationFrame(typeNextLine);
    }

    /**
     * 代码输出快速渐入（不使用打字机）
     * @param {HTMLElement} element - 代码元素
     */
    codeReveal(element) {
        element.classList.add('code-reveal');

        setTimeout(() => {
            element.classList.remove('code-reveal');
        }, 500);
    }

    /**
     * 语言切换动画
     * @param {Function} callback - 切换回调
     */
    animateLanguageSwitch(callback) {
        const translatableElements = document.querySelectorAll('[data-i18n]');

        // 淡出
        translatableElements.forEach(el => {
            el.classList.add('lang-switching');
        });

        setTimeout(() => {
            // 执行切换
            if (callback) callback();

            // 淡入
            translatableElements.forEach(el => {
                el.classList.remove('lang-switching');
                el.classList.add('lang-switched');
            });

            setTimeout(() => {
                translatableElements.forEach(el => {
                    el.classList.remove('lang-switched');
                });
            }, 300);
        }, 150);
    }

    /**
     * 显示加载状态
     * @param {HTMLElement} element - 目标元素
     * @param {string} message - 加载消息
     */
    showLoadingState(element, message = 'Converting...') {
        const loadingHTML = `
            <div class="loading-spinner" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 350px;
            ">
                <div class="spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e5e5ea;
                    border-top-color: #007AFF;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                "></div>
                <p style="margin-top: 16px; color: #3c3c43;">${message}</p>
            </div>
        `;
        element.innerHTML = loadingHTML;
    }

    /**
     * 隐藏加载状态
     * @param {HTMLElement} element - 目标元素
     * @param {string} content - 内容
     */
    hideLoadingState(element, content) {
        element.innerHTML = content;
        element.classList.add('fade-in');

        // 移除动画类
        setTimeout(() => {
            element.classList.remove('fade-in');
        }, 300);
    }

    /**
     * 显示进度条
     * @param {number} percentage - 进度百分比
     * @returns {string} 进度条HTML
     */
    showProgress(percentage) {
        return `
            <div style="
                width: 100%;
                height: 4px;
                background: #e5e5ea;
                border-radius: 2px;
                overflow: hidden;
            ">
                <div style="
                    width: ${percentage}%;
                    height: 100%;
                    background: linear-gradient(90deg, #007AFF, #5856D6);
                    transition: width 0.3s ease;
                "></div>
            </div>
        `;
    }

    /**
     * 淡入元素
     * @param {HTMLElement} element - 目标元素
     */
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.display = 'block';

        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        });
    }

    /**
     * 淡出元素
     * @param {HTMLElement} element - 目标元素
     * @param {Function} callback - 回调函数
     */
    fadeOut(element, callback) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, 300);
    }

    /**
     * 脉冲动画（用于吸引注意力）
     * @param {HTMLElement} element - 目标元素
     */
    pulse(element) {
        element.classList.add('pulse-animation');

        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, 600);
    }

    /**
     * 抖动动画（用于错误提示）
     * @param {HTMLElement} element - 目标元素
     */
    shake(element) {
        element.classList.add('shake-animation');

        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    }
}

// 添加CSS动画样式
if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 按钮加载动画 */
        .btn-loading {
            position: relative;
            cursor: wait !important;
            opacity: 0.85;
        }
        
        .btn-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
        }
        
        /* 按钮成功状态 */
        .btn-success {
            background: linear-gradient(135deg, #34C759 0%, #30D158 100%) !important;
            animation: successPop 0.3s ease;
        }
        
        .btn-checkmark {
            display: inline-block;
            margin-right: 6px;
            font-weight: bold;
        }
        
        @keyframes successPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* 复制成功 */
        .btn-copied {
            background: linear-gradient(135deg, #34C759 0%, #30D158 100%) !important;
            animation: copiedFlash 0.3s ease;
        }
        
        @keyframes copiedFlash {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5); }
            50% { transform: scale(1.02); box-shadow: 0 0 20px 5px rgba(52, 199, 89, 0.3); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); }
        }
        
        /* 代码显示动画 */
        .code-reveal {
            animation: codeSlideIn 0.4s ease-out;
        }
        
        @keyframes codeSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 打字机光标效果 */
        .typewriter-active::after {
            content: '|';
            animation: blink 0.7s infinite;
            color: #007AFF;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* 语言切换动画 */
        .lang-switching {
            opacity: 0.3;
            transform: translateY(-5px);
            transition: all 0.15s ease;
        }
        
        .lang-switched {
            animation: langFadeIn 0.3s ease;
        }
        
        @keyframes langFadeIn {
            from {
                opacity: 0;
                transform: translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 脉冲动画 */
        .pulse-animation {
            animation: pulse 0.6s ease;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        /* 抖动动画 */
        .shake-animation {
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

