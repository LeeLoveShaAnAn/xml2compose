/**
 * 通知管理模块
 * 处理用户提示和通知消息
 */

export class NotificationManager {
    constructor() {
        this.createNotificationContainer();
    }
    
    /**
     * 创建通知容器
     */
    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }
    
    /**
     * 显示通知
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success/error/info/warning)
     * @param {number} duration - 显示时长（毫秒）
     */
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        
        const colors = {
            success: '#34C759',
            error: '#FF3B30',
            warning: '#FF9500',
            info: '#007AFF'
        };
        
        notification.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            pointer-events: auto;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        container.appendChild(notification);
        
        // 自动移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    /**
     * 显示成功消息
     * @param {string} message - 消息内容
     */
    success(message) {
        this.show(message, 'success');
    }
    
    /**
     * 显示错误消息
     * @param {string} message - 消息内容
     */
    error(message) {
        this.show(message, 'error');
    }
    
    /**
     * 显示警告消息
     * @param {string} message - 消息内容
     */
    warning(message) {
        this.show(message, 'warning');
    }
    
    /**
     * 显示信息消息
     * @param {string} message - 消息内容
     */
    info(message) {
        this.show(message, 'info');
    }
}

// 添加CSS动画
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

