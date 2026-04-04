import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

interface ChatContext {
  lessonTitle: string;
  lessonId: number;
  moduleTitle?: string;
  currentSection?: string;
  currentStepTitle?: string;
  quizQuestions?: string[];
}

export async function POST(request: NextRequest) {
  const { messages, context } = (await request.json()) as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    context: ChatContext;
  };

  if (!client) {
    return NextResponse.json({
      result:
        'Add an ANTHROPIC_API_KEY to .env.local to enable the Ask Claude chat widget.',
    });
  }

  try {
    const userMessages = messages.slice(-10).filter((m) => m.content.trim());
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: buildSystemPrompt(context),
      messages: userMessages,
    });

    const text =
      message.content[0]?.type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ result: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { result: 'Sorry, something went wrong. Please try again.' },
      { status: 200 }
    );
  }
}

function buildSystemPrompt(ctx: ChatContext): string {
  const lines = [
    'You are an expert Claude Code tutor embedded in an interactive training platform.',
    'Help learners understand Claude Code features, commands, and best practices.',
    '',
    '## Current lesson context',
    `- Lesson: ${ctx.lessonTitle} (ID: ${ctx.lessonId})`,
  ];
  if (ctx.moduleTitle) lines.push(`- Module: ${ctx.moduleTitle}`);
  if (ctx.currentSection) lines.push(`- Section: ${ctx.currentSection}`);
  if (ctx.currentStepTitle)
    lines.push(`- Current step: "${ctx.currentStepTitle}"`);
  if (ctx.quizQuestions?.length) {
    lines.push('', '## Quiz questions for this lesson');
    ctx.quizQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    lines.push(
      '',
      'For quiz questions: give educational context and hints, do NOT reveal the correct answer directly.',
    );
  }
  lines.push(
    '',
    '## Rules',
    '- Claude Code topics only. Politely decline unrelated questions.',
    '- Keep responses under 250 words. Use actual CLI commands in examples.',
    '- Be encouraging. Learners are beginners.',
    '- Plain text only — avoid markdown headers.',
  );
  return lines.join('\n');
}
