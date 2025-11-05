/**
 * 键盘快捷键模块
 * 处理键盘快捷键功能
 */

export class ShortcutManager {
    constructor(actions) {
        this.actions = actions;
        this.init();
    }
    
    /**
     * 初始化快捷键
     */
    init() {
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
    }
    
    /**
     * 处理键盘按下事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeydown(e) {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        
        // Ctrl/Cmd + Enter: 转换
        if (isCtrlOrCmd && e.key === 'Enter') {
            e.preventDefault();
            if (this.actions.convert) {
                this.actions.convert();
            }
        }
        
        // Ctrl/Cmd + K: 复制代码
        if (isCtrlOrCmd && e.key === 'k') {
            e.preventDefault();
            if (this.actions.copy) {
                this.actions.copy();
            }
        }
        
        // Ctrl/Cmd + L: 加载示例
        if (isCtrlOrCmd && e.key === 'l') {
            e.preventDefault();
            if (this.actions.loadSample) {
                this.actions.loadSample();
            }
        }
        
        // Ctrl/Cmd + D: 下载
        if (isCtrlOrCmd && e.key === 'd') {
            e.preventDefault();
            if (this.actions.download) {
                this.actions.download();
            }
        }
        
        // Ctrl/Cmd + S: 保存
        if (isCtrlOrCmd && e.key === 's') {
            e.preventDefault();
            if (this.actions.save) {
                this.actions.save();
            }
        }
        
        // Esc: 清空
        if (e.key === 'Escape') {
            if (this.actions.clear) {
                this.actions.clear();
            }
        }
    }
    
    /**
     * 获取快捷键列表
     * @returns {Array} 快捷键列表
     */
    getShortcutsList() {
        return [
            { keys: ['Ctrl/Cmd', 'Enter'], action: '转换代码' },
            { keys: ['Ctrl/Cmd', 'K'], action: '复制代码' },
            { keys: ['Ctrl/Cmd', 'L'], action: '加载示例' },
            { keys: ['Ctrl/Cmd', 'D'], action: '下载文件' },
            { keys: ['Ctrl/Cmd', 'S'], action: '保存到历史' },
            { keys: ['Esc'], action: '清空输入' }
        ];
    }
}

