/**
 * XML到Jetpack Compose转换器主入口
 */

import { validateXmlSyntax } from './parser';
import { generateImports, formatCompose } from './generator';
import { validateAttributes, generatePerformanceTips } from './validator';
import { parseNode } from './converter';
import type { ConversionResult, Warning, Suggestion } from './types';

/**
 * 将XML字符串转换为Jetpack Compose代码
 */
export function convertXmlToCompose(xmlString: string): ConversionResult {
  const warnings: Warning[] = [];
  const suggestions: Suggestion[] = [];

  try {
    // 1. 验证XML语法
    const validation = validateXmlSyntax(xmlString);
    if (!validation.valid) {
      throw new Error(`XML syntax error: ${validation.error}`);
    }

    // 2. 解析XML
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    const rootElement = doc.documentElement;

    if (!rootElement) {
      throw new Error('No root element found');
    }

    // 3. 生成导入语句
    const imports = generateImports(rootElement);

    // 4. 验证根元素属性
    const rootTagName = rootElement.tagName;
    const rootAttrs: Record<string, string> = {};
    for (const attr of Array.from(rootElement.attributes)) {
      rootAttrs[attr.name] = attr.value;
    }
    const validationResult = validateAttributes(rootTagName, rootAttrs);
    warnings.push(...validationResult.warnings);
    suggestions.push(...validationResult.suggestions);

    // 5. 生成性能提示
    const perfTips = generatePerformanceTips(rootElement);
    suggestions.push(...perfTips);

    // 6. 转换XML节点为Compose代码
    let code = '@Composable\n';
    code += 'fun GeneratedUI() {';
    code += parseNode(rootElement, 1);
    code += '\n}';

    // 7. 格式化代码
    code = formatCompose(code);

    // 8. 添加注释
    let finalCode = imports;
    if (warnings.length > 0) {
      finalCode += '\n// ⚠️ Warnings:\n';
      warnings.forEach(w => {
        finalCode += `// - ${w.message}\n`;
        finalCode += `//   Suggestion: ${w.suggestion}\n`;
      });
      finalCode += '\n';
    }
    if (suggestions.length > 0) {
      finalCode += '\n// 💡 Suggestions:\n';
      suggestions.slice(0, 3).forEach(s => {
        // 只显示前3条建议，避免过长
        finalCode += `// - ${s.message}\n`;
      });
      finalCode += '\n';
    }
    finalCode += code;

    return {
      imports,
      code: finalCode,
      warnings,
      suggestions
    };
  } catch (error) {
    // 返回错误信息
    const errorMessage = error instanceof Error ? error.message : 'Unknown conversion error';
    return {
      imports: '',
      code: `// ❌ Conversion Error\n// ${errorMessage}\n\n@Composable\nfun GeneratedUI() {\n    Text("Conversion failed. Please check your XML.")\n}`,
      warnings: [{
        type: 'unsupported',
        message: errorMessage,
        suggestion: 'Please check your XML syntax and try again'
      }],
      suggestions: []
    };
  }
}

// 导出类型
export type { ConversionResult, Warning, Suggestion } from './types';

