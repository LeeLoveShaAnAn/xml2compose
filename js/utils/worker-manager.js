/**
 * Worker管理器
 * 处理Web Worker的创建、通信和生命周期管理
 */

export class WorkerManager {
    constructor() {
        this.worker = null;
        this.workerAvailable = typeof Worker !== 'undefined';
        this.minSizeForWorker = 10000; // 超过10KB使用Worker
    }
    
    /**
     * 检查是否应该使用Worker
     * @param {string} xmlString - XML字符串
     * @returns {boolean} 是否使用Worker
     */
    shouldUseWorker(xmlString) {
        return this.workerAvailable && xmlString.length > this.minSizeForWorker;
    }
    
    /**
     * 使用Worker进行转换
     * @param {string} xmlString - XML字符串
     * @returns {Promise<string>} 转换结果
     */
    convertWithWorker(xmlString) {
        return new Promise((resolve, reject) => {
            try {
                // 创建Worker
                this.worker = new Worker('js/workers/converter.worker.js', { type: 'module' });
                
                // 设置超时
                const timeout = setTimeout(() => {
                    this.terminateWorker();
                    reject(new Error('Worker timeout'));
                }, 30000); // 30秒超时
                
                // 监听Worker消息
                this.worker.onmessage = (e) => {
                    const { type, success, result, error } = e.data;
                    
                    if (type === 'ready') {
                        // Worker就绪，发送转换请求
                        this.worker.postMessage({
                            type: 'convert',
                            xmlString: xmlString
                        });
                    } else if (type === 'result') {
                        clearTimeout(timeout);
                        this.terminateWorker();
                        
                        if (success) {
                            // 由于Worker转换尚未完全实现，返回提示
                            // 实际使用时应该返回转换后的代码
                            resolve(result);
                        } else {
                            reject(new Error('Conversion failed'));
                        }
                    } else if (type === 'error') {
                        clearTimeout(timeout);
                        this.terminateWorker();
                        reject(new Error(error));
                    }
                };
                
                // 监听Worker错误
                this.worker.onerror = (error) => {
                    clearTimeout(timeout);
                    this.terminateWorker();
                    reject(error);
                };
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * 终止Worker
     */
    terminateWorker() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
    }
    
    /**
     * 取消转换
     */
    cancelConversion() {
        if (this.worker) {
            this.worker.postMessage({ type: 'cancel' });
            this.terminateWorker();
        }
    }
}

