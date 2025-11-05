/**
 * 主入口文件
 * 整合所有模块并初始化应用
 */

import { convertXmlToCompose } from './core/generator.js';
import { StorageManager } from './utils/storage.js';
import { ConversionCache } from './utils/cache.js';
import { ExportManager } from './utils/export.js';
import { NotificationManager } from './ui/notifications.js';
import { DragDropHandler } from './ui/dragdrop.js';
import { ShortcutManager } from './ui/shortcuts.js';
import { AnimationManager } from './ui/animations.js';
import { HistoryUI } from './ui/history.js';
import { DiffViewer } from './ui/diff.js';
import { i18n } from './i18n/i18n.js';

// 初始化管理器实例
const storage = new StorageManager();
const cache = new ConversionCache();
const exporter = new ExportManager();
const notifier = new NotificationManager();
const animator = new AnimationManager();
const diffViewer = new DiffViewer();

// 示例XML
const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, Jetpack Compose!"
        android:textSize="24sp" />

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Click Me" />

</LinearLayout>`;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化国际化
    i18n.updateUI();
    
    // 获取DOM元素
    const xmlInput = document.getElementById('xml-input');
    const composeOutput = document.getElementById('compose-output');
    const emptyState = document.getElementById('empty-state');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const loadSampleBtn = document.getElementById('load-sample-btn');
    const clearInputBtn = document.getElementById('clear-input-btn');
    const downloadBtn = document.getElementById('download-btn');
    const compareBtn = document.getElementById('compare-btn');
    const inputStatus = document.getElementById('input-status');
    const inputStatusText = document.getElementById('input-status-text');
    const outputStatus = document.getElementById('output-status');
    const outputStatusText = document.getElementById('output-status-text');
    const inputLines = document.getElementById('input-lines');
    const outputLines = document.getElementById('output-lines');
    
    // 语言切换
    const langButtons = document.querySelectorAll('.lang-switch button');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.textContent.includes('EN') ? 'en' : 'zh';
            i18n.setLanguage(lang);
            
            // 更新按钮状态
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            notifier.success(i18n.t('notification.languageChanged') || 'Language changed!');
        });
    });
    
    // 更新输入状态
    function updateInputStatus() {
        const lines = xmlInput.value.split('\n').length;
        inputLines.textContent = i18n.t('lines', { count: lines });
        
        if (xmlInput.value.trim()) {
            inputStatus.className = 'status-dot success';
            inputStatusText.textContent = i18n.t('status.xmlReady');
        } else {
            inputStatus.className = 'status-dot';
            inputStatusText.textContent = i18n.t('status.ready');
        }
    }
    
    // 更新输出状态
    function updateOutputStatus(hasContent) {
        if (hasContent) {
            const lines = composeOutput.textContent.split('\n').length;
            outputLines.textContent = i18n.t('lines', { count: lines });
            outputStatus.className = 'status-dot success';
            outputStatusText.textContent = i18n.t('status.complete');
        } else {
            outputLines.textContent = i18n.t('lines', { count: 0 });
            outputStatus.className = 'status-dot';
            outputStatusText.textContent = i18n.t('status.waiting');
        }
    }
    
    // 执行转换
    function performConversion() {
        const xmlCode = xmlInput.value.trim();
        if (!xmlCode) {
            notifier.warning(i18n.t('notification.emptyInput'));
            return;
        }
        
        // 检查缓存
        const cached = cache.get(xmlCode);
        if (cached) {
            displayResult(cached.compose);
            notifier.info('Loaded from cache');
            return;
        }
        
        // 显示加载状态
        outputStatusText.textContent = i18n.t('status.converting');
        
        // 使用 setTimeout 模拟异步处理，避免阻塞UI
        setTimeout(() => {
            try {
                const composeCode = convertXmlToCompose(xmlCode);
                
                // 缓存结果
                cache.set(xmlCode, composeCode);
                
                // 保存到历史记录
                storage.saveConversion(xmlCode, composeCode);
                
                // 显示结果
                displayResult(composeCode);
                
                notifier.success(i18n.t('notification.copied') || 'Conversion complete!');
            } catch (error) {
                console.error('Conversion error:', error);
                notifier.error(i18n.t('error.conversion'));
                outputStatusText.textContent = i18n.t('status.error');
            }
        }, 100);
    }
    
    // 显示转换结果
    function displayResult(composeCode) {
        emptyState.style.display = 'none';
        composeOutput.style.display = 'block';
        composeOutput.textContent = composeCode;
        
        // 语法高亮
        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(composeOutput);
        }
        
        updateOutputStatus(true);
    }
    
    // 复制代码
    async function copyCode() {
        const code = composeOutput.textContent;
        if (!code.trim()) {
            notifier.warning(i18n.t('notification.noCode'));
            return;
        }
        
        try {
            await navigator.clipboard.writeText(code);
            notifier.success(i18n.t('notification.copied'));
        } catch (error) {
            console.error('Failed to copy:', error);
            notifier.error('Failed to copy code');
        }
    }
    
    // 加载示例
    function loadSample() {
        xmlInput.value = sampleXml;
        updateInputStatus();
        performConversion();
    }
    
    // 清空输入
    function clearInput() {
        xmlInput.value = '';
        composeOutput.textContent = '';
        emptyState.style.display = 'flex';
        composeOutput.style.display = 'none';
        updateInputStatus();
        updateOutputStatus(false);
        notifier.info(i18n.t('notification.cleared'));
    }
    
    // 下载代码
    function downloadCode() {
        const code = composeOutput.textContent;
        if (!code.trim()) {
            notifier.warning(i18n.t('notification.noCode'));
            return;
        }
        
        exporter.exportAsKotlin(code);
        notifier.success(i18n.t('notification.downloaded'));
    }
    
    // 显示代码对比
    function showComparison() {
        const xmlCode = xmlInput.value.trim();
        const composeCode = composeOutput.textContent;
        
        if (!xmlCode || !composeCode) {
            notifier.warning('Please convert XML first!');
            return;
        }
        
        diffViewer.show(xmlCode, composeCode);
    }
    
    // 绑定事件
    if (convertBtn) convertBtn.addEventListener('click', performConversion);
    if (copyBtn) copyBtn.addEventListener('click', copyCode);
    if (loadSampleBtn) loadSampleBtn.addEventListener('click', loadSample);
    if (clearInputBtn) clearInputBtn.addEventListener('click', clearInput);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadCode);
    if (compareBtn) compareBtn.addEventListener('click', showComparison);
    if (xmlInput) xmlInput.addEventListener('input', updateInputStatus);
    
    // 初始化拖拽上传
    if (xmlInput) {
        const dragDrop = new DragDropHandler(
            xmlInput.parentElement,
            (content) => {
                xmlInput.value = content;
                updateInputStatus();
                notifier.success('File loaded successfully!');
            }
        );
    }
    
    // 初始化历史记录UI
    const historyUI = new HistoryUI(storage, (xml, compose) => {
        xmlInput.value = xml;
        updateInputStatus();
        displayResult(compose);
        notifier.info('History loaded');
    });
    
    // 初始化快捷键
    const shortcuts = new ShortcutManager({
        convert: performConversion,
        copy: copyCode,
        loadSample: loadSample,
        clear: clearInput,
        download: downloadCode,
        save: () => {
            const xmlCode = xmlInput.value.trim();
            const composeCode = composeOutput.textContent;
            if (xmlCode && composeCode) {
                storage.saveConversion(xmlCode, composeCode);
                historyUI.refresh();
                notifier.success(i18n.t('notification.saved'));
            }
        }
    });
    
    // 初始化状态
    updateInputStatus();
    updateOutputStatus(false);
    
    // 如果有示例加载按钮，自动加载示例
    if (loadSampleBtn && xmlInput && composeOutput) {
        // 可选：自动加载示例
        // loadSample();
    }
});

// 导出全局变量供测试使用
window.xml2compose = {
    storage,
    cache,
    exporter,
    notifier,
    animator,
    i18n,
    convertXmlToCompose
};

