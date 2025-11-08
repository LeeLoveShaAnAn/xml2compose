/**
 * 转换器类型定义
 */

export interface Warning {
  type: 'unsupported' | 'deprecated' | 'performance';
  message: string;
  suggestion: string;
}

export interface Suggestion {
  type: 'best_practice' | 'optimization' | 'migration' | 'performance';
  message: string;
}

export interface ValidationResult {
  warnings: Warning[];
  suggestions: Suggestion[];
}

export interface ComposableConfig {
  name: string;
  attributes: Record<string, string>;
  scrollable?: 'vertical' | 'horizontal';
  modifiers?: string[];
}

export interface ParsedAttribute {
  name: string;
  value: string;
  comment?: string;
}

export interface ConversionResult {
  imports: string;
  code: string;
  warnings: Warning[];
  suggestions: Suggestion[];
}

