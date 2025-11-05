/**
 * 代码生成器模块
 * 负责生成最终的Compose代码和导入语句
 */

import { validateXmlSyntax, getAttributes } from './parser.js';
import { validateAttributes, generatePerformanceTips } from './validator.js';
import { parseNode } from './converter.js';

/**
 * 生成缩进字符串
 * @param {number} level - 缩进级别
 * @returns {string} 缩进字符串
 */
export const indent = (level) => '    '.repeat(level);

/**
 * 格式化Compose代码
 * @param {string} code - 代码字符串
 * @returns {string} 格式化后的代码
 */
export const formatCompose = (code) => {
    return code.replace(/,(\n\s*\})/g, '$1')
                .replace(/\n\s*\n/g, '\n')
                .trim();
};

/**
 * 生成导入语句
 * @param {Element} rootElement - 根元素
 * @returns {string} 导入语句代码
 */
export const generateImports = (rootElement) => {
    const usedComponents = new Set();
    const usedModifiers = new Set();
    const usedResources = new Set();
    
    // 递归收集使用的组件和功能
    const collectUsage = (node) => {
        const tagName = node.tagName;
        const attributes = getAttributes(node);
        
        // 收集组件类型
        switch (tagName) {
            case 'LinearLayout':
                usedComponents.add(attributes['android:orientation'] === 'horizontal' ? 'Row' : 'Column');
                break;
            case 'ConstraintLayout':
                usedComponents.add('Box');
                break;
            case 'TextView':
                usedComponents.add('Text');
                if (attributes['android:textAlign']) usedComponents.add('TextAlign');
                if (attributes['android:fontWeight']) usedComponents.add('FontWeight');
                if (attributes['android:fontStyle']) usedComponents.add('FontStyle');
                break;
            case 'Button':
                usedComponents.add('Button');
                usedComponents.add('Text');
                break;
            case 'EditText':
                usedComponents.add('TextField');
                if (attributes['android:inputType']?.includes('textPassword')) {
                    usedComponents.add('PasswordVisualTransformation');
                }
                break;
            case 'CheckBox':
                usedComponents.add('Checkbox');
                break;
            case 'RadioButton':
                usedComponents.add('RadioButton');
                break;
            case 'Switch':
            case 'ToggleButton':
                usedComponents.add('Switch');
                break;
            case 'ProgressBar':
                const style = attributes['style'];
                if (style?.includes('Horizontal')) {
                    usedComponents.add('LinearProgressIndicator');
                } else {
                    usedComponents.add('CircularProgressIndicator');
                }
                break;
            case 'SeekBar':
                usedComponents.add('Slider');
                break;
            case 'Spinner':
                usedComponents.add('ExposedDropdownMenuBox');
                break;
            case 'ImageView':
                usedComponents.add('Image');
                usedComponents.add('painterResource');
                break;
            case 'WebView':
                usedComponents.add('AndroidView');
                break;
            case 'GridLayout':
                usedComponents.add('LazyVerticalGrid');
                usedComponents.add('GridCells');
                break;
        }
        
        // 收集修饰符使用
        if (attributes['android:layout_width'] === 'match_parent') usedModifiers.add('fillMaxWidth');
        if (attributes['android:layout_height'] === 'match_parent') usedModifiers.add('fillMaxHeight');
        if (attributes['android:padding']) usedModifiers.add('padding');
        if (attributes['android:layout_margin']) usedModifiers.add('padding');
        if (attributes['android:background']) usedModifiers.add('background');
        if (attributes['android:visibility']) usedModifiers.add('alpha');
        if (attributes['android:onClick']) usedModifiers.add('clickable');
        
        // 收集资源引用
        Object.values(attributes).forEach(value => {
            if (typeof value === 'string') {
                if (value.startsWith('@string/')) usedResources.add('stringResource');
                if (value.startsWith('@color/')) usedResources.add('colorResource');
                if (value.startsWith('@dimen/')) usedResources.add('dimensionResource');
                if (value.startsWith('@drawable/')) usedResources.add('painterResource');
            }
        });
        
        // 递归处理子元素
        Array.from(node.children).forEach(child => collectUsage(child));
    };
    
    collectUsage(rootElement);
    
    // 生成导入语句
    let imports = '// 自动生成的导入语句\n';
    
    // 基础Compose导入
    imports += 'import androidx.compose.runtime.*\n';
    imports += 'import androidx.compose.ui.Modifier\n';
    imports += 'import androidx.compose.ui.unit.dp\n';
    imports += 'import androidx.compose.ui.unit.sp\n';
    
    // 布局导入
    if (usedComponents.has('Column') || usedComponents.has('Row') || usedComponents.has('Box')) {
        imports += 'import androidx.compose.foundation.layout.*\n';
    }
    
    // Material3组件导入
    const material3Components = ['Text', 'Button', 'TextField', 'Checkbox', 'RadioButton', 'Switch', 
                               'LinearProgressIndicator', 'CircularProgressIndicator', 'Slider'];
    if (material3Components.some(comp => usedComponents.has(comp))) {
        imports += 'import androidx.compose.material3.*\n';
    }
    
    // 图片和资源导入
    if (usedComponents.has('Image') || usedResources.has('painterResource')) {
        imports += 'import androidx.compose.foundation.Image\n';
        imports += 'import androidx.compose.ui.res.painterResource\n';
    }
    
    // 资源导入
    if (usedResources.has('stringResource')) {
        imports += 'import androidx.compose.ui.res.stringResource\n';
    }
    if (usedResources.has('colorResource')) {
        imports += 'import androidx.compose.ui.res.colorResource\n';
    }
    if (usedResources.has('dimensionResource')) {
        imports += 'import androidx.compose.ui.res.dimensionResource\n';
    }
    
    // 特殊功能导入
    if (usedComponents.has('PasswordVisualTransformation')) {
        imports += 'import androidx.compose.ui.text.input.PasswordVisualTransformation\n';
    }
    if (usedComponents.has('LazyVerticalGrid')) {
        imports += 'import androidx.compose.foundation.lazy.grid.*\n';
    }
    if (usedComponents.has('AndroidView')) {
        imports += 'import androidx.compose.ui.viewinterop.AndroidView\n';
    }
    
    return imports;
};

