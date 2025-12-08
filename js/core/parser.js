/**
 * XML解析和验证模块
 * 负责XML语法验证、资源引用解析和命名空间属性处理
 */

/**
 * 获取节点的所有属性
 * @param {Element} node - XML节点
 * @returns {Object} 属性对象
 */
export const getAttributes = (node) => {
    const attrs = {};
    for (const attr of node.attributes) {
        attrs[attr.name] = attr.value;
    }
    return attrs;
};

/**
 * 解析资源引用
 * @param {string} value - 属性值
 * @returns {string} 解析后的值
 */
export const parseResourceReference = (value) => {
    if (typeof value !== 'string') return value;

    // 处理字符串资源
    if (value.startsWith('@string/')) {
        const resourceName = value.replace('@string/', '');
        return `stringResource(R.string.${resourceName})`;
    }

    // 处理颜色资源
    if (value.startsWith('@color/')) {
        const resourceName = value.replace('@color/', '');
        return `colorResource(R.color.${resourceName})`;
    }

    // 处理尺寸资源
    if (value.startsWith('@dimen/')) {
        const resourceName = value.replace('@dimen/', '');
        return `dimensionResource(R.dimen.${resourceName})`;
    }

    // 处理图片资源
    if (value.startsWith('@drawable/')) {
        const resourceName = value.replace('@drawable/', '');
        return `painterResource(R.drawable.${resourceName})`;
    }

    // 处理系统颜色
    if (value.startsWith('@android:color/')) {
        const colorName = value.replace('@android:color/', '');
        // 映射常见的系统颜色
        const systemColors = {
            'white': 'Color.White',
            'black': 'Color.Black',
            'transparent': 'Color.Transparent',
            'darker_gray': 'Color.DarkGray',
            'background_light': 'MaterialTheme.colorScheme.background'
        };
        return systemColors[colorName] || `Color(/* TODO: Map @android:color/${colorName} */)`;
    }

    // 处理Data Binding表达式 @{...}
    if (value.startsWith('@{') && value.endsWith('}')) {
        const expression = value.slice(2, -1);
        // 尝试解析常见的Data Binding表达式
        if (expression.includes('viewModel.') || expression.includes('data.')) {
            return `/* TODO: Replace with state/viewModel: ${expression} */`;
        } else if (expression.includes('->')) {
            // Lambda表达式
            return `{ /* Data binding lambda: ${expression} */ }`;
        } else if (expression.includes('?')) {
            // 三元表达式
            return `/* TODO: Convert ternary expression: ${expression} */`;
        }
        return `/* TODO: Convert data binding expression: ${expression} */`;
    }

    // 处理主题属性引用 ?attr/
    if (value.startsWith('?attr/') || value.startsWith('?android:attr/')) {
        const attrName = value.replace('?attr/', '').replace('?android:attr/', '');
        // 映射常见的主题属性到MaterialTheme
        const themeMapping = {
            'colorPrimary': 'MaterialTheme.colorScheme.primary',
            'colorPrimaryDark': 'MaterialTheme.colorScheme.primaryContainer',
            'colorPrimaryVariant': 'MaterialTheme.colorScheme.primaryContainer',
            'colorSecondary': 'MaterialTheme.colorScheme.secondary',
            'colorSecondaryVariant': 'MaterialTheme.colorScheme.secondaryContainer',
            'colorAccent': 'MaterialTheme.colorScheme.secondary',
            'colorBackground': 'MaterialTheme.colorScheme.background',
            'colorSurface': 'MaterialTheme.colorScheme.surface',
            'colorError': 'MaterialTheme.colorScheme.error',
            'colorOnPrimary': 'MaterialTheme.colorScheme.onPrimary',
            'colorOnSecondary': 'MaterialTheme.colorScheme.onSecondary',
            'colorOnBackground': 'MaterialTheme.colorScheme.onBackground',
            'colorOnSurface': 'MaterialTheme.colorScheme.onSurface',
            'colorOnError': 'MaterialTheme.colorScheme.onError',
            'textColorPrimary': 'MaterialTheme.colorScheme.onBackground',
            'textColorSecondary': 'MaterialTheme.colorScheme.onSurfaceVariant',
            'selectableItemBackground': 'Modifier.clickable { }',
            'selectableItemBackgroundBorderless': 'Modifier.clickable { }',
            'actionBarSize': '56.dp',
            'listPreferredItemHeight': '48.dp'
        };
        return themeMapping[attrName] || `/* TODO: Map ?attr/${attrName} to MaterialTheme */`;
    }

    // 处理style引用
    if (value.startsWith('@style/')) {
        const styleName = value.replace('@style/', '');
        return `/* TODO: Apply style: ${styleName} - use MaterialTheme.typography or custom theme */`;
    }

    return value;
};

/**
 * 解析命名空间属性
 * @param {string} name - 属性名
 * @param {string} value - 属性值
 * @returns {Object} 解析后的属性对象
 */
export const parseNamespacedAttribute = (name, value) => {
    // 处理 tools: 命名空间（通常用于预览，转换时忽略）
    if (name.startsWith('tools:')) {
        return {
            name: name.replace('tools:', ''),
            value: parseResourceReference(value),
            comment: `// tools:${name.replace('tools:', '')} = "${value}" (preview only)`
        };
    }

    // 处理 app: 命名空间（自定义属性）
    if (name.startsWith('app:')) {
        return {
            name: name.replace('app:', ''),
            value: parseResourceReference(value),
            comment: `// Custom attribute: ${name} = "${value}"`
        };
    }

    // 处理 android: 命名空间（标准属性）
    if (name.startsWith('android:')) {
        return {
            name: name, // 保留完整的android:前缀
            value: parseResourceReference(value)
        };
    }

    // 其他属性直接返回
    return {
        name: name,
        value: parseResourceReference(value)
    };
};

/**
 * 验证XML语法
 * @param {string} xmlString - XML字符串
 * @returns {Object} 验证结果对象
 */
export const validateXmlSyntax = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const errors = [];

    // 检查解析错误
    const parseErrors = xmlDoc.getElementsByTagName("parsererror");
    if (parseErrors.length > 0) {
        errors.push({
            type: 'syntax',
            message: 'XML语法错误：' + parseErrors[0].textContent,
            severity: 'error'
        });
    }

    // 检查根元素
    if (!xmlDoc.documentElement) {
        errors.push({
            type: 'structure',
            message: '缺少根元素',
            severity: 'error'
        });
    }

    return { isValid: errors.length === 0, errors, xmlDoc };
};

