/**
 * XML解析和验证模块
 * 负责XML语法验证、资源引用解析和命名空间属性处理
 */

import type { ParsedAttribute } from './types';

/**
 * 获取节点的所有属性
 */
export function getAttributes(node: Element): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(node.attributes)) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

/**
 * 解析资源引用
 */
export function parseResourceReference(value: string): string {
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
    const systemColors: Record<string, string> = {
      'white': 'Color.White',
      'black': 'Color.Black',
      'transparent': 'Color.Transparent',
      'darker_gray': 'Color.DarkGray',
      'background_light': 'MaterialTheme.colorScheme.background'
    };
    return systemColors[colorName] || `Color(/* TODO: Map @android:color/${colorName} */)`;
  }

  return value;
}

/**
 * 解析命名空间属性
 */
export function parseNamespacedAttribute(name: string, value: string): ParsedAttribute {
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
      value: parseResourceReference(value)
    };
  }

  // 处理 android: 命名空间
  if (name.startsWith('android:')) {
    return {
      name: name.replace('android:', ''),
      value: parseResourceReference(value)
    };
  }

  return { name, value };
}

/**
 * 验证XML语法
 */
export function validateXmlSyntax(xmlString: string): { valid: boolean; error?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');

    // 检查解析错误
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return {
        valid: false,
        error: parseError.textContent || 'XML parsing error'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 解析尺寸值
 */
export function parseDimension(value: string): string {
  if (!value) return '0.dp';

  // 处理dp单位
  if (value.endsWith('dp')) {
    return value.replace('dp', '.dp');
  }

  // 处理sp单位
  if (value.endsWith('sp')) {
    return value.replace('sp', '.sp');
  }

  // 处理px单位（需要转换）
  if (value.endsWith('px')) {
    const num = parseInt(value);
    return `${num}.dp // TODO: Convert px to dp`;
  }

  // 处理match_parent和wrap_content
  if (value === 'match_parent') {
    return 'Modifier.fillMaxSize()';
  }

  if (value === 'wrap_content') {
    return 'Modifier.wrapContentSize()';
  }

  return value;
}

/**
 * 解析颜色值
 */
export function parseColor(value: string): string {
  if (!value) return 'Color.Unspecified';

  // 处理资源引用
  if (value.startsWith('@')) {
    return parseResourceReference(value);
  }

  // 处理十六进制颜色
  if (value.startsWith('#')) {
    const hex = value.replace('#', '');
    if (hex.length === 6) {
      return `Color(0xFF${hex})`;
    } else if (hex.length === 8) {
      return `Color(0x${hex})`;
    }
  }

  return `Color(/* TODO: Parse color: ${value} */)`;
}

