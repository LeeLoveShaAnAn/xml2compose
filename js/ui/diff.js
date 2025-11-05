/**
 * 代码差异对比视图模块
 * 提供并排代码对比功能
 */

export class DiffViewer {
    constructor() {
        this.modal = null;
        this.createModal();
    }
    
    /**
     * 创建差异对比模态框
     */
    createModal() {
        // 检查模态框是否已存在
        if (document.getElementById('diff-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'diff-modal';
        modal.className = 'diff-modal';
        modal.innerHTML = `
            <div class="diff-modal-overlay"></div>
            <div class="diff-modal-content">
                <div class="diff-modal-header">
                    <h3>Code Comparison</h3>
                    <button class="diff-modal-close" id="diff-modal-close">×</button>
                </div>
                <div class="diff-modal-body">
                    <div class="diff-panel">
                        <div class="diff-panel-header">
                            <span class="diff-label">XML</span>
                            <span class="diff-stats" id="diff-xml-stats"></span>
                        </div>
                        <pre class="diff-code" id="diff-xml-code"></pre>
                    </div>
                    <div class="diff-panel">
                        <div class="diff-panel-header">
                            <span class="diff-label">Compose</span>
                            <span class="diff-stats" id="diff-compose-stats"></span>
                        </div>
                        <pre class="diff-code" id="diff-compose-code"></pre>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        // 绑定关闭事件
        const closeBtn = modal.querySelector('#diff-modal-close');
        const overlay = modal.querySelector('.diff-modal-overlay');
        
        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('open')) {
                this.close();
            }
        });
    }
    
    /**
     * 显示差异对比
     * @param {string} xmlCode - XML代码
     * @param {string} composeCode - Compose代码
     */
    show(xmlCode, composeCode) {
        if (!this.modal) this.createModal();
        
        const xmlCodeEl = this.modal.querySelector('#diff-xml-code');
        const composeCodeEl = this.modal.querySelector('#diff-compose-code');
        const xmlStatsEl = this.modal.querySelector('#diff-xml-stats');
        const composeStatsEl = this.modal.querySelector('#diff-compose-stats');
        
        // 显示代码
        xmlCodeEl.textContent = xmlCode;
        composeCodeEl.textContent = composeCode;
        
        // 计算统计信息
        const xmlLines = xmlCode.split('\n').length;
        const xmlChars = xmlCode.length;
        const composeLines = composeCode.split('\n').length;
        const composeChars = composeCode.length;
        
        xmlStatsEl.textContent = `${xmlLines} lines, ${xmlChars} chars`;
        composeStatsEl.textContent = `${composeLines} lines, ${composeChars} chars`;
        
        // 语法高亮
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(xmlCodeEl);
            hljs.highlightElement(composeCodeEl);
        }
        
        // 显示模态框
        this.modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * 关闭差异对比
     */
    close() {
        if (this.modal) {
            this.modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    
    /**
     * 计算行数差异百分比
     * @param {number} lines1 - 第一个代码的行数
     * @param {number} lines2 - 第二个代码的行数
     * @returns {string} 差异百分比
     */
    calculateDifference(lines1, lines2) {
        const diff = ((lines2 - lines1) / lines1 * 100).toFixed(1);
        return diff > 0 ? `+${diff}%` : `${diff}%`;
    }
}

// 添加CSS样式
if (!document.getElementById('diff-viewer-styles')) {
    const style = document.createElement('style');
    style.id = 'diff-viewer-styles';
    style.textContent = `
        .diff-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: none;
        }
        
        .diff-modal.open {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .diff-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
        }
        
        .diff-modal-content {
            position: relative;
            background: var(--bg-primary, #ffffff);
            border-radius: 12px;
            width: 90%;
            max-width: 1400px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .diff-modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-secondary, #e5e5ea);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .diff-modal-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }
        
        .diff-modal-close {
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: var(--text-secondary, #8e8e93);
            line-height: 1;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s;
        }
        
        .diff-modal-close:hover {
            background: var(--bg-secondary, #f5f5f7);
            color: var(--text-primary, #1d1d1f);
        }
        
        .diff-modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px;
            background: var(--border-secondary, #e5e5ea);
            flex: 1;
            overflow: hidden;
        }
        
        .diff-panel {
            background: var(--bg-primary, #ffffff);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .diff-panel-header {
            padding: 12px 16px;
            background: var(--bg-secondary, #f5f5f7);
            border-bottom: 1px solid var(--border-secondary, #e5e5ea);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .diff-label {
            font-weight: 600;
            font-size: 14px;
            color: var(--text-primary, #1d1d1f);
        }
        
        .diff-stats {
            font-size: 12px;
            color: var(--text-tertiary, #8e8e93);
            font-family: var(--font-mono, 'Monaco', monospace);
        }
        
        .diff-code {
            flex: 1;
            overflow: auto;
            margin: 0;
            padding: 16px;
            font-family: var(--font-mono, 'Monaco', monospace);
            font-size: 13px;
            line-height: 1.6;
            background: var(--bg-primary, #ffffff);
            color: var(--text-primary, #1d1d1f);
        }
        
        @media (max-width: 768px) {
            .diff-modal-body {
                grid-template-columns: 1fr;
            }
            
            .diff-modal-content {
                width: 95%;
                max-height: 90vh;
            }
        }
    `;
    document.head.appendChild(style);
}

