/**
 * 导出功能模块
 * 支持导出Kotlin文件和PDF文档
 */

export class ExportManager {
    /**
     * 导出为Kotlin文件
     * @param {string} composeCode - Compose代码
     * @param {string} filename - 文件名
     */
    exportAsKotlin(composeCode, filename = 'ComposableScreen.kt') {
        const fullCode = this.generateKotlinFile(composeCode);
        const blob = new Blob([fullCode], { type: 'text/plain;charset=utf-8' });
        this.downloadBlob(blob, filename);
    }
    
    /**
     * 生成完整的Kotlin文件
     * @param {string} composeCode - Compose代码
     * @returns {string} 完整的Kotlin代码
     */
    generateKotlinFile(composeCode) {
        return `package com.example.app.ui

${composeCode}`;
    }
    
    /**
     * 下载Blob对象
     * @param {Blob} blob - Blob对象
     * @param {string} filename - 文件名
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * 导出为文本文件（通用方法）
     * @param {string} content - 文件内容
     * @param {string} filename - 文件名
     * @param {string} mimeType - MIME类型
     */
    exportAsFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        this.downloadBlob(blob, filename);
    }
}

