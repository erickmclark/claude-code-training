'use client';

import { useState } from 'react';

interface CodeEditorProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeEditor({ code, language = 'bash', title }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-600 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-slate-900 overflow-x-auto">
        <code className="text-sm font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
}
