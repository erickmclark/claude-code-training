import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You are a course content writer for a beginner-focused Claude Code training platform. Generate an "About this lesson" overview that helps learners decide if this lesson is right for them and what they'll gain.

Write in a warm, encouraging tone. Keep it concise — learners should be able to scan this in 30 seconds.

OUTPUT FORMAT — respond with ONLY a JSON object, no markdown, no code fences:
{
  "overview": "A 2-3 sentence paragraph summarizing what this lesson covers and why it matters for Claude Code users.",
  "whatYoullLearn": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
  "whoThisIsFor": "One sentence describing the ideal learner for this lesson.",
  "keyTakeaway": "The single most important thing a learner will walk away with.",
  "prerequisites": "What the learner should know or have done before starting. Say 'None — this is beginner-friendly' if no prerequisites."
}`;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { lessonId } = body;

  if (typeof lessonId !== 'number') {
    return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 });
  }

  // Check Supabase cache first (no TTL — permanent cache)
  try {
    const { data: cached } = await supabase
      .from('about_cache')
      .select('content')
      .eq('lesson_id', lessonId)
      .single();

    if (cached?.content) {
      return NextResponse.json({ about: cached.content, cached: true });
    }
  } catch {
    // Cache miss — generate fresh
  }

  // Need lesson data to generate
  const { lessonTitle, objectives, steps, description, duration } = body;

  if (typeof lessonTitle !== 'string') {
    return NextResponse.json({ error: 'Missing lessonTitle' }, { status: 400 });
  }

  const objectivesText = Array.isArray(objectives) ? (objectives as string[]).join('\n- ') : '';
  const stepsText = Array.isArray(steps)
    ? (steps as string[]).map((s, i) => `${i + 1}. ${s}`).join('\n')
    : '';

  const userPrompt = `Generate an "About this lesson" overview for:

Lesson: ${lessonTitle}
${description ? `Description: ${description}` : ''}
${duration ? `Duration: ${duration}` : ''}
${objectivesText ? `\nLearning objectives:\n- ${objectivesText}` : ''}
${stepsText ? `\nLesson steps:\n${stepsText}` : ''}

Return ONLY the JSON object.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const about = JSON.parse(cleaned);

    if (!about.overview) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }

    // Store in Supabase cache (permanent, no expiry)
    supabase
      .from('about_cache')
      .upsert(
        { lesson_id: lessonId, content: about },
        { onConflict: 'lesson_id' }
      )
      .then(() => {});

    return NextResponse.json({ about });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
