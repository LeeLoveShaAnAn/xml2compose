/**
 * 属性验证和建议模块
 * 负责验证XML属性的兼容性并提供最佳实践建议
 */

import type { Warning, Suggestion, ValidationResult } from './types';

/**
 * 验证组件属性
 */
export function validateAttributes(tagName: string, attributes: Record<string, string>): ValidationResult {
  const warnings: Warning[] = [];
  const suggestions: Suggestion[] = [];

  // 检查不支持的属性
  const unsupportedAttrs: Record<string, string> = {
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
        message: `Attribute ${attr} is not directly supported`,
        suggestion: unsupportedAttrs[attr]
      });
    }
  });

  // 最佳实践检查
  if (tagName === 'ScrollView' && attributes['android:orientation'] === 'vertical') {
    suggestions.push({
      type: 'best_practice',
      message: 'Consider using LazyColumn instead of ScrollView + LinearLayout for better performance'
    });
  }

  if (tagName === 'LinearLayout' && attributes['android:layout_weight']) {
    suggestions.push({
      type: 'best_practice',
      message: 'layout_weight is implemented in Compose using Modifier.weight()'
    });
  }

  if (tagName === 'ListView' || tagName === 'RecyclerView') {
    suggestions.push({
      type: 'migration',
      message: 'Use LazyColumn or LazyRow in Compose for list views'
    });
  }

  return { warnings, suggestions };
}

/**
 * 生成性能提示
 */
export function generatePerformanceTips(rootElement: Element): Suggestion[] {
  const tips: Suggestion[] = [];
  const tagName = rootElement.tagName;

  // 深度嵌套检查
  const maxDepth = getMaxDepth(rootElement);
  if (maxDepth > 10) {
    tips.push({
      type: 'performance',
      message: `Deep nesting detected (depth: ${maxDepth}). Consider flattening the layout for better performance.`
    });
  }

  // 过多子元素检查
  const childCount = rootElement.children.length;
  if (tagName === 'LinearLayout' && childCount > 20) {
    tips.push({
      type: 'performance',
      message: `LinearLayout with ${childCount} children. Consider using LazyColumn/LazyRow for large lists.`
    });
  }

  return tips;
}

/**
 * 获取最大嵌套深度
 */
function getMaxDepth(element: Element, currentDepth = 0): number {
  if (element.children.length === 0) {
    return currentDepth;
  }

  let maxChildDepth = currentDepth;
  for (const child of Array.from(element.children)) {
    if (child instanceof Element) {
      const childDepth = getMaxDepth(child, currentDepth + 1);
      maxChildDepth = Math.max(maxChildDepth, childDepth);
    }
  }

  return maxChildDepth;
}

