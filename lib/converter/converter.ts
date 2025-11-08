/**
 * 核心转换引擎模块
 * 负责XML节点到Compose组件的转换
 */

import { getAttributes, parseResourceReference, parseColor } from './parser';
import { indent } from './generator';
import type { ComposableConfig } from './types';

/**
 * 处理特殊标签
 */
export function handleSpecialTags(node: Element, indentLevel: number): string | null {
  const tagName = node.tagName;

  switch (tagName) {
    case 'include':
      const layout = node.getAttribute('layout');
      if (layout) {
        const layoutName = layout.replace('@layout/', '');
        const composableName = layoutName.charAt(0).toUpperCase() + layoutName.slice(1);
        return `\n${indent(indentLevel)}// TODO: Include layout: ${layoutName}\n${indent(indentLevel)}// ${composableName}()`;
      }
      return `\n${indent(indentLevel)}// TODO: Handle include tag`;

    case 'merge':
      const children = Array.from(node.children);
      let mergeCode = `\n${indent(indentLevel)}// TODO: Merge tag - children should be placed directly in parent`;
      children.forEach(child => {
        if (child instanceof Element) {
          mergeCode += parseNode(child, indentLevel);
        }
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
}

/**
 * 将XML标签映射到Composable组件
 */
export function mapTagToComposable(tag: string, attrs: Record<string, string>): ComposableConfig {
  const result: ComposableConfig = { name: tag, attributes: {} };

  switch (tag) {
    case 'LinearLayout':
      result.name = attrs['android:orientation'] === 'horizontal' ? 'Row' : 'Column';
      break;

    case 'ConstraintLayout':
      result.name = 'Box';
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
        result.attributes.text = attrs['text'].startsWith('stringResource')
          ? attrs['text']
          : `"${attrs['text']}"`;
      }
      if (attrs['textSize']) {
        const size = parseInt(attrs['textSize']) || 16;
        result.attributes.fontSize = `${size}.sp`;
      }
      if (attrs['textColor']) {
        result.attributes.color = parseColor(attrs['textColor']);
      }
      if (attrs['textStyle']) {
        if (attrs['textStyle'] === 'bold') result.attributes.fontWeight = 'FontWeight.Bold';
        if (attrs['textStyle'] === 'italic') result.attributes.fontStyle = 'FontStyle.Italic';
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
      break;

    case 'CheckBox':
      result.name = 'Checkbox';
      result.attributes.checked = 'false';
      result.attributes.onCheckedChange = '{ /* TODO */ }';
      break;

    case 'RadioButton':
      result.name = 'RadioButton';
      result.attributes.selected = 'false';
      result.attributes.onClick = '{ /* TODO */ }';
      break;

    case 'Switch':
    case 'ToggleButton':
      result.name = 'Switch';
      result.attributes.checked = 'false';
      result.attributes.onCheckedChange = '{ /* TODO */ }';
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
      result.attributes.onValueChange = '{ /* TODO */ }';
      break;

    case 'Spinner':
      result.name = 'ExposedDropdownMenuBox';
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
}

/**
 * 构建Modifier链
 */
export function buildModifiers(attrs: Record<string, string>, indentLevel: number, composable: ComposableConfig): string {
  let modifierString = '';
  const indentStr = indent(indentLevel);

  // 处理尺寸
  const width = attrs['android:layout_width'];
  const height = attrs['android:layout_height'];

  if (width === 'match_parent') {
    modifierString += `\n${indentStr}.fillMaxWidth()`;
  } else if (width && width.includes('dp')) {
    const widthValue = parseInt(width);
    if (!isNaN(widthValue)) {
      modifierString += `\n${indentStr}.width(${widthValue}.dp)`;
    }
  }

  if (height === 'match_parent') {
    modifierString += `\n${indentStr}.fillMaxHeight()`;
  } else if (height && height.includes('dp')) {
    const heightValue = parseInt(height);
    if (!isNaN(heightValue)) {
      modifierString += `\n${indentStr}.height(${heightValue}.dp)`;
    }
  }

  // 如果两个都是match_parent，使用fillMaxSize
  if (width === 'match_parent' && height === 'match_parent') {
    modifierString = `\n${indentStr}.fillMaxSize()`;
  }

  // 处理内边距
  const padding = attrs['android:padding'];
  if (padding && padding.includes('dp')) {
    const paddingValue = parseInt(padding);
    if (!isNaN(paddingValue)) {
      modifierString += `\n${indentStr}.padding(${paddingValue}.dp)`;
    }
  }

  // 处理外边距（在Compose中也用padding实现）
  const margin = attrs['android:layout_margin'];
  if (margin && margin.includes('dp')) {
    const marginValue = parseInt(margin);
    if (!isNaN(marginValue)) {
      modifierString += `\n${indentStr}.padding(${marginValue}.dp)`;
    }
  }

  // 处理背景颜色
  const background = attrs['android:background'];
  if (background) {
    if (background.startsWith('#')) {
      modifierString += `\n${indentStr}.background(${parseColor(background)})`;
    } else if (background.startsWith('@color/')) {
      modifierString += `\n${indentStr}.background(${parseResourceReference(background)})`;
    }
  }

  // 处理可见性
  const visibility = attrs['android:visibility'];
  if (visibility === 'gone') {
    return ''; // gone在Compose中通过条件渲染实现
  } else if (visibility === 'invisible') {
    modifierString += `\n${indentStr}.alpha(0f)`;
  }

  // 处理点击事件
  const onClick = attrs['android:onClick'];
  if (onClick) {
    modifierString += `\n${indentStr}.clickable { /* TODO: ${onClick}() */ }`;
  }

  // 处理滚动
  if (composable.scrollable === 'vertical') {
    modifierString += `\n${indentStr}.verticalScroll(rememberScrollState())`;
  } else if (composable.scrollable === 'horizontal') {
    modifierString += `\n${indentStr}.horizontalScroll(rememberScrollState())`;
  }

  return modifierString;
}

/**
 * 解析XML节点
 */
export function parseNode(node: Element, indentLevel: number): string {
  const tagName = node.tagName;
  const indentStr = indent(indentLevel);

  // 处理特殊标签
  const specialResult = handleSpecialTags(node, indentLevel);
  if (specialResult !== null) {
    return specialResult;
  }

  // 获取属性
  const rawAttrs = getAttributes(node);
  const attrs: Record<string, string> = {};

  // 处理命名空间
  Object.keys(rawAttrs).forEach(key => {
    const cleanKey = key.replace('android:', '');
    attrs[cleanKey] = rawAttrs[key];
    // 保留android:前缀的副本供特定检查使用
    attrs['android:' + cleanKey] = rawAttrs[key];
  });

  // 映射到Composable
  const composable = mapTagToComposable(tagName, attrs);
  let code = `\n${indentStr}${composable.name}(`;

  // 处理组件特定的属性
  const componentAttrs: string[] = [];
  Object.keys(composable.attributes).forEach(key => {
    componentAttrs.push(`${key} = ${composable.attributes[key]}`);
  });

  // 处理Button的文本
  if (tagName === 'Button' && attrs['text']) {
    code += '\n' + indent(indentLevel + 1) + 'onClick = { /* TODO */ }';
  }

  // 构建Modifier
  const modifierCode = buildModifiers(attrs, indentLevel + 1, composable);
  if (modifierCode) {
    if (componentAttrs.length > 0 || tagName === 'Button') {
      code += ',';
    }
    code += `\n${indent(indentLevel + 1)}modifier = Modifier${modifierCode}`;
  }

  // 处理子元素
  const children = Array.from(node.children);
  if (children.length > 0) {
    code += `\n${indentStr}) {`;

    // Button的特殊处理：文本作为子元素
    if (tagName === 'Button' && attrs['text']) {
      code += `\n${indent(indentLevel + 1)}Text("${attrs['text']}")`;
    }

    // 递归处理子元素
    children.forEach(child => {
      if (child instanceof Element) {
        code += parseNode(child, indentLevel + 1);
      }
    });

    code += `\n${indentStr}}`;
  } else {
    // 没有子元素
    if (tagName === 'Button' && attrs['text']) {
      code += `\n${indentStr}) {\n${indent(indentLevel + 1)}Text("${attrs['text']}")\n${indentStr}}`;
    } else {
      code += `\n${indentStr})`;
    }
  }

  return code;
}

