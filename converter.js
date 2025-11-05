// 全局函数定义

// 工具函数
const indent = (level) => '    '.repeat(level);

const getAttributes = (node) => {
    const attrs = {};
    for (const attr of node.attributes) {
        attrs[attr.name] = attr.value;
    }
    return attrs;
};

const formatCompose = (code) => {
    return code.replace(/,(\n\s*\})/g, '$1')
                .replace(/\n\s*\n/g, '\n')
                .trim();
};

// 资源引用解析器
const parseResourceReference = (value) => {
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
    
    return value;
};

// 命名空间属性处理器
const parseNamespacedAttribute = (name, value) => {
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

// XML语法验证器
const validateXmlSyntax = (xmlString) => {
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

// 特殊标签处理器
const handleSpecialTags = (node, indentLevel) => {
    const tagName = node.tagName;
    
    switch (tagName) {
        case 'include':
            const layout = node.getAttribute('layout');
            if (layout) {
                const layoutName = layout.replace('@layout/', '');
                return `\n${indent(indentLevel)}// TODO: Include layout: ${layoutName}\n${indent(indentLevel)}// ${layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}()`;
            }
            return `\n${indent(indentLevel)}// TODO: Handle include tag`;
            
        case 'merge':
            // merge标签的子元素直接展开
            const children = Array.from(node.children);
            let mergeCode = `\n${indent(indentLevel)}// TODO: Merge tag - children should be placed directly in parent`;
            children.forEach(child => {
                mergeCode += parseNode(child, indentLevel);
            });
            return mergeCode;
            
        case 'fragment':
            const fragmentName = node.getAttribute('android:name') || node.getAttribute('class');
            if (fragmentName) {
                const simpleName = fragmentName.split('.').pop();
                return `\n${indent(indentLevel)}// TODO: Replace with Composable: ${simpleName}()\n${indent(indentLevel)}AndroidView(factory = { context -> /* Fragment container */ })`;
            }
            return `\n${indent(indentLevel)}// TODO: Handle fragment tag`;
            
        default:
            return null;
    }
};

// 属性验证器
const validateAttributes = (tagName, attributes) => {
    const warnings = [];
    const suggestions = [];
    
    // 检查不支持的属性
    const unsupportedAttrs = {
        'android:layout_alignParentTop': 'Use Box with Alignment.TopStart',
        'android:layout_alignParentBottom': 'Use Box with Alignment.BottomStart',
        'android:layout_centerInParent': 'Use Box with Alignment.Center',
        'android:layout_toRightOf': 'Use ConstraintLayout or Row arrangement',
        'android:layout_below': 'Use ConstraintLayout or Column arrangement',
        'android:drawableLeft': 'Use Row with Icon and Text',
        'android:drawableRight': 'Use Row with Text and Icon',
        'android:drawableTop': 'Use Column with Icon and Text',
        'android:drawableBottom': 'Use Column with Text and Icon'
    };
    
    Object.keys(attributes).forEach(attr => {
        if (unsupportedAttrs[attr]) {
            warnings.push({
                type: 'unsupported',
                message: `属性 ${attr} 不直接支持`,
                suggestion: unsupportedAttrs[attr]
            });
        }
    });
    
    // 最佳实践检查
    if (tagName === 'ScrollView' && attributes['android:orientation'] === 'vertical') {
        suggestions.push({
            type: 'best_practice',
            message: '建议使用 LazyColumn 替代 ScrollView + LinearLayout 以获得更好的性能'
        });
    }
    
    if (tagName === 'LinearLayout' && attributes['android:layout_weight']) {
        suggestions.push({
            type: 'best_practice',
            message: 'layout_weight 在 Compose 中使用 Modifier.weight() 实现'
        });
    }
    
    // 版本兼容性检查
    const material3Components = ['TextField', 'Button', 'Checkbox', 'Switch'];
    if (material3Components.includes(tagName)) {
        suggestions.push({
            type: 'version',
            message: `${tagName} 使用 Material3 组件，确保项目使用 Compose BOM 2023.03.00 或更高版本`
        });
    }
    
    return { warnings, suggestions };
};

// 性能优化建议
const generatePerformanceTips = (rootElement) => {
    const tips = [];
    
    // 检查深度嵌套
    const checkNestingDepth = (node, depth = 0) => {
        if (depth > 5) {
            tips.push('检测到深度嵌套布局，考虑使用 ConstraintLayout 减少嵌套层级');
            return;
        }
        Array.from(node.children).forEach(child => {
            checkNestingDepth(child, depth + 1);
        });
    };
    
    checkNestingDepth(rootElement);
    
    // 检查大量子元素
    const checkLargeList = (node) => {
        if (node.children.length > 10 && node.tagName === 'LinearLayout') {
            tips.push('检测到大量子元素，建议使用 LazyColumn/LazyRow 提升性能');
        }
        Array.from(node.children).forEach(child => checkLargeList(child));
    };
    
    checkLargeList(rootElement);
    
    return tips;
};

// parseNode函数
const parseNode = (node, indentLevel) => {
    const tagName = node.tagName;
    
    // 首先检查是否是特殊标签
    const specialTagResult = handleSpecialTags(node, indentLevel);
    if (specialTagResult !== null) {
        return specialTagResult;
    }
    
    const rawAttributes = getAttributes(node);
    const children = Array.from(node.children);
    
    // 处理命名空间属性
    const processedAttributes = {};
    const attributeComments = [];
    
    Object.entries(rawAttributes).forEach(([name, value]) => {
        const parsed = parseNamespacedAttribute(name, value);
        if (parsed.comment) {
            attributeComments.push(parsed.comment);
        }
        processedAttributes[parsed.name] = parsed.value;
    });
    
    const composable = mapTagToComposable(tagName, processedAttributes);
    let composeCode = '';
    
    // 添加属性注释
    if (attributeComments.length > 0) {
        composeCode += `\n${indent(indentLevel)}${attributeComments.join('\n' + indent(indentLevel))}`;
    }
    
    composeCode += `\n${indent(indentLevel)}${composable.name}(`;
    
    // 处理LazyVerticalGrid的特殊参数
    if (composable.name === 'LazyVerticalGrid') {
        Object.entries(composable.attributes).forEach(([key, value]) => {
            composeCode += `\n${indent(indentLevel + 1)}${key} = ${value},`;
        });
    }
    
    const modifiers = buildModifiers(processedAttributes, indentLevel + 1, composable);
    if (modifiers) {
        composeCode += `\n${indent(indentLevel + 1)}modifier = Modifier${modifiers},`;
    }
    
    // 处理非LazyVerticalGrid的普通属性
    if (composable.name !== 'LazyVerticalGrid') {
        Object.entries(composable.attributes).forEach(([key, value]) => {
            composeCode += `\n${indent(indentLevel + 1)}${key} = ${value},`;
        });
    }
    
    if (children.length > 0 || (tagName === 'Button' && processedAttributes['text'])) {
        composeCode += `\n${indent(indentLevel)}) {`;
        if (tagName === 'Button' && processedAttributes['text']) {
            composeCode += `\n${indent(indentLevel + 1)}Text(text = ${processedAttributes['text']})`;
        }
        
        // 处理LazyVerticalGrid的子元素
        if (composable.name === 'LazyVerticalGrid') {
            children.forEach(child => {
                composeCode += `\n${indent(indentLevel + 1)}item {`;
                composeCode += parseNode(child, indentLevel + 2);
                composeCode += `\n${indent(indentLevel + 1)}}`;
            });
        } else {
            children.forEach(child => {
                composeCode += parseNode(child, indentLevel + 1);
            });
        }
        composeCode += `\n${indent(indentLevel)}}`;
    } else {
        composeCode += `\n${indent(indentLevel)})`;
    }
    return composeCode;
};

// mapTagToComposable函数
const mapTagToComposable = (tag, attrs) => {
    const result = { name: tag, attributes: {} };
    switch (tag) {
        case 'LinearLayout':
            result.name = attrs['android:orientation'] === 'horizontal' ? 'Row' : 'Column';
            break;
        
        case 'ConstraintLayout':
            result.name = 'ConstraintLayout';
            // ConstraintLayout需要特殊处理，暂时用Box代替并添加注释
            result.name = 'Box'; // TODO: 需要添加ConstraintLayout依赖
            break;
        
        case 'RelativeLayout':
            result.name = 'Box';
            // RelativeLayout的相对定位通过Alignment实现
            break;
        
        case 'FrameLayout':
            result.name = 'Box';
            break;
        
        case 'ScrollView':
            result.name = 'Column';
            // ScrollView转换为Column + verticalScroll modifier
            result.scrollable = 'vertical';
            break;
        
        case 'HorizontalScrollView':
            result.name = 'Row';
            // HorizontalScrollView转换为Row + horizontalScroll modifier
            result.scrollable = 'horizontal';
            break;
        
        case 'GridLayout':
            result.name = 'LazyVerticalGrid';
            // 处理网格列数
            const columnCount = attrs['android:columnCount'] || '2';
            result.attributes.columns = `GridCells.Fixed(${columnCount})`;
            break;
        
        case 'TextView':
            result.name = 'Text';
            if (attrs['text']) {
                // 处理资源引用或直接文本
                if (attrs['text'].startsWith('stringResource(')) {
                    result.attributes.text = attrs['text'];
                } else {
                    result.attributes.text = `"${attrs['text']}"`;
                }
            }
            if (attrs['textSize']) {
                if (attrs['textSize'].startsWith('dimensionResource(')) {
                    result.attributes.fontSize = attrs['textSize'];
                } else {
                    result.attributes.fontSize = `${parseInt(attrs['textSize'])}.sp`;
                }
            }
            if (attrs['textColor']) {
                const color = attrs['textColor'];
                if (color.startsWith('colorResource(') || color.startsWith('Color.')) {
                    result.attributes.color = color;
                } else if (color.startsWith('#')) {
                    result.attributes.color = `Color(0xFF${color.substring(1)})`;
                }
            }
            if (attrs['textStyle']) {
                const style = attrs['textStyle'];
                if (style === 'bold') {
                    result.attributes.fontWeight = 'FontWeight.Bold';
                } else if (style === 'italic') {
                    result.attributes.fontStyle = 'FontStyle.Italic';
                }
            }
            if (attrs['fontFamily']) {
                result.attributes.fontFamily = `FontFamily.${attrs['fontFamily']}`;
            }
            if (attrs['gravity']) {
                const gravity = attrs['gravity'];
                if (gravity.includes('center')) {
                    result.attributes.textAlign = 'TextAlign.Center';
                } else if (gravity.includes('end') || gravity.includes('right')) {
                    result.attributes.textAlign = 'TextAlign.End';
                } else if (gravity.includes('start') || gravity.includes('left')) {
                    result.attributes.textAlign = 'TextAlign.Start';
                }
            }
            break;
        
        case 'Button':
            result.name = 'Button';
            break;
        
        case 'ImageView':
            result.name = 'Image';
            result.attributes.painter = `painterResource(id = R.drawable.placeholder)`;
            result.attributes.contentDescription = `"${attrs['android:contentDescription'] || 'Image'}"`;
            break;
        
        // 输入组件
        case 'EditText':
            result.name = 'TextField';
            if (attrs['android:hint']) {
                result.attributes.placeholder = `{ Text("${attrs['android:hint']}") }`;
            }
            if (attrs['android:text']) {
                result.attributes.value = `"${attrs['android:text']}"`;
            }
            result.attributes.onValueChange = `{ /* TODO: Handle text change */ }`;
            // 根据inputType选择合适的TextField类型
            const inputType = attrs['android:inputType'];
            if (inputType) {
                if (inputType.includes('textPassword')) {
                    result.attributes.visualTransformation = 'PasswordVisualTransformation()';
                } else if (inputType.includes('number')) {
                    result.attributes.keyboardOptions = 'KeyboardOptions(keyboardType = KeyboardType.Number)';
                } else if (inputType.includes('textEmailAddress')) {
                    result.attributes.keyboardOptions = 'KeyboardOptions(keyboardType = KeyboardType.Email)';
                }
            }
            break;
        
        // 选择组件
        case 'CheckBox':
            result.name = 'Checkbox';
            result.attributes.checked = 'false';
            result.attributes.onCheckedChange = '{ /* TODO: Handle check change */ }';
            break;
        
        case 'RadioButton':
            result.name = 'RadioButton';
            result.attributes.selected = 'false';
            result.attributes.onClick = '{ /* TODO: Handle radio selection */ }';
            break;
        
        case 'Switch':
        case 'ToggleButton':
            result.name = 'Switch';
            result.attributes.checked = 'false';
            result.attributes.onCheckedChange = '{ /* TODO: Handle switch change */ }';
            break;
        
        // 进度组件
        case 'ProgressBar':
            const style = attrs['style'];
            if (style && style.includes('Horizontal')) {
                result.name = 'LinearProgressIndicator';
                result.attributes.progress = '0.5f';
            } else {
                result.name = 'CircularProgressIndicator';
            }
            break;
        
        case 'SeekBar':
            result.name = 'Slider';
            result.attributes.value = '0.5f';
            result.attributes.onValueChange = '{ /* TODO: Handle slider change */ }';
            break;
        
        case 'Spinner':
            result.name = 'ExposedDropdownMenuBox';
            result.attributes.expanded = 'false';
            result.attributes.onExpandedChange = '{ /* TODO: Handle dropdown */ }';
            break;
        
        case 'WebView':
            result.name = 'AndroidView';
            result.attributes.factory = '{ context -> WebView(context) }';
            break;
        
        default:
            result.name = 'Box'; // 未知组件用Box代替
            break;
    }
    return result;
};

// buildModifiers函数
const buildModifiers = (attrs, indentLevel, composable) => {
    let modifierString = '';
    const indentStr = indent(indentLevel);
    
    // 处理尺寸
    const width = attrs['android:layout_width'];
    const height = attrs['android:layout_height'];
    
    if (width === 'match_parent') {
        modifierString += `\n${indentStr}.fillMaxWidth()`;
    } else if (width === 'wrap_content') {
        // wrap_content是默认行为，不需要特殊处理
    } else if (width && width.includes('dp')) {
        const widthValue = parseInt(width);
        if (!isNaN(widthValue)) {
            modifierString += `\n${indentStr}.width(${widthValue}.dp)`;
        }
    }
    
    if (height === 'match_parent') {
        modifierString += `\n${indentStr}.fillMaxHeight()`;
    } else if (height === 'wrap_content') {
        // wrap_content是默认行为，不需要特殊处理
    } else if (height && height.includes('dp')) {
        const heightValue = parseInt(height);
        if (!isNaN(heightValue)) {
            modifierString += `\n${indentStr}.height(${heightValue}.dp)`;
        }
    }
    
    // 处理内边距
    const padding = attrs['android:padding'];
    const paddingStart = attrs['android:paddingStart'] || attrs['android:paddingLeft'];
    const paddingTop = attrs['android:paddingTop'];
    const paddingEnd = attrs['android:paddingEnd'] || attrs['android:paddingRight'];
    const paddingBottom = attrs['android:paddingBottom'];
    
    if (padding) {
        const paddingValue = parseInt(padding);
        if (!isNaN(paddingValue)) {
            modifierString += `\n${indentStr}.padding(${paddingValue}.dp)`;
        }
    } else if (paddingStart || paddingTop || paddingEnd || paddingBottom) {
        const start = paddingStart ? parseInt(paddingStart) : 0;
        const top = paddingTop ? parseInt(paddingTop) : 0;
        const end = paddingEnd ? parseInt(paddingEnd) : 0;
        const bottom = paddingBottom ? parseInt(paddingBottom) : 0;
        
        if (!isNaN(start) || !isNaN(top) || !isNaN(end) || !isNaN(bottom)) {
            modifierString += `\n${indentStr}.padding(start = ${start || 0}.dp, top = ${top || 0}.dp, end = ${end || 0}.dp, bottom = ${bottom || 0}.dp)`;
        }
    }
    
    // 处理外边距（在Compose中通过父容器的spacer或padding实现）
    const marginStart = attrs['android:layout_marginStart'] || attrs['android:layout_marginLeft'];
    const marginTop = attrs['android:layout_marginTop'];
    const marginEnd = attrs['android:layout_marginEnd'] || attrs['android:layout_marginRight'];
    const marginBottom = attrs['android:layout_marginBottom'];
    const margin = attrs['android:layout_margin'];
    
    if (margin) {
        const marginValue = parseInt(margin);
        if (!isNaN(marginValue)) {
            // 在Compose中，margin通过父容器的spacer或padding实现
            // 这里添加注释提示需要在父容器中处理
            modifierString += `\n${indentStr}/* TODO: Add margin ${marginValue}dp in parent container */`;
        }
    } else if (marginStart || marginTop || marginEnd || marginBottom) {
        const start = marginStart ? parseInt(marginStart) : 0;
        const top = marginTop ? parseInt(marginTop) : 0;
        const end = marginEnd ? parseInt(marginEnd) : 0;
        const bottom = marginBottom ? parseInt(marginBottom) : 0;
        
        if (!isNaN(start) || !isNaN(top) || !isNaN(end) || !isNaN(bottom)) {
            modifierString += `\n${indentStr}/* TODO: Add margins (start=${start || 0}dp, top=${top || 0}dp, end=${end || 0}dp, bottom=${bottom || 0}dp) in parent container */`;
        }
    }
    
    // 处理滚动
    if (composable && composable.scrollable) {
        if (composable.scrollable === 'vertical') {
            modifierString += `\n${indentStr}.verticalScroll(rememberScrollState())`;
        } else if (composable.scrollable === 'horizontal') {
            modifierString += `\n${indentStr}.horizontalScroll(rememberScrollState())`;
        }
    }
    
    // 处理背景
    if (attrs['android:background']) {
        const background = attrs['android:background'];
        if (background.startsWith('#')) {
            // 处理纯色背景
            let color = background.replace('#', '');
            if (color.length === 6) {
                color = 'FF' + color; // 添加alpha通道
            }
            modifierString += `\n${indentStr}.background(Color(0x${color.toUpperCase()}))`;
        } else if (background.startsWith('@drawable/')) {
            // 处理图片背景
            const drawableName = background.replace('@drawable/', '');
            modifierString += `\n${indentStr}.background(/* TODO: Replace with painterResource(R.drawable.${drawableName}) */)`;
        } else if (background.startsWith('@color/')) {
            // 处理颜色资源引用
            const colorName = background.replace('@color/', '');
            modifierString += `\n${indentStr}.background(/* TODO: Replace with colorResource(R.color.${colorName}) */)`;
        } else if (background.includes('gradient')) {
            // 处理渐变背景（简化处理）
            modifierString += `\n${indentStr}.background(/* TODO: Implement gradient background using Brush.linearGradient() */)`;
        }
    }
    
    // 处理背景色（android:backgroundColor）
    if (attrs['android:backgroundColor']) {
        const backgroundColor = attrs['android:backgroundColor'];
        if (backgroundColor.startsWith('#')) {
            let color = backgroundColor.replace('#', '');
            if (color.length === 6) {
                color = 'FF' + color;
            }
            modifierString += `\n${indentStr}.background(Color(0x${color.toUpperCase()}))`;
        }
    }
    
    // 处理可见性
    if (attrs['android:visibility']) {
        const visibility = attrs['android:visibility'];
        if (visibility === 'gone') {
            modifierString += `\n${indentStr}.height(0.dp)`;
        } else if (visibility === 'invisible') {
            modifierString += `\n${indentStr}.alpha(0f)`;
        }
        // visible是默认状态，不需要特殊处理
    }
    
    // 处理layout_gravity (用于父容器中的对齐)
    if (attrs['android:layout_gravity']) {
        const gravity = attrs['android:layout_gravity'];
        // 这个需要在父容器中处理，这里只是标记
        modifierString += `\n${indentStr}/* TODO: Apply layout_gravity '${gravity}' in parent container */`;
    }
    
    // 处理重力对齐（主要用于TextView等组件内部对齐）
    if (attrs['android:gravity']) {
        const gravity = attrs['android:gravity'];
        modifierString += `\n${indentStr}/* TODO: Apply gravity '${gravity}' - use textAlign for Text or Arrangement/Alignment for layouts */`;
    }
    
    // 处理点击事件
    if (attrs['android:onClick']) {
        modifierString += `\n${indentStr}.clickable { /* TODO: Handle ${attrs['android:onClick']} */ }`;
    }
    
    // 处理启用/禁用状态
    if (attrs['android:enabled'] === 'false') {
        modifierString += `\n${indentStr}.alpha(0.6f)`; // 视觉上表示禁用状态
    }
    
    // 处理焦点
    if (attrs['android:focusable'] === 'true') {
        modifierString += `\n${indentStr}.focusable()`;
    }
    
    // 处理旋转
    if (attrs['android:rotation']) {
        const rotation = parseFloat(attrs['android:rotation']);
        if (!isNaN(rotation)) {
            modifierString += `\n${indentStr}.rotate(${rotation}f)`;
        }
    }
    
    // 处理缩放
    if (attrs['android:scaleX'] || attrs['android:scaleY']) {
        const scaleX = attrs['android:scaleX'] ? parseFloat(attrs['android:scaleX']) : 1.0;
        const scaleY = attrs['android:scaleY'] ? parseFloat(attrs['android:scaleY']) : 1.0;
        if (!isNaN(scaleX) && !isNaN(scaleY)) {
            modifierString += `\n${indentStr}.scale(scaleX = ${scaleX}f, scaleY = ${scaleY}f)`;
        }
    }
    
    // 处理透明度
    if (attrs['android:alpha']) {
        const alpha = parseFloat(attrs['android:alpha']);
        if (!isNaN(alpha)) {
            modifierString += `\n${indentStr}.alpha(${alpha}f)`;
        }
    }
    
    // 处理最小宽度和高度
    if (attrs['android:minWidth']) {
        const minWidth = parseInt(attrs['android:minWidth']);
        if (!isNaN(minWidth)) {
            modifierString += `\n${indentStr}.widthIn(min = ${minWidth}.dp)`;
        }
    }
    
    if (attrs['android:minHeight']) {
        const minHeight = parseInt(attrs['android:minHeight']);
        if (!isNaN(minHeight)) {
            modifierString += `\n${indentStr}.heightIn(min = ${minHeight}.dp)`;
        }
    }
    
    // 处理最大宽度和高度
    if (attrs['android:maxWidth']) {
        const maxWidth = parseInt(attrs['android:maxWidth']);
        if (!isNaN(maxWidth)) {
            modifierString += `\n${indentStr}.widthIn(max = ${maxWidth}.dp)`;
        }
    }
    
    if (attrs['android:maxHeight']) {
        const maxHeight = parseInt(attrs['android:maxHeight']);
        if (!isNaN(maxHeight)) {
            modifierString += `\n${indentStr}.heightIn(max = ${maxHeight}.dp)`;
        }
    }
    
    // 处理边框
    if (attrs['android:background'] && attrs['android:background'].includes('stroke')) {
        modifierString += `\n${indentStr}.border(/* TODO: Extract stroke width and color from drawable */)`;
    }
    
    return modifierString;
};

// 将convertXmlToCompose函数移到全局作用域
const convertXmlToCompose = (xmlString) => {
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

// 智能导入生成器
const generateImports = (rootElement) => {
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
                usedComponents.add('Box'); // 暂时用Box代替
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
        if (attributes['android:layout_margin']) usedModifiers.add('padding'); // margin通过padding实现
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

document.addEventListener('DOMContentLoaded', () => {
    const xmlInput = document.getElementById('xml-input');
    const composeOutput = document.getElementById('compose-output');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const loadSampleBtn = document.getElementById('load-sample-btn');

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

    const loadSample = () => {
        xmlInput.value = sampleXml;
        performConversion();
    };

    const loadExample = () => {
        const exampleXml = `<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp">
    
    <!-- 标题 -->
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="UI组件示例"
        android:textSize="24sp"
        android:textStyle="bold"
        android:textColor="#FF0000"
        android:gravity="center"
        android:layout_marginBottom="16dp" />
    
    <!-- 输入框 -->
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="请输入用户名"
        android:inputType="text"
        android:layout_marginBottom="12dp" />
    
    <!-- 密码输入框 -->
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="请输入密码"
        android:inputType="textPassword"
        android:layout_marginBottom="12dp" />
    
    <!-- 复选框 -->
    <CheckBox
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="记住密码"
        android:checked="true"
        android:layout_marginBottom="12dp" />
    
    <!-- 开关 -->
    <Switch
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="启用通知"
        android:checked="false"
        android:layout_marginBottom="12dp" />
    
    <!-- 进度条 -->
    <ProgressBar
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:progress="65"
        android:max="100"
        android:layout_marginBottom="12dp" />
    
    <!-- 滑块 -->
    <SeekBar
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:progress="30"
        android:max="100"
        android:layout_marginBottom="12dp" />
    
    <!-- 下拉选择器 -->
    <Spinner
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp" />
    
    <!-- 按钮 -->
    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="提交" />
        
</LinearLayout>`;
        xmlInput.value = exampleXml;
        performConversion();
    };

    const clearInputs = () => {
        xmlInput.value = '';
        composeOutput.textContent = '';
        hljs.highlightElement(composeOutput);
    };

    const copyToClipboard = () => {
        const codeToCopy = composeOutput.textContent;
        navigator.clipboard.writeText(codeToCopy).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            copyBtn.textContent = 'Error';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        });
    };

    const performConversion = () => {
        const xmlCode = xmlInput.value;
        if (!xmlCode.trim()) {
            composeOutput.textContent = '';
            hljs.highlightElement(composeOutput);
            return;
        }
        const composeCode = convertXmlToCompose(xmlCode);
        composeOutput.textContent = composeCode;
        hljs.highlightElement(composeOutput);
    };

    // 只在元素存在时绑定事件监听器
    if (convertBtn) convertBtn.addEventListener('click', performConversion);
    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
    if (clearBtn) clearBtn.addEventListener('click', clearInputs);
    if (loadSampleBtn) loadSampleBtn.addEventListener('click', loadSample);

    // 只在主转换页面加载示例
    if (loadSampleBtn && xmlInput && composeOutput) {
        loadSample();
    }
});