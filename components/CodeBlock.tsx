'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-950 my-4">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      {!language && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 text-xs text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 px-2 py-1 rounded bg-gray-800"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}
