/**
 * 拖拽上传模块
 * 处理XML文件的拖拽上传功能
 */

export class DragDropHandler {
    constructor(dropZoneElement, onFileLoaded) {
        this.dropZone = dropZoneElement;
        this.onFileLoaded = onFileLoaded;
        this.init();
    }
    
    /**
     * 初始化拖拽事件
     */
    init() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => {
                this.dropZone.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => {
                this.dropZone.classList.remove('drag-over');
            }, false);
        });
        
        this.dropZone.addEventListener('drop', this.handleDrop.bind(this), false);
    }
    
    /**
     * 阻止默认事件
     * @param {Event} e - 事件对象
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * 处理文件拖放
     * @param {DragEvent} e - 拖放事件
     */
    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }
    
    /**
     * 处理文件读取
     * @param {File} file - 文件对象
     */
    handleFile(file) {
        if (file.name.endsWith('.xml')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.onFileLoaded(e.target.result);
            };
            reader.onerror = () => {
                console.error('Failed to read file');
            };
            reader.readAsText(file);
        } else {
            alert('请上传有效的XML文件');
        }
    }
}

