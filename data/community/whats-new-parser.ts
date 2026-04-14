import fs from 'fs';
import path from 'path';
import type { WhatsNewWeek } from './types';

export function parseWhatsNew(): WhatsNewWeek[] {
  const filePath = path.join(process.cwd(), '.claude/docs/official/whats-new.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const weeks: WhatsNewWeek[] = [];
  let i = 0;

  while (i < lines.length) {
    // Match: ## Week 14 (March 30 – April 3, 2026) — v2.1.86–v2.1.91
    const headerMatch = lines[i].match(
      /^## Week (\d+)\s+\((.+?)\)\s+—\s+(.+)/
    );

    if (headerMatch) {
      const weekNumber = parseInt(headerMatch[1], 10);
      const dateRange = headerMatch[2];
      const versionRange = headerMatch[3];
      i++;

      // Skip blank lines
      while (i < lines.length && lines[i].trim() === '') i++;

      // First non-empty paragraph is the headline
      let headline = '';
      while (i < lines.length && lines[i].trim() !== '') {
        headline += (headline ? ' ' : '') + lines[i].trim();
        i++;
      }

      // Skip blank lines
      while (i < lines.length && lines[i].trim() === '') i++;

      // "Also this week:" line contains highlights
      const highlights: string[] = [];
      if (i < lines.length && lines[i].startsWith('Also this week:')) {
        const alsoLine = lines[i].replace('Also this week:', '').trim();
        // Split on commas, and " and " for the last item
        const parts = alsoLine.replace(/,\s+and\s+/, ', ').split(/,\s+/);
        for (const part of parts) {
          const cleaned = part.replace(/\.$/, '').trim();
          if (cleaned) highlights.push(cleaned);
        }
        i++;
      }

      // Skip blank lines
      while (i < lines.length && lines[i].trim() === '') i++;

      // Extract digest URL from markdown link
      let digestUrl = '';
      if (i < lines.length) {
        const linkMatch = lines[i].match(/\[.+?\]\((.+?)\)/);
        if (linkMatch) {
          digestUrl = linkMatch[1];
          i++;
        }
      }

      weeks.push({ weekNumber, dateRange, versionRange, headline, highlights, digestUrl });
    } else {
      i++;
    }
  }

  return weeks;
}
