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

    const convertXmlToCompose = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const rootElement = xmlDoc.documentElement;
        if (xmlDoc.getElementsByTagName("parsererror").length) {
            return "Error: Invalid XML format. Please check your input.";
        }
        return formatCompose(parseNode(rootElement, 0));
    };

    const parseNode = (node, indentLevel) => {
        const tagName = node.tagName;
        const attributes = getAttributes(node);
        const children = Array.from(node.children);
        const composable = mapTagToComposable(tagName, attributes);
        let composeCode = `\n${indent(indentLevel)}${composable.name}(`;
        
        // 处理LazyVerticalGrid的特殊参数
        if (composable.name === 'LazyVerticalGrid') {
            Object.entries(composable.attributes).forEach(([key, value]) => {
                composeCode += `\n${indent(indentLevel + 1)}${key} = ${value},`;
            });
        }
        
        const modifiers = buildModifiers(attributes, indentLevel + 1, composable);
        if (modifiers) {
            composeCode += `\n${indent(indentLevel + 1)}modifier = Modifier${modifiers},`;
        }
        
        // 处理非LazyVerticalGrid的普通属性
        if (composable.name !== 'LazyVerticalGrid') {
            Object.entries(composable.attributes).forEach(([key, value]) => {
                composeCode += `\n${indent(indentLevel + 1)}${key} = ${value},`;
            });
        }
        
        if (children.length > 0 || (tagName === 'Button' && attributes['android:text'])) {
            composeCode += `\n${indent(indentLevel)}) {`;
            if (tagName === 'Button' && attributes['android:text']) {
                composeCode += `${indent(indentLevel + 1)}Text(text = "${attributes['android:text']}")`;
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

    const getAttributes = (node) => {
        const attrs = {};
        for (const attr of node.attributes) {
            attrs[attr.name] = attr.value;
        }
        return attrs;
    };

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
                if (attrs['android:text']) {
                    result.attributes.text = `"${attrs['android:text']}"`;
                }
                if (attrs['android:textSize']) {
                    result.attributes.fontSize = `${parseInt(attrs['android:textSize'])}.sp`;
                }
                if (attrs['android:textColor']) {
                    const color = attrs['android:textColor'];
                    if (color.startsWith('#')) {
                        result.attributes.color = `Color(0xFF${color.substring(1)})`;
                    }
                }
                if (attrs['android:textStyle']) {
                    const style = attrs['android:textStyle'];
                    if (style === 'bold') {
                        result.attributes.fontWeight = 'FontWeight.Bold';
                    } else if (style === 'italic') {
                        result.attributes.fontStyle = 'FontStyle.Italic';
                    }
                }
                if (attrs['android:fontFamily']) {
                    result.attributes.fontFamily = `FontFamily.${attrs['android:fontFamily']}`;
                }
                if (attrs['android:gravity']) {
                    const gravity = attrs['android:gravity'];
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
                    }
                    if (inputType.includes('textEmailAddress')) {
                        result.attributes.keyboardOptions = 'KeyboardOptions(keyboardType = KeyboardType.Email)';
                    }
                    if (inputType.includes('number')) {
                        result.attributes.keyboardOptions = 'KeyboardOptions(keyboardType = KeyboardType.Number)';
                    }
                }
                break;
            
            case 'CheckBox':
                result.name = 'Checkbox';
                result.attributes.checked = attrs['android:checked'] === 'true' ? 'true' : 'false';
                result.attributes.onCheckedChange = `{ /* TODO: Handle check change */ }`;
                break;
            
            case 'RadioButton':
                result.name = 'RadioButton';
                result.attributes.selected = attrs['android:checked'] === 'true' ? 'true' : 'false';
                result.attributes.onClick = `{ /* TODO: Handle radio selection */ }`;
                break;
            
            case 'Switch':
            case 'ToggleButton':
                result.name = 'Switch';
                result.attributes.checked = attrs['android:checked'] === 'true' ? 'true' : 'false';
                result.attributes.onCheckedChange = `{ /* TODO: Handle switch change */ }`;
                break;
            
            // 显示组件
            case 'ProgressBar':
                // 根据style判断是圆形还是线性进度条
                const style = attrs['style'];
                if (style && style.includes('Horizontal')) {
                    result.name = 'LinearProgressIndicator';
                    if (attrs['android:progress']) {
                        const progress = parseInt(attrs['android:progress']) / 100;
                        result.attributes.progress = `${progress}f`;
                    }
                } else {
                    result.name = 'CircularProgressIndicator';
                    if (attrs['android:progress']) {
                        const progress = parseInt(attrs['android:progress']) / 100;
                        result.attributes.progress = `${progress}f`;
                    }
                }
                break;
            
            case 'SeekBar':
                result.name = 'Slider';
                if (attrs['android:progress']) {
                    result.attributes.value = `${parseInt(attrs['android:progress'])}f`;
                }
                if (attrs['android:max']) {
                    result.attributes.valueRange = `0f..${parseInt(attrs['android:max'])}f`;
                }
                result.attributes.onValueChange = `{ /* TODO: Handle value change */ }`;
                break;
            
            case 'Spinner':
                result.name = 'ExposedDropdownMenuBox';
                result.attributes.expanded = 'false';
                result.attributes.onExpandedChange = `{ /* TODO: Handle dropdown state */ }`;
                // 注意：Spinner需要特殊的子元素处理
                result.needsSpecialHandling = 'dropdown';
                break;
            
            case 'WebView':
                result.name = 'AndroidView';
                result.attributes.factory = `{ context -> WebView(context) }`;
                if (attrs['android:url']) {
                    result.attributes.update = `{ webView -> webView.loadUrl("${attrs['android:url']}") }`;
                }
                break;
            
            default:
                result.name = 'Box';
        }
        return result;
    };

    const buildModifiers = (attrs, indentLevel, composable = {}) => {
        let modifierString = '';
        const indentStr = indent(indentLevel);
        
        // 处理宽度
        if (attrs['android:layout_width'] === 'match_parent') {
            modifierString += `\n${indentStr}.fillMaxWidth()`;
        } else if (attrs['android:layout_width'] === 'wrap_content') {
            modifierString += `\n${indentStr}.wrapContentWidth()`;
        } else if (attrs['android:layout_width']) {
            const width = parseInt(attrs['android:layout_width']);
            if (!isNaN(width)) {
                modifierString += `\n${indentStr}.width(${width}.dp)`;
            }
        }
        
        // 处理高度
        if (attrs['android:layout_height'] === 'match_parent') {
            modifierString += `\n${indentStr}.fillMaxHeight()`;
        } else if (attrs['android:layout_height'] === 'wrap_content') {
            modifierString += `\n${indentStr}.wrapContentHeight()`;
        } else if (attrs['android:layout_height']) {
            const height = parseInt(attrs['android:layout_height']);
            if (!isNaN(height)) {
                modifierString += `\n${indentStr}.height(${height}.dp)`;
            }
        }
        
        // 处理padding
        if (attrs['android:padding']) {
            const padding = parseInt(attrs['android:padding']);
            if (!isNaN(padding)) {
                modifierString += `\n${indentStr}.padding(${padding}.dp)`;
            }
        }
        
        // 处理独立的padding
        const paddingStart = attrs['android:paddingStart'] || attrs['android:paddingLeft'];
        const paddingTop = attrs['android:paddingTop'];
        const paddingEnd = attrs['android:paddingEnd'] || attrs['android:paddingRight'];
        const paddingBottom = attrs['android:paddingBottom'];
        
        if (paddingStart || paddingTop || paddingEnd || paddingBottom) {
            const start = paddingStart ? parseInt(paddingStart) : 0;
            const top = paddingTop ? parseInt(paddingTop) : 0;
            const end = paddingEnd ? parseInt(paddingEnd) : 0;
            const bottom = paddingBottom ? parseInt(paddingBottom) : 0;
            
            if (!isNaN(start) || !isNaN(top) || !isNaN(end) || !isNaN(bottom)) {
                modifierString += `\n${indentStr}.padding(start = ${start || 0}.dp, top = ${top || 0}.dp, end = ${end || 0}.dp, bottom = ${bottom || 0}.dp)`;
            }
        }
        
        // 处理margin (注意：Compose中margin通过父容器的padding或spacer实现)
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

    const formatCompose = (code) => {
        return code.replace(/,(\n\s*\})/g, '$1')
                    .replace(/\n\s*\n/g, '\n')
                    .trim();
    };

    const indent = (level) => '    '.repeat(level);

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