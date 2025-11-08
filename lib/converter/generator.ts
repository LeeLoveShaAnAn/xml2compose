/**
 * 代码生成器模块
 * 负责生成最终的Compose代码和导入语句
 */

import { getAttributes } from './parser';

/**
 * 生成缩进字符串
 */
export function indent(level: number): string {
  return '    '.repeat(level);
}

/**
 * 格式化Compose代码
 */
export function formatCompose(code: string): string {
  return code
    .replace(/,(\n\s*\})/g, '$1')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

/**
 * 生成导入语句
 */
export function generateImports(rootElement: Element): string {
  const usedComponents = new Set<string>();
  const usedModifiers = new Set<string>();
  const usedResources = new Set<string>();

  // 递归收集使用的组件和功能
  const collectUsage = (node: Element) => {
    const tagName = node.tagName;
    const attributes = getAttributes(node);

    // 收集组件类型
    switch (tagName) {
      case 'LinearLayout':
        usedComponents.add(attributes['android:orientation'] === 'horizontal' ? 'Row' : 'Column');
        break;
      case 'ConstraintLayout':
      case 'RelativeLayout':
      case 'FrameLayout':
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
      case 'ScrollView':
        usedComponents.add('Column');
        usedModifiers.add('verticalScroll');
        break;
      case 'HorizontalScrollView':
        usedComponents.add('Row');
        usedModifiers.add('horizontalScroll');
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
    Array.from(node.children).forEach(child => {
      if (child instanceof Element) {
        collectUsage(child);
      }
    });
  };

  collectUsage(rootElement);

  // 生成导入语句
  let imports = '// Auto-generated imports\n';

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
  const material3Components = [
    'Text',
    'Button',
    'TextField',
    'Checkbox',
    'RadioButton',
    'Switch',
    'LinearProgressIndicator',
    'CircularProgressIndicator',
    'Slider'
  ];
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

  // 滚动相关
  if (usedModifiers.has('verticalScroll')) {
    imports += 'import androidx.compose.foundation.verticalScroll\n';
    imports += 'import androidx.compose.foundation.rememberScrollState\n';
  }
  if (usedModifiers.has('horizontalScroll')) {
    imports += 'import androidx.compose.foundation.horizontalScroll\n';
    imports += 'import androidx.compose.foundation.rememberScrollState\n';
  }

  // LazyColumn/LazyGrid
  if (usedComponents.has('LazyColumn') || usedComponents.has('LazyVerticalGrid')) {
    imports += 'import androidx.compose.foundation.lazy.*\n';
  }

  // AndroidView
  if (usedComponents.has('AndroidView')) {
    imports += 'import androidx.compose.ui.viewinterop.AndroidView\n';
  }

  // 颜色和图形
  if (usedModifiers.has('background')) {
    imports += 'import androidx.compose.ui.graphics.Color\n';
  }

  return imports + '\n';
}

/**
 * 生成主转换函数
 */
export function convertXmlToCompose(xmlString: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML parsing error');
    }

    const rootElement = doc.documentElement;

    // 生成导入
    const imports = generateImports(rootElement);

    // 生成代码（这里简化处理，完整实现在converter.ts中）
    const code = '// Code generation will be handled by converter module\n';

    return imports + code;
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

