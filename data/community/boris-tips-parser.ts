import fs from 'fs';
import path from 'path';
import type { BorisTip } from './types';

export function parseBorisTips(): BorisTip[] {
  const filePath = path.join(process.cwd(), '.claude/docs/boris-claude-code-guide.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const tips: BorisTip[] = [];
  let currentCategory = '';
  let currentTitle = '';
  let currentLines: string[] = [];
  let tipId = 0;

  // Skip sections that aren't tips (Table of Contents, Key Quotes, Actionable Next Steps)
  const skipCategories = new Set([
    'Table of Contents',
    'Key Quotes from Boris',
    'Actionable Next Steps to Improve Your Claude Code Usage',
    'All Historical Tweets & Tips for Using Claude Code Better',
  ]);

  function flushTip() {
    if (!currentTitle || currentLines.length === 0) return;
    if (skipCategories.has(currentCategory)) return;

    const body = currentLines.join('\n').trim();
    if (!body) return;

    // Extract first blockquote
    let quote: string | undefined;
    const quoteMatch = body.match(/^>\s*"(.+?)"/m);
    if (quoteMatch) quote = quoteMatch[1];

    const hasCode = body.includes('```');

    tips.push({
      id: tipId++,
      title: currentTitle,
      category: currentCategory,
      content: body,
      quote,
      hasCode,
    });
  }

  for (const line of lines) {
    // H2 = category
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flushTip();
      currentCategory = line.slice(3).trim();
      currentTitle = '';
      currentLines = [];
      continue;
    }

    // H3 = individual tip
    if (line.startsWith('### ')) {
      flushTip();
      currentTitle = line.slice(4).trim();
      currentLines = [];
      continue;
    }

    // Accumulate content lines for current tip
    if (currentTitle) {
      currentLines.push(line);
    }
  }

  flushTip();
  return tips;
}
