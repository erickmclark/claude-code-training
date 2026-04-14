'use client';

import { useState } from 'react';

interface TerminalLauncherProps {
  lessonId: number;
  lessonTitle: string;
  terminalCommands?: string[];
}

export default function TerminalLauncher({ lessonTitle, terminalCommands = [] }: TerminalLauncherProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText('claude').then(() => {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    });
  };

  // Filter to meaningful commands (skip pure comments, keep actionable ones)
  const prompts = terminalCommands
    .filter((cmd) => cmd.trim().length > 0)
    .slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: '#0d1117',
        color: '#e6edf3',
        fontFamily: "'Fira Code', 'Cascadia Code', 'Menlo', 'Monaco', 'Courier New', monospace",
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid #30363d',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          backgroundColor: '#161b22',
          borderBottom: '1px solid #21262d',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div
              key={c}
              style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#8b949e', marginLeft: 8 }}>
          claude-code — practice
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: '40px 32px', textAlign: 'center' }}>
        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⌨</div>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#e6edf3',
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              margin: '0 0 8px 0',
            }}
          >
            Practice with Real Claude Code
          </h3>
          <p
            style={{
              fontSize: 14,
              color: '#8b949e',
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              maxWidth: 420,
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            Open a real Claude Code session to practice the techniques from{' '}
            <span style={{ color: '#e6edf3' }}>{lessonTitle}</span>.
          </p>
        </div>

        {/* Launch button */}
        <a
          href="https://claude.ai/code"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#cc5c38',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            padding: '12px 32px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b84e2c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#cc5c38')}
        >
          Open Claude Code
          <span style={{ fontSize: 18 }}>→</span>
        </a>

        {/* CLI alternative */}
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 13,
            color: '#8b949e',
            fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          <span>Or run in your terminal:</span>
          <code
            style={{
              backgroundColor: '#161b22',
              color: '#7ee787',
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 13,
              border: '1px solid #30363d',
            }}
          >
            claude
          </code>
          <button
            onClick={copyCliCommand}
            style={{
              background: 'none',
              border: '1px solid #30363d',
              borderRadius: 4,
              padding: '3px 8px',
              color: copiedCli ? '#7ee787' : '#8b949e',
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {copiedCli ? '✓' : 'copy'}
          </button>
        </div>
      </div>

      {/* Prompts section */}
      {prompts.length > 0 && (
        <div
          style={{
            borderTop: '1px solid #21262d',
            padding: '24px 32px 32px',
          }}
        >
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#8b949e',
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: '0 0 16px 0',
            }}
          >
            Try These Prompts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {prompts.map((cmd, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 8,
                  padding: '10px 14px',
                  gap: 12,
                }}
              >
                <span style={{ color: '#7ee787', flexShrink: 0, fontSize: 13 }}>❯</span>
                <code
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: '#e6edf3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cmd}
                </code>
                <button
                  onClick={() => copyToClipboard(cmd, i)}
                  style={{
                    background: 'none',
                    border: '1px solid #30363d',
                    borderRadius: 4,
                    padding: '4px 10px',
                    color: copiedIndex === i ? '#7ee787' : '#8b949e',
                    cursor: 'pointer',
                    fontSize: 11,
                    flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'color 0.15s',
                  }}
                >
                  {copiedIndex === i ? '✓ copied' : 'copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
