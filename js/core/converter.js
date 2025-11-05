/**
 * 核心转换引擎模块
 * 负责XML节点到Compose组件的转换
 */

import { getAttributes, parseNamespacedAttribute } from './parser.js';
import { indent } from './generator.js';

/**
 * 处理特殊标签
 * @param {Element} node - XML节点
 * @param {number} indentLevel - 缩进级别
 * @returns {string|null} Compose代码或null
 */
export const handleSpecialTags = (node, indentLevel) => {
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

/**
 * 将XML标签映射到Composable组件
 * @param {string} tag - XML标签名
 * @param {Object} attrs - 属性对象
 * @returns {Object} Composable配置对象
 */
export const mapTagToComposable = (tag, attrs) => {
    const result = { name: tag, attributes: {} };
    
    switch (tag) {
        case 'LinearLayout':
            result.name = attrs['android:orientation'] === 'horizontal' ? 'Row' : 'Column';
            break;
        
        case 'ConstraintLayout':
            result.name = 'Box'; // TODO: 需要添加ConstraintLayout依赖
            break;
        
        case 'RelativeLayout':
        case 'FrameLayout':
            result.name = 'Box';
            break;
        
        case 'ScrollView':
            result.name = 'Column';
            result.scrollable = 'vertical';
            break;
        
        case 'HorizontalScrollView':
            result.name = 'Row';
            result.scrollable = 'horizontal';
            break;
        
        case 'GridLayout':
            result.name = 'LazyVerticalGrid';
            const columnCount = attrs['android:columnCount'] || '2';
            result.attributes.columns = `GridCells.Fixed(${columnCount})`;
            break;
        
        case 'TextView':
            result.name = 'Text';
            if (attrs['text']) {
                result.attributes.text = attrs['text'].startsWith('stringResource(') 
                    ? attrs['text'] 
                    : `"${attrs['text']}"`;
            }
            if (attrs['textSize']) {
                result.attributes.fontSize = attrs['textSize'].startsWith('dimensionResource(')
                    ? attrs['textSize']
                    : `${parseInt(attrs['textSize'])}.sp`;
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
                if (style === 'bold') result.attributes.fontWeight = 'FontWeight.Bold';
                else if (style === 'italic') result.attributes.fontStyle = 'FontStyle.Italic';
            }
            if (attrs['fontFamily']) {
                result.attributes.fontFamily = `FontFamily.${attrs['fontFamily']}`;
            }
            if (attrs['gravity']) {
                const gravity = attrs['gravity'];
                if (gravity.includes('center')) result.attributes.textAlign = 'TextAlign.Center';
                else if (gravity.includes('end') || gravity.includes('right')) result.attributes.textAlign = 'TextAlign.End';
                else if (gravity.includes('start') || gravity.includes('left')) result.attributes.textAlign = 'TextAlign.Start';
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
        
        case 'EditText':
            result.name = 'TextField';
            if (attrs['android:hint']) {
                result.attributes.placeholder = `{ Text("${attrs['android:hint']}") }`;
            }
            if (attrs['android:text']) {
                result.attributes.value = `"${attrs['android:text']}"`;
            }
            result.attributes.onValueChange = `{ /* TODO: Handle text change */ }`;
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
            result.name = 'Box';
            break;
    }
    return result;
};

/**
 * 构建Modifier链
 * @param {Object} attrs - 属性对象
 * @param {number} indentLevel - 缩进级别
 * @param {Object} composable - Composable配置对象
 * @returns {string} Modifier代码
 */
export const buildModifiers = (attrs, indentLevel, composable) => {
    let modifierString = '';
    const indentStr = indent(indentLevel);
    
    // 处理尺寸
    const width = attrs['android:layout_width'];
    const height = attrs['android:layout_height'];
    
    if (width === 'match_parent') {
        modifierString += `\n${indentStr}.fillMaxWidth()`;
    } else if (width === 'wrap_content') {
        // wrap_content是默认行为
    } else if (width && width.includes('dp')) {
        const widthValue = parseInt(width);
        if (!isNaN(widthValue)) {
            modifierString += `\n${indentStr}.width(${widthValue}.dp)`;
        }
    }
    
    if (height === 'match_parent') {
        modifierString += `\n${indentStr}.fillMaxHeight()`;
    } else if (height === 'wrap_content') {
        // wrap_content是默认行为
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
    
    // 处理外边距
    const marginStart = attrs['android:layout_marginStart'] || attrs['android:layout_marginLeft'];
    const marginTop = attrs['android:layout_marginTop'];
    const marginEnd = attrs['android:layout_marginEnd'] || attrs['android:layout_marginRight'];
    const marginBottom = attrs['android:layout_marginBottom'];
    const margin = attrs['android:layout_margin'];
    
    if (margin) {
        const marginValue = parseInt(margin);
        if (!isNaN(marginValue)) {
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
            let color = background.replace('#', '');
            if (color.length === 6) {
                color = 'FF' + color;
            }
            modifierString += `\n${indentStr}.background(Color(0x${color.toUpperCase()}))`;
        } else if (background.startsWith('@drawable/')) {
            const drawableName = background.replace('@drawable/', '');
            modifierString += `\n${indentStr}.background(/* TODO: Replace with painterResource(R.drawable.${drawableName}) */)`;
        } else if (background.startsWith('@color/')) {
            const colorName = background.replace('@color/', '');
            modifierString += `\n${indentStr}.background(/* TODO: Replace with colorResource(R.color.${colorName}) */)`;
        } else if (background.includes('gradient')) {
            modifierString += `\n${indentStr}.background(/* TODO: Implement gradient background using Brush.linearGradient() */)`;
        }
    }
    
    // 处理背景色
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
    }
    
    // 处理点击事件
    if (attrs['android:onClick']) {
        modifierString += `\n${indentStr}.clickable { /* TODO: Handle ${attrs['android:onClick']} */ }`;
    }
    
    // 处理启用/禁用状态
    if (attrs['android:enabled'] === 'false') {
        modifierString += `\n${indentStr}.alpha(0.6f)`;
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
    
    return modifierString;
};

/**
 * 解析XML节点并转换为Compose代码
 * @param {Element} node - XML节点
 * @param {number} indentLevel - 缩进级别
 * @returns {string} Compose代码
 */
export const parseNode = (node, indentLevel) => {
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

