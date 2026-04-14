/**
 * Data-driven VHS tape generator — v2 (shell script approach).
 *
 * Reads every lesson's first step code from data/lessons.ts, then generates:
 *   1. A .sh script per lesson that outputs a Claude Code session with
 *      ANSI colors rendered by the shell (no raw escape codes visible)
 *   2. A minimal .tape file that hides the script execution and captures
 *      only the clean colored output
 *
 * Run:
 *   npx tsx scripts/generate-all-tapes.ts
 *   npm run capture:screenshots
 */

import * as fs from 'fs';
import * as path from 'path';

const TAPES_DIR = path.resolve(__dirname, '..', 'public', 'tapes');
const SCRIPTS_DIR = path.resolve(TAPES_DIR, 'scripts');
const LESSONS_FILE = path.resolve(__dirname, '..', 'data', 'lessons.ts');

// ─── Helpers ───────────────────────────────────────────────────

function escDQ(text: string): string {
  // Escape for double-quoted shell strings: backslashes, double quotes, backticks, dollars
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

function shellEcho(text: string, sleepMs = 500): string {
  return `echo -e "${text}"\nsleep ${(sleepMs / 1000).toFixed(1)}`;
}

function ansi(code: string, text: string): string {
  return `\\033[${code}m${escDQ(text)}\\033[0m`;
}

// ─── Claude Code UI builders ───────────────────────────────────

function claudeHeader(): string {
  return shellEcho(ansi('90', '[Opus] 📁 my-app | 🌿 main'), 800);
}

function claudePrompt(cmd: string): string {
  return shellEcho(`\\n${ansi('1;36', '❯')} ${escDQ(cmd)}`, 1200);
}

function toolRead(file: string): string {
  return shellEcho(`${ansi('90', '● Read')} ${escDQ(file)}`, 800);
}

function toolEdit(file: string): string {
  return shellEcho(`${ansi('33', '● Edit')} ${escDQ(file)}`, 600);
}

function toolBash(cmd: string): string {
  return shellEcho(`${ansi('33', '● Bash')} ${escDQ(cmd)}`, 800);
}

function addLine(text: string): string {
  return shellEcho(`  ${ansi('32', `+ ${escDQ(text)}`)}`, 500);
}

function removeLine(text: string): string {
  return shellEcho(`  ${ansi('31', `- ${escDQ(text)}`)}`, 500);
}

function result(text: string): string {
  return shellEcho(`  ${ansi('32', `✓ ${escDQ(text)}`)}`, 600);
}

function comment(text: string): string {
  return shellEcho(ansi('90', `# ${escDQ(text)}`), 400);
}

function doneLine(summary: string): string {
  return shellEcho(`\\n${ansi('1;32', '✓ Done')} — ${escDQ(summary)}`, 3000);
}

function codeLine(text: string): string {
  return shellEcho(`  ${escDQ(text)}`, 400);
}

// ─── Parse lesson code ─────────────────────────────────────────

interface LessonInfo {
  id: number;
  title: string;
  code: string;
  gifName: string;
}

function extractLessons(): LessonInfo[] {
  const src = fs.readFileSync(LESSONS_FILE, 'utf-8');
  const results: LessonInfo[] = [];

  const lessonRegex = /\{\s*id:\s*(\d+),\s*\n\s*title:\s*'([^']+)'/g;
  let match;

  while ((match = lessonRegex.exec(src)) !== null) {
    const id = parseInt(match[1], 10);
    const title = match[2];

    const afterId = src.slice(match.index);
    const stepsMatch = afterId.match(/steps:\s*\[([\s\S]*?)(?=\n\s{4}\],|\n\s{4}terminalCommands)/);
    if (!stepsMatch) continue;

    const stepsBlock = stepsMatch[1];
    const codeMatch = stepsBlock.match(/code:\s*'([\s\S]*?)(?:',\s*\n|'\s*\n)/);
    if (!codeMatch) continue;

    const code = codeMatch[1]
      .replace(/\\n/g, '\n')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\');

    const gifName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    results.push({ id, title, code, gifName });
  }

  return results;
}

// ─── Generate shell script for a lesson ────────────────────────

function generateScript(lesson: LessonInfo): string {
  const lines = lesson.code.split('\n').filter((l) => l.trim().length > 0);
  const parts: string[] = [
    '#!/bin/bash',
    '# Auto-generated Claude Code session demo',
    `# Lesson ${lesson.id}: ${lesson.title}`,
    '',
    'clear',
    claudeHeader(),
  ];

  // Parse the code block into a Claude Code session
  let hasPrompt = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('#')) {
      // Comment — show as a grey annotation
      parts.push(comment(trimmed.replace(/^#\s*/, '')));
    } else if (trimmed.startsWith('$') || trimmed.startsWith('>')) {
      // Shell command or Claude prompt
      const cmd = trimmed.replace(/^\$\s*/, '').replace(/^>\s*/, '');
      if (!hasPrompt) {
        parts.push(claudePrompt(cmd));
        hasPrompt = true;
      } else {
        parts.push(claudePrompt(cmd));
      }
    } else if (trimmed.startsWith('claude ') || trimmed.startsWith('/')) {
      // Claude command
      parts.push(claudePrompt(trimmed));
      hasPrompt = true;
    } else if (trimmed.match(/^(git |npm |bun |curl |mkdir |cat |cd |ls |grep )/)) {
      // Shell command without $ prefix — show as tool Bash
      parts.push(toolBash(trimmed));
    } else if (trimmed.startsWith('{') || trimmed.startsWith('"') || trimmed.startsWith("'")) {
      // JSON or config — show as code output
      parts.push(codeLine(trimmed));
    } else {
      // Regular output line
      parts.push(codeLine(trimmed));
    }
  }

  parts.push(doneLine(`${lesson.title}`));

  return parts.join('\n');
}

// ─── Generate VHS tape wrapper ─────────────────────────────────

function generateTape(lesson: LessonInfo): string {
  // Calculate approximate script runtime based on content length
  const lineCount = lesson.code.split('\n').filter((l) => l.trim()).length;
  const totalSleep = Math.max(15, lineCount * 1.2 + 5); // ~1.2s per line + buffer

  return `Output public/screenshots/${lesson.gifName}.gif

Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set Padding 16

Hide
Type "bash ./public/tapes/scripts/${lesson.gifName}.sh"
Enter
Show
Sleep ${Math.round(totalSleep)}s
`;
}

// ─── Main ──────────────────────────────────────────────────────

function main() {
  fs.mkdirSync(TAPES_DIR, { recursive: true });
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });

  // Clean old tapes and scripts
  for (const f of fs.readdirSync(TAPES_DIR)) {
    if (f.endsWith('.tape')) fs.unlinkSync(path.join(TAPES_DIR, f));
  }
  for (const f of fs.readdirSync(SCRIPTS_DIR)) {
    if (f.endsWith('.sh')) fs.unlinkSync(path.join(SCRIPTS_DIR, f));
  }

  const lessons = extractLessons();
  console.log(`Found ${lessons.length} lessons with code blocks.\n`);

  for (const lesson of lessons) {
    // Write shell script
    const script = generateScript(lesson);
    const scriptFile = path.join(SCRIPTS_DIR, `${lesson.gifName}.sh`);
    fs.writeFileSync(scriptFile, script);
    fs.chmodSync(scriptFile, '755');

    // Write VHS tape
    const tape = generateTape(lesson);
    const tapeFile = path.join(TAPES_DIR, `${lesson.gifName}.tape`);
    fs.writeFileSync(tapeFile, tape);

    console.log(`  ✓ Lesson ${lesson.id}: ${lesson.gifName}.sh + .tape`);
  }

  console.log(`\nGenerated ${lessons.length} scripts + tapes.`);
  console.log('Run: npm run capture:screenshots');
}

main();
