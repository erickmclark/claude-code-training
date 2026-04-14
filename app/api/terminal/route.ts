import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const LESSON_SCENARIOS: Record<number, string> = {
  1: 'You have 3 tasks: build auth, a dashboard API, and a landing page. Practice running parallel Claude Code sessions.',
  2: 'You need to refactor the auth module in a large codebase. Practice using plan mode before making changes.',
  3: "You've just joined a new team's codebase. Practice setting up a CLAUDE.md file.",
  4: "You're working on 2 features simultaneously — a payment refactor and a new API endpoint.",
  5: 'You want to describe a complex UI redesign quickly without typing it all out.',
  6: 'You need Claude to build a feature AND automatically run tests to verify it works.',
  7: 'You have a large codebase migration — 50 files need updating. Use multi-agent parallelism.',
  8: 'Your team needs a specialized code reviewer agent that runs on every PR.',
  9: "You run the same 'commit, push, open PR' workflow 10 times a day.",
  10: 'You want code to auto-format every time Claude edits a file.',
  11: "You're away from your laptop but need to approve a PR fix from your phone.",
  12: 'Migrate 50 React class components to functional components using /batch.',
  13: "You have personal sandbox API keys you don't want to commit to git.",
  14: 'Claude just made changes that broke the build. You need to roll back to a checkpoint.',
  15: 'You want to use Haiku for simple tasks and save Opus for hard architectural problems.',
  16: 'You want to build a CI script that runs Claude Code headlessly on a schedule.',
  17: 'You need a detailed multi-step architectural plan for a new microservice.',
  18: 'You want Claude to react automatically when CI fails on your main branch.',
  19: 'You want to connect Claude Code to your GitHub to read issues and open PRs.',
  20: 'Your context window is nearly full on a long debugging session.',
  21: "You're solving a tricky algorithm problem and want Claude to think deeply before coding.",
  22: "You're 3 hours into a complex session and your context is nearly exhausted.",
  23: "You want to pick up yesterday's debugging session exactly where you left off.",
  24: "You type 'generate commit message' many times per day — turn it into a skill.",
  25: "You want to see Claude's code suggestions inline in VS Code while you work.",
  26: 'You want to run Claude Code as part of your nightly CI pipeline.',
};

function buildSystemPrompt(lessonId: number, mode: string): string {
  const scenario = LESSON_SCENARIOS[lessonId] ?? 'Practice using Claude Code commands.';

  return `You are Claude Code, Anthropic's agentic coding CLI, running inside a practice terminal on a learning platform.
The student is practicing Claude Code commands interactively.

SCENARIO FOR THIS LESSON:
${scenario}

CURRENT MODE: ${mode}

## How to respond (IMPORTANT — read carefully):

1. RESPOND AS THE CLI TOOL, not as a chatbot. You are the terminal output, not a helpful assistant explaining things.

2. BE CONCISE. Max 20 lines. Real terminals don't write essays.

3. FORMAT rules:
   - File reads: "● Reading src/auth.ts..."
   - Bash commands: "● Running: npm install"
   - Completion: "✓ Done. [brief summary]"
   - Errors: "✗ Error: [what went wrong]"
   - Plan mode output (when mode is "plan" or user types /plan):
     ▮▮ PLAN: [title]

      1. [specific step]
      2. [specific step]
      3. [specific step]

     Does this look good? Type "yes" to proceed.
   - Normal responses: plain text, no markdown headers, no bullets with **bold**

4. SPECIAL COMMANDS:
   - "claude" or "claude ." → show a brief welcome banner, then wait for a prompt
   - "/plan <task>" → respond in plan mode format regardless of current mode
   - "yes" after a plan → simulate implementing it with tool-use lines
   - "/compact" → "Context compacted. [X]k tokens freed."
   - "/clear" → handled client-side, you won't see this

5. If user asks something unrelated to Claude Code or coding, reply:
   "This terminal is for practicing Claude Code. Try: claude /plan add a feature, or describe a coding task."

6. Keep the scenario in mind — tailor your responses to be relevant to it.

NO markdown. NO headers with ##. NO **bold**. Plain terminal text only.`;
}

export async function POST(request: NextRequest) {
  const { command, lessonId, mode } = (await request.json()) as {
    command: string;
    lessonId: number;
    mode: string;
  };

  if (!client) {
    return NextResponse.json({
      result: 'Add ANTHROPIC_API_KEY to .env.local to enable the practice terminal.',
    });
  }

  try {
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: buildSystemPrompt(lessonId, mode),
      messages: [{ role: 'user', content: command }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Terminal API error:', err);
    return NextResponse.json({ result: '✗ Error: Something went wrong. Please try again.' });
  }
}
