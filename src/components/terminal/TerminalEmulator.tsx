'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface TerminalEntry {
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
}

interface TerminalEmulatorProps {
  lessonId: number;
  lessonTitle: string;
  fullWidth?: boolean;
}

type Mode = 'normal' | 'plan' | 'accept-edits';

const MODE_LABELS: Record<Mode, string> = {
  normal: 'normal',
  plan: '▮▮ plan mode',
  'accept-edits': '⏵⏵ accept-edits',
};

const MODE_COLORS: Record<Mode, string> = {
  normal: '#7ee787',
  plan: '#ffd700',
  'accept-edits': '#58a6ff',
};

export default function TerminalEmulator({ lessonId, lessonTitle, fullWidth = false }: TerminalEmulatorProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>(() => [
    { type: 'system', content: '  Claude Code — Practice Terminal' },
    { type: 'system', content: `  Lesson ${lessonId}: ${lessonTitle}` },
    { type: 'system', content: '  ─────────────────────────────────────────' },
    { type: 'system', content: "  Try: claude, /plan <task>, or describe what you want to build." },
    { type: 'system', content: '  Shift+Tab: toggle mode  •  /clear: reset  •  ↑↓: history' },
    { type: 'system', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const submit = useCallback(async () => {
    const cmd = input.trim();
    if (!cmd || isLoading) return;

    setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);
    setInput('');

    setEntries((prev) => [...prev, { type: 'input', content: cmd }]);

    // Client-side /clear
    if (cmd === '/clear') {
      setEntries([{ type: 'system', content: '[terminal cleared]' }]);
      return;
    }

    setIsLoading(true);
    setEntries((prev) => [...prev, { type: 'output', content: '' }]);

    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, lessonId, mode }),
      });

      const contentType = res.headers.get('content-type') ?? '';

      if (contentType.includes('application/json')) {
        const data = (await res.json()) as { result: string };
        setEntries((prev) => {
          const next = [...prev];
          next[next.length - 1] = { type: 'output', content: data.result };
          return next;
        });
      } else {
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No stream');
        const decoder = new TextDecoder();
        let acc = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setEntries((prev) => {
            const next = [...prev];
            next[next.length - 1] = { type: 'output', content: acc };
            return next;
          });
        }
      }
    } catch {
      setEntries((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          type: 'error',
          content: '✗ Connection error. Is ANTHROPIC_API_KEY set in .env.local?',
        };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, lessonId, mode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      const next: Mode =
        mode === 'normal' ? 'plan' : mode === 'plan' ? 'accept-edits' : 'normal';
      setMode(next);
      setEntries((prev) => [
        ...prev,
        { type: 'system', content: `[${MODE_LABELS[next]} on]` },
      ]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setEntries((prev) => [
        ...prev,
        { type: 'input', content: input + '^C' },
      ]);
      setInput('');
      setHistoryIdx(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      if (nextIdx >= 0 && cmdHistory[nextIdx]) {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      setHistoryIdx(nextIdx);
      setInput(nextIdx < 0 ? '' : (cmdHistory[nextIdx] ?? ''));
    }
  };

  const modeColor = MODE_COLORS[mode];
  const showModeLabel = mode !== 'normal';

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        backgroundColor: '#0d1117',
        color: '#e6edf3',
        fontFamily: "'Fira Code', 'Cascadia Code', 'Menlo', 'Monaco', 'Courier New', monospace",
        fontSize: fullWidth ? 14 : 13,
        lineHeight: 1.65,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid #30363d',
        cursor: 'text',
        display: 'flex',
        flexDirection: 'column' as const,
        height: fullWidth ? 'calc(100vh - 280px)' : 520,
        minHeight: fullWidth ? 400 : 520,
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
          flexShrink: 0,
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
        <span style={{ color: '#8b949e', fontSize: 12, marginLeft: 6 }}>
          claude-code — practice
        </span>
        {showModeLabel && (
          <span
            style={{
              marginLeft: 'auto',
              color: modeColor,
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 10,
              border: `1px solid ${modeColor}`,
            }}
          >
            {MODE_LABELS[mode]}
          </span>
        )}
      </div>

      {/* Scrollback */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 16px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#30363d #0d1117',
        }}
      >
        {entries.map((entry, i) => (
          <div key={i} style={{ marginBottom: entry.type === 'system' ? 0 : 3 }}>
            {entry.type === 'input' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ color: modeColor, userSelect: 'none', fontWeight: 700 }}>
                  ❯
                </span>
                <span style={{ color: '#e6edf3' }}>{entry.content}</span>
              </div>
            )}
            {entry.type === 'output' && (
              <pre
                style={{
                  margin: '2px 0 6px 0',
                  color: '#c9d1d9',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                {entry.content}
              </pre>
            )}
            {entry.type === 'system' && (
              <div
                style={{
                  color: '#484f58',
                  fontStyle: 'italic',
                  fontSize: 12,
                }}
              >
                {entry.content}
              </div>
            )}
            {entry.type === 'error' && (
              <div style={{ color: '#f85149', marginBottom: 4 }}>{entry.content}</div>
            )}
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              color: '#8b949e',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          >
            ● ● ●
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div
        style={{
          borderTop: '1px solid #21262d',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
          backgroundColor: '#0d1117',
        }}
      >
        <span
          style={{ color: modeColor, userSelect: 'none', fontWeight: 700, fontSize: 14 }}
        >
          ❯
        </span>
        {showModeLabel && (
          <span style={{ color: modeColor, fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap' }}>
            {MODE_LABELS[mode]}
          </span>
        )}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={isLoading ? '' : 'claude, /plan <task>, or describe what to build...'}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e6edf3',
            fontFamily: 'inherit',
            fontSize: 13,
            caretColor: modeColor,
          }}
        />
      </div>
    </div>
  );
}
