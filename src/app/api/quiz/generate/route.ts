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

const SYSTEM_PROMPT = `You write quiz questions for a Claude Code training course. Every question puts the learner in a realistic work situation where they need to pick the right Claude Code approach.

Write like a senior engineer quizzing a junior teammate over coffee. The scenarios should feel like real problems people actually run into at work, not textbook exercises.

Here is how to write each question:

Paint a specific scene. Not "you need to do something" but "you just shipped a broken migration to staging and your team lead pings you on Slack asking for a fix before the 3pm deploy." The reader should feel the pressure and context of a real moment.

Make every wrong answer something a beginner would genuinely try. If nobody would pick it, replace it with a more tempting mistake.

The correct answer must name the exact Claude Code command, flag, or workflow from the lesson. No vague answers like "use the right tool."

The explanation should teach, not just announce the answer. Walk through WHY the correct approach works and WHAT goes wrong if you pick each alternative. Write it so someone who got it wrong walks away understanding the concept, not just memorizing the answer.

Difficulty spread: first two questions test one concept directly. Middle three combine concepts or add a wrinkle. Last three cover edge cases, failure modes, and choosing between two valid approaches.

Output ONLY a JSON array with exactly 8 objects. No markdown. No code fences.
Each object: { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }`;

function loadDocExcerpts(lessonId: number): string {
  const docFiles = lessonDocMap[lessonId];
  if (!docFiles || docFiles.length === 0) return '';
  const excerpts: string[] = [];
  const maxPerDoc = Math.floor(2000 / docFiles.length);
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

  const { lessonTitle, objectives, steps, lessonId } = body;

  if (typeof lessonTitle !== 'string') {
    return NextResponse.json({ error: 'Missing lessonTitle' }, { status: 400 });
  }

  // Check Supabase cache. Earlier inserts never populated expires_at, so
  // every cached row had expires_at = NULL and the previous `gt` filter
  // excluded them all. Treat any existing row as valid; delete the row to
  // force regeneration.
  if (typeof lessonId === 'number') {
    try {
      const { data: cached } = await supabase
        .from('quiz_cache')
        .select('questions')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cached?.questions) {
        return NextResponse.json({ questions: cached.questions, cached: true });
      }
    } catch { /* cache miss */ }
  }

  const objectivesText = Array.isArray(objectives) ? (objectives as string[]).join(', ') : '';
  const stepsText = Array.isArray(steps)
    ? (steps as string[]).map((s, i) => `${i + 1}. ${s}`).join('\n')
    : '';
  const docContent = typeof lessonId === 'number' ? loadDocExcerpts(lessonId) : '';

  const userPrompt = `Write 8 quiz questions that test whether someone actually understood this lesson. Every question must test a specific concept, command, or behavior from the steps below. Do not test general knowledge.

LESSON: ${lessonTitle}
${objectivesText ? `\nWHAT THE LEARNER SHOULD KNOW: ${objectivesText}` : ''}
${stepsText ? `\nWHAT THE LESSON TAUGHT:\n${stepsText}` : ''}
${docContent ? `\nOFFICIAL DOCUMENTATION (use exact commands and terminology from here):\n${docContent}` : ''}

Return ONLY the JSON array.`;

  try {
    const message = await anthropic.messages.create({
      // Sonnet for quiz quality — tricky distractors and teaching explanations
      // matter for the product. Cached after first generation so cost is minimal.
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    if (typeof lessonId === 'number') {
      supabase.from('quiz_cache').insert({ lesson_id: lessonId, questions }).then(() => {});
    }

    return NextResponse.json({ questions });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
