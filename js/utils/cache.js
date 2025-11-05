/**
 * 转换结果缓存模块
 * 使用内存缓存提高转换性能
 */

export class ConversionCache {
    constructor(maxSize = 50) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }
    
    /**
     * 生成缓存键
     * @param {string} xmlString - XML字符串
     * @returns {string} 哈希键
     */
    generateKey(xmlString) {
        // 简单的哈希函数
        let hash = 0;
        for (let i = 0; i < xmlString.length; i++) {
            const char = xmlString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString();
    }
    
    /**
     * 获取缓存的转换结果
     * @param {string} xmlString - XML字符串
     * @returns {Object|null} 缓存的结果
     */
    get(xmlString) {
        const key = this.generateKey(xmlString);
        const cached = this.cache.get(key);
        
        if (cached) {
            // 更新访问时间
            cached.lastAccessed = Date.now();
            return cached;
        }
        
        return null;
    }
    
    /**
     * 缓存转换结果
     * @param {string} xmlString - XML字符串
     * @param {string} composeCode - Compose代码
     */
    set(xmlString, composeCode) {
        const key = this.generateKey(xmlString);
        
        // 如果缓存已满，删除最旧的项
        if (this.cache.size >= this.maxSize) {
            let oldestKey = null;
            let oldestTime = Date.now();
            
            for (const [k, v] of this.cache.entries()) {
                if (v.lastAccessed < oldestTime) {
                    oldestTime = v.lastAccessed;
                    oldestKey = k;
                }
            }
            
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        
        this.cache.set(key, {
            compose: composeCode,
            timestamp: Date.now(),
            lastAccessed: Date.now()
        });
    }
    
    /**
     * 清空缓存
     */
    clear() {
        this.cache.clear();
    }
    
    /**
     * 获取缓存统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            usage: ((this.cache.size / this.maxSize) * 100).toFixed(2) + '%'
        };
    }
}

