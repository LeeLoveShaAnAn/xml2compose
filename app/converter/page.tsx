import type { Metadata } from 'next';
import { ConverterClient } from '../../components/ConverterClient';

export const metadata: Metadata = {
  title: 'Converter - Android XML to Jetpack Compose',
  description: 'Convert your Android XML layouts to Jetpack Compose code instantly. Fast, accurate, and free.',
};

export default function ConverterPage() {
  return <ConverterClient />;
}
