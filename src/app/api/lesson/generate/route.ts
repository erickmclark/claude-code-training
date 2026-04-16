import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { lessonDocMap } from '@/src/data/lessonDocs';

const anthropic = new Anthropic();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You are writing a lesson for people learning Claude Code for the first time. Your reader is a developer who can code but has never used Claude Code. They need to understand what to do, why it works, and how to try it right now.

Write like you are pair programming with them. Talk them through each step the way you would talk a new teammate through a feature. Be direct, practical, and encouraging. No corporate tone. No filler. Every sentence should either explain something or tell them to do something.

How to structure the 6 steps:

Step 1 opens with the "aha moment." What is this thing and why will it change how they work? Start with a before and after. Show them what their life looks like without this feature and what it looks like with it. One paragraph, then the first command they should run.

Steps 2 through 4 are the core skills. Each one teaches them to do one thing. Start with "Open your terminal and..." or "Type this command..." Give them something to actually run. Then explain what just happened and why it worked. Keep descriptions between 150 and 200 words.

Step 5 shows them something advanced. How does this feature connect to other Claude Code tools they have learned? What does a power user do differently? This is where you show them the ceiling, not just the floor.

Step 6 is the trouble step. What goes wrong? What error will they see if they mess up? What should they NOT do? This is the step that saves them an hour of debugging later.

Every step needs a code block with commands they can copy and paste. Add comments in the code explaining each line. Include a tip (a practical shortcut) and an officialTip (a specific fact from the documentation).

Respond with ONLY valid JSON, no markdown, no code fences:
{
  "steps": [
    {
      "title": "Short action title like 'Run Your First Plan'",
      "description": "150 to 200 words...",
      "code": "# Terminal commands with comments\\nclaude --example",
      "language": "bash",
      "tip": "A practical shortcut",
      "officialTip": "A precise fact from the official docs"
    }
  ]
}

Generate exactly 6 steps.`;

function loadDocExcerpts(lessonId: number): string {
  const docFiles = lessonDocMap[lessonId];
  if (!docFiles || docFiles.length === 0) return '';
  const excerpts: string[] = [];
  const maxPerDoc = Math.floor(5000 / docFiles.length);
  for (const filename of docFiles) {
    try {
      const filePath = join(process.cwd(), '.claude', 'docs', 'official', filename);
      const content = readFileSync(filePath, 'utf-8');
      excerpts.push(`--- ${filename} ---\n${content.slice(0, maxPerDoc)}`);
    } catch { /* skip */ }
  }
  return excerpts.join('\n\n');
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { lessonId, topic, sourceContent } = body;

  if (typeof lessonId !== 'number' || typeof topic !== 'string') {
    return NextResponse.json({ error: 'Missing lessonId or topic' }, { status: 400 });
  }

  try {
    const { data: cached } = await supabase
      .from('lesson_content_cache')
      .select('steps')
      .eq('lesson_id', lessonId)
      .single();

    if (cached?.steps) {
      return NextResponse.json({ steps: cached.steps, cached: true });
    }
  } catch { /* cache miss */ }

  const docContent = loadDocExcerpts(lessonId);
  const extraContent = typeof sourceContent === 'string' ? sourceContent.slice(0, 1000) : '';

  const userPrompt = `Write a lesson called "${topic}" for the Claude Code training course.

This course has 7 modules: What is Claude Code, Foundations (parallel sessions, plan mode, CLAUDE.md), Core Workflows (worktrees, voice, verification), Automation (hooks, commands, MCP, CI/CD), Agent Architecture (custom agents, teams, channels), Daily Mastery (thinking, context, sessions, skills, IDE, headless), and a Capstone Project.

${extraContent ? `About this lesson: ${extraContent}\n` : ''}
Here is the official documentation to base the lesson on. Every command, flag, and behavior you mention must come from this documentation:

${docContent}

Write 6 steps that teach this topic. Make it feel like a conversation, not a manual. Return ONLY the JSON object.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    supabase
      .from('lesson_content_cache')
      .upsert({ lesson_id: lessonId, steps: parsed.steps }, { onConflict: 'lesson_id' })
      .then(() => {});

    return NextResponse.json({ steps: parsed.steps });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
