'use client';

import { useState, useCallback } from 'react';

interface BashBlockProps {
  code: string;
  label?: string;
  language?: string;
  variant?: 'default' | 'inline';
}

function highlightCode(code: string) {
  return code.split('\n').map((line, i) => {
    const trimmed = line.trimStart();

    // Comments: # lines → muted olive green
    if (trimmed.startsWith('#')) {
      return <span key={i} style={{ color: '#6a9955' }}>{line}{'\n'}</span>;
    }

    // Prompt lines: $ command → $ dim, command bright
    if (trimmed.startsWith('$ ')) {
      const indent = line.slice(0, line.indexOf('$'));
      const cmd = trimmed.slice(2);
      return (
        <span key={i}>
          {indent}<span style={{ color: '#6a9955' }}>$ </span><span style={{ color: '#e8e4de' }}>{cmd}</span>{'\n'}
        </span>
      );
    }

    // Output lines: → or ✓ → muted
    if (trimmed.startsWith('→') || trimmed.startsWith('✓') || trimmed.startsWith('✱')) {
      return <span key={i} style={{ color: '#7a9a6a' }}>{line}{'\n'}</span>;
    }

    // Default
    return <span key={i} style={{ color: '#d4c9b8' }}>{line}{'\n'}</span>;
  });
}

export default function BashBlock({ code, label = 'Terminal', language, variant = 'default' }: BashBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  if (variant === 'inline') {
    return (
      <pre
        style={{
          backgroundColor: '#1a1a1a',
          color: '#d4c9b8',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          margin: 0,
          overflowX: 'auto',
          lineHeight: 1.6,
        }}
      >
        <code>{highlightCode(code)}</code>
      </pre>
    );
  }

  const displayLabel = language || label;

  return (
    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
      {/* Header: traffic lights | centered label | copy button */}
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Traffic light dots — left */}
        <div style={{ display: 'flex', gap: '7px', flexShrink: 0 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#febc2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#28c840' }} />
        </div>

        {/* Centered label */}
        <span
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            color: '#888',
            letterSpacing: '0.02em',
          }}
        >
          {displayLabel}
        </span>

        {/* Copy button — pill style, right */}
        <button
          onClick={handleCopy}
          style={{
            marginLeft: 'auto',
            background: copied ? 'rgba(40, 200, 64, 0.12)' : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            padding: '5px 14px',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: copied ? '#28c840' : '#ccc',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28c840" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Divider line */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

      {/* Code content */}
      <pre
        style={{
          backgroundColor: '#1a1a1a',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          padding: '20px 24px',
          margin: 0,
          overflowX: 'auto',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
}
