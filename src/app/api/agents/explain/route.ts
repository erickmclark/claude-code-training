import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/src/agents/adaptiveExplanation';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = body as Record<string, unknown>;
  const { originalExplanation, question, correctAnswer, userLevel } = parsed;

  if (
    typeof originalExplanation !== 'string' ||
    typeof question !== 'string' ||
    typeof correctAnswer !== 'string' ||
    typeof userLevel !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Missing required fields: originalExplanation, question, correctAnswer, userLevel' },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt({ originalExplanation, question, correctAnswer, userLevel }),
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : originalExplanation;

    return NextResponse.json({ explanation: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
