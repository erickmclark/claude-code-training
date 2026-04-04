import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  type CoachInput,
  type CoachResponse,
} from '@/src/agents/progressCoach';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const FALLBACK: CoachResponse = {
  insight:
    'You just completed a hands-on practice exercise — the kind of deliberate repetition that builds real muscle memory with Claude Code.',
  strength: 'Following through on the full exercise checklist',
  focus_for_next:
    'As you move to the next lesson, notice how the concepts build on each other. Try applying what you just practiced before reading ahead.',
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CoachInput;
  const { lessonId, lessonTitle, moduleTitle, exerciseDescription } = body;

  if (!lessonId || !lessonTitle || !moduleTitle) {
    return NextResponse.json(
      { error: 'lessonId, lessonTitle, and moduleTitle are required' },
      { status: 400 },
    );
  }

  if (!client) {
    return NextResponse.json(FALLBACK);
  }

  try {
    const userPrompt = buildUserPrompt({
      lessonId,
      lessonTitle,
      moduleTitle,
      exerciseDescription,
    });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText =
      message.content[0]?.type === 'text' ? message.content[0].text : '';

    // Strip any accidental markdown code fences before parsing
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned) as CoachResponse;

    // Validate all three fields are present strings
    if (
      typeof parsed.insight !== 'string' ||
      typeof parsed.strength !== 'string' ||
      typeof parsed.focus_for_next !== 'string'
    ) {
      throw new Error('Invalid coach response shape');
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Progress coach API error:', err);
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
