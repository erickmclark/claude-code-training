'use client';

import { useState } from 'react';

interface TerminalSimulatorProps {
  commands: string[];
  title?: string;
}

export default function TerminalSimulator({ commands, title = 'Terminal' }: TerminalSimulatorProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (cmd: string, idx: number) => {
    const clean = cmd.replace(/^#\s*/, '').replace(/^[$>]\s*/, '');
    await navigator.clipboard.writeText(clean);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-600 bg-black my-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-1">
        {commands.map((cmd, idx) => {
          const isComment = cmd.startsWith('#');
          return (
            <div
              key={idx}
              className="flex items-center justify-between group hover:bg-slate-900/50 px-2 py-1 rounded"
            >
              <div className="flex items-center gap-2">
                {!isComment && <span className="text-green-400 select-none">$</span>}
                <span className={isComment ? 'text-slate-500' : 'text-slate-200'}>
                  {cmd}
                </span>
              </div>
              {!isComment && (
                <button
                  onClick={() => handleCopy(cmd, idx)}
                  className="opacity-0 group-hover:opacity-100 text-xs px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
                >
                  {copiedIdx === idx ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
