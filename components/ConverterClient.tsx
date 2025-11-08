'use client';

import { useState, useRef } from 'react';
import { convertXmlToCompose } from '../lib/converter';

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
        android:text="Hello World!"
        android:textSize="24sp"
        android:textColor="#007AFF" />
        
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Me!"
        android:layout_marginTop="16dp" />
</LinearLayout>`;

export function ConverterClient() {
  const [xmlInput, setXmlInput] = useState('');
  const [composeOutput, setComposeOutput] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const handleConvert = () => {
    if (!xmlInput.trim()) {
      alert('Please enter XML code to convert');
      return;
    }

    try {
      const result = convertXmlToCompose(xmlInput);
      setComposeOutput(result.code);
    } catch (error) {
      console.error('Conversion error:', error);
      setComposeOutput('// Error during conversion\n// Please check your XML syntax');
    }
  };

  const handleLoadSample = () => {
    setXmlInput(sampleXml);
  };

  const handleClear = () => {
    setXmlInput('');
    setComposeOutput('');
  };

  const handleCopy = async () => {
    if (composeOutput) {
      try {
        await navigator.clipboard.writeText(composeOutput);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <>
      <section className="converter-hero">
        <div className="container">
          <h1>XML to Jetpack Compose Converter</h1>
          <p>
            Transform your Android XML layouts into modern Jetpack Compose code instantly. 
            Simply paste your XML and get clean, readable Compose code.
          </p>
          <button className="convert-button" onClick={handleConvert}>
            <svg className="panel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            <span>Convert Now</span>
          </button>
        </div>
      </section>

      <main className="converter-main">
        <div className="converter-grid">
          {/* XML Input Panel */}
          <div className="editor-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <svg className="panel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
                <span>Android XML</span>
              </h2>
              <div className="panel-actions">
                <button className="action-button" onClick={handleLoadSample}>
                  Load Sample
                </button>
                <button className="action-button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>
            <div className="code-editor">
              <textarea 
                className="code-input" 
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                placeholder={`Paste your Android XML layout here...

For example:
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        android:textSize="24sp" />
        
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Me!" />
</LinearLayout>`}
              />
            </div>
          </div>

          {/* Compose Output Panel */}
          <div className="editor-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <svg className="panel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Jetpack Compose</span>
              </h2>
              <div className="panel-actions">
                <button className="action-button" onClick={handleCopy} disabled={!composeOutput}>
                  Copy
                </button>
              </div>
            </div>
            <div className="code-editor">
              <textarea 
                ref={outputRef}
                className="code-output" 
                value={composeOutput}
                readOnly
                placeholder="Your Compose code will appear here after conversion..."
              />
            </div>
          </div>
        </div>
      </main>

      <div className={`copy-notification ${showNotification ? 'show' : ''}`}>
        ✓ Copied to clipboard!
      </div>
    </>
  );
}
