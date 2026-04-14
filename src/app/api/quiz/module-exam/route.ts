import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { modules } from '@/data/modules';
import { lessons } from '@/data/lessons';
import { lessonDocMap } from '@/src/data/lessonDocs';

const anthropic = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You are a senior assessment designer for a Claude Code training platform. You create MODULE-LEVEL final exams that test whether a learner has mastered ALL lessons in a module and can combine techniques in realistic work situations.

This is a FINAL EXAM, not a lesson quiz. The learner has completed every lesson in this module. Your questions must:

QUESTION DESIGN RULES:
1. Every question starts with a detailed, realistic work scenario (3+ sentences of context)
2. Test ACROSS lessons — at least 5 questions should require combining knowledge from 2+ lessons in the module
3. Include "which technique is the RIGHT one" questions where options come from DIFFERENT lessons — the learner must pick the best approach
4. Include 3-4 questions about what NOT to do, failure modes, and edge cases
5. Wrong answers must be plausible techniques from the module that don't fit THIS scenario
6. Explanations must cite specific commands, flags, and behaviors from the official documentation
7. NEVER ask "What is X?" or "Which command does Y?" — always test APPLICATION in context

DIFFICULTY DISTRIBUTION (20 questions):
- Questions 1-4: Apply a single lesson's concept in a realistic scenario
- Questions 5-10: Combine two lessons' techniques or handle complications
- Questions 11-15: Edge cases, failure modes, "when NOT to use this", choosing between similar techniques
- Questions 16-18: Complex multi-step scenarios requiring 3+ techniques from different lessons
- Questions 19-20: Architect-level questions — design a complete workflow using multiple module concepts

EXPLANATION RULES:
- Cite the specific command/flag/behavior and which lesson it comes from
- Explain why each wrong answer fails in THIS specific scenario (not just "it's wrong")
- For cross-lesson questions, explain how the techniques interact

OUTPUT FORMAT — respond with ONLY a JSON array, no markdown, no code fences:
[
  {
    "question": "You are [detailed scenario with enough context to make a decision]...",
    "options": ["Specific approach A citing real commands", "Specific approach B", "Specific approach C", "Specific approach D"],
    "correctIndex": 0,
    "explanation": "The correct approach is A because [reason citing docs and lesson]. Option B (from Lesson X) fails here because [specific reason]. Option C would [problem]. Option D is for [different situation]."
  }
]

Generate exactly 20 questions.`;

function loadDocExcerpts(lessonId: number): string {
  const docFiles = lessonDocMap[lessonId];
  if (!docFiles || docFiles.length === 0) return '';
  const excerpts: string[] = [];
  const maxPerDoc = Math.floor(1000 / docFiles.length);
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

  const { moduleId } = body;

  if (typeof moduleId !== 'number') {
    return NextResponse.json({ error: 'Missing moduleId' }, { status: 400 });
  }

  // Check cache first (permanent, no TTL)
  try {
    const { data: cached } = await supabase
      .from('module_exam_cache')
      .select('questions')
      .eq('module_id', moduleId)
      .single();

    if (cached?.questions) {
      return NextResponse.json({ questions: cached.questions, cached: true });
    }
  } catch { /* cache miss */ }

  // Load module and all its lessons
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) {
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  }

  const moduleLessons = mod.lessons
    .map((id) => lessons.find((l) => l.id === id))
    .filter(Boolean);

  // Build lesson summaries for the prompt
  const lessonSummaries = moduleLessons.map((lesson) => {
    const l = lesson!;
    return `LESSON: ${l.title}
Objectives: ${l.objectives.join(', ')}
Steps: ${l.steps.map((s) => s.title).join(', ')}
Key takeaway: ${l.keyTakeaway || ''}`;
  }).join('\n\n');

  // Load doc excerpts for all lessons in module
  const allDocs = moduleLessons
    .map((l) => loadDocExcerpts(l!.id))
    .filter(Boolean)
    .join('\n\n');

  const userPrompt = `Generate a 20-question final exam for this module. Questions must test ACROSS all lessons — not just one at a time.

MODULE: ${mod.title}
DESCRIPTION: ${mod.description}

${lessonSummaries}

${allDocs ? `--- OFFICIAL DOCUMENTATION (ground all questions in this) ---\n${allDocs}` : ''}

Remember: This is a MODULE FINAL EXAM. At least 5 questions must combine concepts from multiple lessons. Include "which technique fits this scenario" questions where options come from different lessons. Return ONLY the JSON array.`;

  try {
    const message = await anthropic.messages.create({
      // Sonnet for exam quality — module exams gate progression, so question
      // quality directly affects course credibility. Cached after first gen.
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    // Cache permanently
    supabase
      .from('module_exam_cache')
      .upsert({ module_id: moduleId, questions }, { onConflict: 'module_id' })
      .then(() => {});

    return NextResponse.json({ questions });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
