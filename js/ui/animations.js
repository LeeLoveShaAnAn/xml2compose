/**
 * 动画管理模块
 * 处理加载动画和状态过渡
 */

export class AnimationManager {
    /**
     * 显示加载状态
     * @param {HTMLElement} element - 目标元素
     * @param {string} message - 加载消息
     */
    showLoadingState(element, message = '转换中...') {
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
    `;
    document.head.appendChild(style);
}

