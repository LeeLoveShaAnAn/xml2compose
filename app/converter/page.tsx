import type { Metadata } from 'next';
import { ConverterClient } from '../../components/ConverterClient';

export const metadata: Metadata = {
  title: '在线转换器 · XML 转 Compose',
  description:
    '使用浏览器本地运行的 xml2compose 转换器，将 Android XML 布局快速转换为 Jetpack Compose 代码，附带合规提醒与性能建议。',
};

export default function ConverterPage() {
  return <ConverterClient />;
}

