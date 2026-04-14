import fs from 'fs';
import path from 'path';
import type { ChangelogVersion, ChangelogItem } from './types';

function categorize(text: string): ChangelogItem['category'] {
  const lower = text.toLowerCase();
  if (lower.startsWith('added') || lower.startsWith('`/') || lower.startsWith('deep link')) return 'added';
  if (lower.startsWith('fixed')) return 'fixed';
  if (lower.startsWith('improved') || lower.startsWith('faster') || lower.startsWith('reduced')) return 'improved';
  if (lower.startsWith('changed') || lower.startsWith('deprecated')) return 'changed';
  if (lower.startsWith('removed')) return 'removed';
  // Default: items starting with feature names or descriptions are usually additions
  return 'added';
}

export function parseChangelog(): ChangelogVersion[] {
  const filePath = path.join(process.cwd(), '.claude/docs/official/changelog.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const versions: ChangelogVersion[] = [];
  let current: ChangelogVersion | null = null;

  for (const line of lines) {
    // Match version headers: ## 2.1.92 (April 4, 2026)
    const versionMatch = line.match(/^## (\d+\.\d+\.\d+)\s+\((.+?)\)/);
    if (versionMatch) {
      if (current) versions.push(current);
      current = {
        version: versionMatch[1],
        date: versionMatch[2],
        items: [],
      };
      continue;
    }

    // Match bullet items: * text
    if (current && line.startsWith('* ')) {
      const text = line.slice(2).trim();
      current.items.push({ text, category: categorize(text) });
    }
  }

  if (current) versions.push(current);
  return versions;
}
