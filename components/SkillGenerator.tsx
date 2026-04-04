'use client';

import { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function SkillGenerator() {
  const [description, setDescription] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setGenerated('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate-skill',
          context: description,
        }),
      });
      const data = await res.json();
      setGenerated(data.result);
    } catch {
      setGenerated('Unable to generate. Check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        Describe what you want your skill to do
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Write in plain English. The AI will generate a complete SKILL.md file you can copy into your project.
      </p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Example: I want a command that runs my test suite, generates a coverage report, and opens it in the browser"
        className="w-full h-24 px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !description.trim()}
        className="mt-3 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading ? 'Generating...' : 'Generate SKILL.md'}
      </button>

      {generated && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            Generated SKILL.md — copy to your project
          </p>
          <CodeBlock code={generated} language="markdown" />
        </div>
      )}
    </div>
  );
}
