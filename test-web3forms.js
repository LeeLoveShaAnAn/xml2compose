#!/usr/bin/env node

/**
 * Web3Forms 配置测试脚本
 * 验证 Access Key 配置是否正确
 */

const fs = require('fs');
const path = require('path');

function testWeb3FormsConfig() {
    const indexPath = path.join(__dirname, 'index.html');

    try {
        const content = fs.readFileSync(indexPath, 'utf8');

        // 检查是否还有占位符
        const placeholder = 'YOUR_WEB3FORMS_ACCESS_KEY';
        const hasPlaceholder = content.includes(placeholder);

        if (hasPlaceholder) {
            console.log('❌ 配置未完成');
            console.log('📝 发现未配置的占位符');
            console.log('');
            console.log('请运行以下命令配置 Access Key:');
            console.log('node configure-web3forms.js YOUR_ACCESS_KEY');
            console.log('');
            console.log('获取 Access Key:');
            console.log('1. 访问 https://web3forms.com/');
            console.log('2. 注册账户并验证邮箱');
            console.log('3. 在邮件中找到您的 Access Key');
            return false;
        }

        // 提取配置的 Access Key
        const accessKeyMatch = content.match(/name="access_key"\s+value="([^"]+)"/);
        const accessKey = accessKeyMatch ? accessKeyMatch[1] : null;

        if (!accessKey) {
            console.log('❌ 未找到 Access Key 配置');
            return false;
        }

        // 检查 Access Key 格式（UUID格式或传统格式）
        const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
        const legacyPattern = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+$/;

        if (!uuidPattern.test(accessKey) && !legacyPattern.test(accessKey)) {
            console.log('⚠️  Access Key 格式可能不正确');
            console.log(`🔑 当前配置: ${accessKey}`);
            console.log('请确认这是有效的 Web3Forms Access Key');
            return false;
        }

        console.log('✅ Web3Forms 配置正确！');
        console.log(`🔑 Access Key: ${accessKey}`);
        console.log('');
        console.log('🚀 您的表单已经可以正常使用了！');
        console.log('');
        console.log('测试步骤:');
        console.log('1. 启动服务器: python -m http.server 8000');
        console.log('2. 访问 http://localhost:8000');
        console.log('3. 测试订阅表单和反馈表单');
        console.log('');
        console.log('📧 提交后会收到确认邮件');

        return true;

    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        return false;
    }
}

testWeb3FormsConfig();
