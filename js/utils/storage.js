/**
 * 本地存储管理模块
 * 负责管理转换历史记录的保存和读取
 */

export class StorageManager {
    constructor(maxHistory = 10) {
        this.maxHistory = maxHistory;
        this.storageKey = 'xml2compose_history';
    }
    
    /**
     * 保存转换记录
     * @param {string} xmlCode - XML代码
     * @param {string} composeCode - Compose代码
     */
    saveConversion(xmlCode, composeCode) {
        const history = this.getHistory();
        const item = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            xml: xmlCode,
            compose: composeCode,
            preview: xmlCode.substring(0, 100) + '...'
        };
        
        history.unshift(item);
        if (history.length > this.maxHistory) {
            history.pop();
        }
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Failed to save conversion history:', error);
            return false;
        }
    }
    
    /**
     * 获取历史记录
     * @returns {Array} 历史记录数组
     */
    getHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load conversion history:', error);
            return [];
        }
    }
    
    /**
     * 获取单条记录
     * @param {number} id - 记录ID
     * @returns {Object|null} 记录对象
     */
    getItem(id) {
        return this.getHistory().find(item => item.id === id) || null;
    }
    
    /**
     * 删除单条记录
     * @param {number} id - 记录ID
     * @returns {boolean} 是否成功删除
     */
    deleteItem(id) {
        try {
            const history = this.getHistory().filter(item => item.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Failed to delete conversion history item:', error);
            return false;
        }
    }
    
    /**
     * 清空所有历史记录
     * @returns {boolean} 是否成功清空
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear conversion history:', error);
            return false;
        }
    }
}