/**
 * 将XML转换为Compose代码
 * @param {string} xmlString - XML字符串
 * @returns {string} Compose代码
 */
export const convertXmlToCompose = (xmlString) => {
    // 首先验证XML语法
    const validation = validateXmlSyntax(xmlString);
    if (!validation.isValid) {
        let errorMessage = "XML解析错误：\n";
        validation.errors.forEach(error => {
            errorMessage += `• ${error.message}\n`;
        });
        return errorMessage;
    }
    
    const xmlDoc = validation.xmlDoc;
    const rootElement = xmlDoc.documentElement;
    
    // 收集验证信息
    const allWarnings = [];
    const allSuggestions = [];
    
    const collectValidationInfo = (node) => {
        const attributes = getAttributes(node);
        const validation = validateAttributes(node.tagName, attributes);
        allWarnings.push(...validation.warnings);
        allSuggestions.push(...validation.suggestions);
        
        Array.from(node.children).forEach(child => collectValidationInfo(child));
    };
    
    collectValidationInfo(rootElement);
    
    // 生成性能建议
    const performanceTips = generatePerformanceTips(rootElement);
    
    // 生成导入语句
    const imports = generateImports(rootElement);
    const composeCode = parseNode(rootElement, 0);
    
    let result = imports + "\n" + formatCompose(composeCode);
    
    // 添加警告和建议
    if (allWarnings.length > 0 || allSuggestions.length > 0 || performanceTips.length > 0) {
        result += "\n\n/* 转换提示和建议：\n";
        
        if (allWarnings.length > 0) {
            result += "\n⚠️ 警告：\n";
            allWarnings.forEach(warning => {
                result += `• ${warning.message}\n`;
                if (warning.suggestion) {
                    result += `  建议：${warning.suggestion}\n`;
                }
            });
        }
        
        if (allSuggestions.length > 0) {
            result += "\n💡 建议：\n";
            allSuggestions.forEach(suggestion => {
                result += `• ${suggestion.message}\n`;
            });
        }
        
        if (performanceTips.length > 0) {
            result += "\n🚀 性能优化：\n";
            performanceTips.forEach(tip => {
                result += `• ${tip}\n`;
            });
        }
        
        result += "*/";
    }
    
    return result;
};

