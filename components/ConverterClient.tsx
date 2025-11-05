'use client';

import { useState, useCallback } from 'react';
import { convertXmlToCompose } from '../js/core/generator.js';

const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Compose Migration"
        android:textSize="20sp"
        android:textStyle="bold" />

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Start" />
</LinearLayout>`;

export function ConverterClient() {
  const [xmlInput, setXmlInput] = useState(sampleXml);
  const [composeResult, setComposeResult] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    try {
      const result = convertXmlToCompose(xmlInput);
      setComposeResult(result);
      setStatusMessage('转换完成。请根据提示逐条验证。');
    } catch (error) {
      console.error(error);
      setStatusMessage('转换时出现异常，请检查XML格式或联系我们。');
    }
  }, [xmlInput]);

  const handleClear = useCallback(() => {
    setXmlInput('');
    setComposeResult('');
    setStatusMessage(null);
  }, []);

  return (
    <div className="content" style={{ gap: 'var(--space-8)' }}>
      <section className="card" aria-labelledby="converter-guideline">
        <h1 id="converter-guideline" className="section-title" style={{ marginBottom: 'var(--space-3)' }}>
          XML → Jetpack Compose 自动转换器
        </h1>
        <p>
          此工具在浏览器本地运行，不会上传你的XML数据。转换结果包含自动生成的导入语句、Compose 代码以及警告提示。根据 Google AdSense
          内容政策，我们仅提供原创算法与说明，不托管任何受限或侵权素材。
        </p>
        <ol style={{ margin: 'var(--space-6) 0 0', paddingLeft: '1.25rem', display: 'grid', gap: '0.75rem' }}>
          <li>粘贴或输入完整的 Android XML 布局。</li>
          <li>点击“执行转换”，在右侧查看 Compose 草稿与改进建议。</li>
          <li>根据团队规范进一步校验，例如资源引用、交互逻辑与无障碍提示。</li>
        </ol>
        <div className="note" style={{ marginTop: 'var(--space-4)' }}>
          提醒：转换结果仅供教育与评估目的，最终上线代码需经过人工审查与版权确认。
        </div>
      </section>

      <section className="split-section" aria-labelledby="converter-workbench">
        <div>
          <h2 id="converter-workbench">输入区域</h2>
          <label htmlFor="xml-input">Android XML 布局</label>
          <textarea
            id="xml-input"
            rows={18}
            value={xmlInput}
            onChange={(event) => setXmlInput(event.target.value)}
            placeholder="在此粘贴XML布局"
            aria-describedby="xml-help"
            style={{ fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace', minHeight: '320px' }}
          />
          <p id="xml-help" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            支持 `LinearLayout`、`ConstraintLayout`、`RecyclerView` 等常见组件，遇到未知标签时会保留 TODO 提示。
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button type="button" className="cta-button" onClick={handleConvert}>
              执行转换
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '999px',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                background: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
              }}
            >
              清空输入
            </button>
          </div>
        </div>
        <aside className="card" aria-labelledby="converter-output" style={{ minHeight: '100%' }}>
          <h2 id="converter-output">输出结果</h2>
          {statusMessage ? <p>{statusMessage}</p> : <p>点击“执行转换”后将在此显示Compose代码。</p>}
          <textarea
            id="compose-output"
            rows={18}
            value={composeResult}
            readOnly
            aria-live="polite"
            placeholder="Compose代码将显示在这里"
            style={{
              fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              minHeight: '320px',
              background: '#0b1220',
              color: '#dce3f5',
              border: '1px solid rgba(15,23,42,0.3)',
            }}
          />
        </aside>
      </section>
    </div>
  );
}

