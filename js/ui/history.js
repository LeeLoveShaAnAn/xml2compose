/**
 * 历史记录UI模块
 * 处理历史记录侧边栏的显示和交互
 */

export class HistoryUI {
    constructor(storage, onLoadHistory) {
        this.storage = storage;
        this.onLoadHistory = onLoadHistory;
        this.sidebar = document.getElementById('history-sidebar');
        this.toggleBtn = document.getElementById('history-toggle-btn');
        this.closeBtn = document.getElementById('history-close-btn');
        this.clearBtn = document.getElementById('history-clear-btn');
        this.historyList = document.getElementById('history-list');

        this.init();
    }

    /**
     * 初始化事件监听
     */
    init() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        // 加载历史记录
        this.refresh();
    }

    /**
     * 切换侧边栏显示状态
     */
    toggle() {
        if (this.sidebar) {
            this.sidebar.classList.toggle('open');
            this.refresh();
        }
    }

    /**
     * 关闭侧边栏
     */
    close() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
        }
    }

    /**
     * 刷新历史记录列表
     */
    refresh() {
        if (!this.historyList) return;

        const history = this.storage.getHistory();

        if (history.length === 0) {
            this.historyList.innerHTML = `
                <div class="history-empty" data-i18n="history.empty">No history yet</div>
            `;
            return;
        }

        this.historyList.innerHTML = history.map((item, index) => this.renderHistoryItem(item, index)).join('');

        // Animate items in with stagger
        this.historyList.querySelectorAll('.history-item').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.05}s`;
            el.classList.add('history-item-enter');
        });

        // 绑定事件
        this.historyList.querySelectorAll('.history-item').forEach(el => {
            const id = parseInt(el.dataset.id);
            el.addEventListener('click', (e) => {
                if (!e.target.closest('.history-item-actions')) {
                    this.loadItem(id);
                }
            });
        });

        this.historyList.querySelectorAll('.history-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.deleteItem(id, btn.closest('.history-item'));
            });
        });
    }

    /**
     * 渲染历史记录项
     * @param {Object} item - 历史记录项
     * @returns {string} HTML字符串
     */
    renderHistoryItem(item, index = 0) {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString();
        const dateStr = date.toLocaleDateString();

        return `
            <div class="history-item" data-id="${item.id}" style="--anim-index: ${index}">
                <div class="history-item-preview">${item.preview}</div>
                <div class="history-item-meta">
                    <span>${dateStr} ${timeStr}</span>
                    <div class="history-item-actions">
                        <button class="history-delete-btn" data-id="${item.id}" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 加载历史记录项
     * @param {number} id - 记录ID
     */
    loadItem(id) {
        const item = this.storage.getItem(id);
        if (item && this.onLoadHistory) {
            this.onLoadHistory(item.xml, item.compose);
            this.close();
        }
    }

    /**
     * 删除历史记录项
     * @param {number} id - 记录ID
     */
    deleteItem(id, element) {
        if (confirm('Are you sure you want to delete this item?')) {
            // Animate out before deleting
            if (element) {
                element.classList.add('history-item-exit');
                element.addEventListener('animationend', () => {
                    this.storage.deleteItem(id);
                    this.refresh();
                }, { once: true });
            } else {
                this.storage.deleteItem(id);
                this.refresh();
            }
        }
    }

    /**
     * 清空所有历史记录
     */
    clearAll() {
        if (confirm('Are you sure you want to clear all history?')) {
            this.storage.clearHistory();
            this.refresh();
        }
    }
}

