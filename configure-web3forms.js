#!/usr/bin/env node

/**
 * Web3Forms 配置脚本
 * 快速配置 Access Key
 */

const fs = require('fs');
const path = require('path');

function configureWeb3Forms(accessKey) {
    if (!accessKey) {
        console.error('❌ 请提供 Access Key');
        console.log('用法: node configure-web3forms.js YOUR_ACCESS_KEY');
        console.log('示例: node configure-web3forms.js abc123-def456-ghi789');
        process.exit(1);
    }

    const indexPath = path.join(__dirname, 'index.html');

    try {
        // 读取文件
        let content = fs.readFileSync(indexPath, 'utf8');

        // 替换 Access Key
        const placeholder = 'YOUR_WEB3FORMS_ACCESS_KEY';
        const replacement = accessKey;

        let replacedCount = 0;
        content = content.replace(new RegExp(placeholder, 'g'), () => {
            replacedCount++;
            return replacement;
        });

        // 写回文件
        fs.writeFileSync(indexPath, content, 'utf8');

        console.log('✅ Web3Forms 配置成功！');
        console.log(`📝 替换了 ${replacedCount} 处 Access Key`);
        console.log(`🔑 Access Key: ${accessKey}`);
        console.log('');
        console.log('🎉 您的表单现在已经配置好了！');
        console.log('');
        console.log('测试步骤:');
        console.log('1. 启动服务器: python -m http.server 8000');
        console.log('2. 访问: http://localhost:8000');
        console.log('3. 测试订阅表单和反馈表单');
        console.log('');
        console.log('部署前请确保配置正确！');

    } catch (error) {
        console.error('❌ 配置失败:', error.message);
        process.exit(1);
    }
}

// 从命令行参数获取 Access Key
const accessKey = process.argv[2];
configureWeb3Forms(accessKey);
