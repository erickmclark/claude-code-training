import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

type RequestType =
  | 'recommendations'
  | 'explain'
  | 'ask'
  | 'generate-skill'
  | 'build-help'
  | 'review-exercise'
  | 'insights';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, context } = body as {
    type: RequestType;
    context: string;
  };

  if (!client) {
    return NextResponse.json(
      { result: getStaticFallback(type, context) },
      { status: 200 }
    );
  }

  try {
    const systemPrompt = getSystemPrompt(type);
    const maxTokens = type === 'generate-skill' ? 800 : 500;
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: context }],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ result: text });
  } catch {
    return NextResponse.json(
      { result: getStaticFallback(type, context) },
      { status: 200 }
    );
  }
}

function getSystemPrompt(type: string): string {
  switch (type) {
    case 'recommendations':
      return 'You are a Claude Code training advisor. Based on the user\'s quiz scores and progress, provide 2-3 brief, specific recommendations for what to study next. Be encouraging and actionable. Keep your response under 150 words.';
    case 'explain':
      return 'You are a Claude Code expert tutor. The user got a quiz question wrong. Explain why their specific answer is incorrect and why the correct answer is right. Use a concrete example. Keep under 100 words.';
    case 'ask':
      return 'You are a Claude Code expert. Answer questions about Claude Code features, commands, and best practices. Be concise (under 200 words) and include code examples when relevant. Only answer questions about Claude Code — politely decline other topics.';
    case 'generate-skill':
      return `You are a Claude Code skills expert. Generate a complete SKILL.md file based on the user's description. Output ONLY the file content (frontmatter + instructions), ready to copy-paste into .claude/skills/<name>/SKILL.md. Include:
- YAML frontmatter with name, description, disable-model-invocation: true, and argument-hint if applicable
- Clear numbered step-by-step instructions
- Use $ARGUMENTS or $0/$1/$2 for parameters if the skill accepts input
Keep instructions actionable and specific.`;
    case 'build-help':
      return 'You are a Claude Code build assistant. The user is stuck on a guided build step. Based on the step description and their issue, provide targeted debugging advice. Be specific — include exact commands to try. Keep under 200 words.';
    case 'review-exercise':
      return 'You are a Claude Code configuration reviewer. The user will share a CLAUDE.md, hook config, agent file, or skill file they created as a lesson exercise. Review it for correctness, completeness, and best practices. Suggest 1-3 specific improvements. Keep under 200 words.';
    case 'insights':
      return 'You are a learning analytics advisor. Based on the user\'s progress data (quiz scores, completion dates, time spent), provide 2-3 insights about their learning patterns and specific recommendations. Be encouraging. Keep under 150 words.';
    default:
      return 'You are a helpful Claude Code training assistant.';
  }
}

function getStaticFallback(type: string, context: string): string {
  switch (type) {
    case 'recommendations':
      return 'Complete all lesson quizzes to unlock personalized recommendations. Focus on lessons you haven\'t started yet, and revisit any where your quiz score was below 80%.';
    case 'explain':
      return 'Review the lesson material for a deeper understanding of this topic. Pay special attention to the code examples and pro tips.';
    case 'ask':
      if (context.toLowerCase().includes('worktree')) {
        return 'Git worktrees let you run parallel Claude Code sessions in isolated directories. Use `claude --worktree <name>` to create one. Each worktree gets its own branch and files.';
      }
      if (context.toLowerCase().includes('plan')) {
        return 'Plan mode is read-only exploration. Activate with `claude --permission-mode plan` or Shift+Tab. Claude analyzes your codebase without making changes.';
      }
      if (context.toLowerCase().includes('hook')) {
        return 'Hooks run shell scripts at lifecycle events. Key events: PreToolUse (can block with exit 2), PostToolUse, Stop (auto-verify), Notification. Configure in .claude/settings.json.';
      }
      return 'Add an ANTHROPIC_API_KEY to your .env.local file to enable AI-powered answers. For now, explore the lesson content for detailed information on this topic.';
    case 'generate-skill':
      return `---
name: my-skill
description: Describe what this skill does
disable-model-invocation: true
---

1. First step of your workflow
2. Second step
3. Run tests and verify
4. Report results

Add an ANTHROPIC_API_KEY to .env.local to generate custom skills with AI.`;
    case 'build-help':
      return 'Check that you\'ve completed the previous steps first. Make sure Claude Code is installed and running. Try re-reading the step instructions and running the exact prompt provided. If you\'re still stuck, review the related lesson for more context.';
    case 'review-exercise':
      return 'Your file looks good! To get AI-powered review with specific improvement suggestions, add an ANTHROPIC_API_KEY to your .env.local file.';
    case 'insights':
      return 'Keep going! Complete more lessons and quizzes to unlock personalized insights about your learning patterns.';
    default:
      return 'Configure ANTHROPIC_API_KEY in .env.local for AI-powered features.';
  }
}
