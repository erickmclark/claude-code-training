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

const SYSTEM_PROMPT = `You help people understand Claude Code concepts by adding context that makes ideas click. You receive a lesson step and official documentation. Your job is to fill in what the step leaves out so the reader walks away truly understanding the concept, not just knowing the command.

Write in a warm, direct voice. Like a coworker explaining something over lunch. No bullet points. No stiff headers. Just clear, helpful sentences that make someone go "oh, THAT is why this matters."

Base everything on the official documentation provided. Use the exact commands and terminology from the docs. Never make up features.

Respond with ONLY valid JSON, no markdown, no code fences:
{
  "why": "Explain the real problem this solves. What actually goes wrong on a team that skips this? Paint a quick picture of the pain: wasted time, broken deploys, repeated mistakes. Make the reader feel why this matters before they even try the command.",
  "when": "Give two situations where this is exactly the right tool for the job, and one situation where it is the wrong choice. Be specific about project types and team sizes. Help the reader build judgment about when to reach for this versus something else.",
  "commonMistakes": "Describe the one mistake every beginner makes with this, what happens when they make it (the error they see or the confusion they feel), and the simple fix. Write it like a warning from someone who already made the mistake so they do not have to.",
  "useCase": "Tell a quick story in 3 to 4 sentences. A developer hits a specific problem. They use this exact Claude Code command. Describe what happens in their terminal and the result they get. Include a real file path and command. Write in third person using the name from useCaseName.",
  "useCaseName": "A first name and last initial like 'Priya S.' or 'Marcus T.' Pick from diverse backgrounds: South Asian, Black, East Asian, Latino, White, Middle Eastern, Southeast Asian. Vary every time.",
  "useCaseRole": "A job title like 'Senior Engineer', 'Frontend Developer', 'DevOps Lead', 'Full Stack Developer', 'Staff Engineer', 'Backend Developer'. Vary every time.",
  "useCaseIndustry": "Pick from: Healthcare, Fintech, Gaming, Education, Logistics, Media, Mobile, DevOps, Data Science, Climate Tech, Legal Tech, Real Estate. Never repeat the same one as adjacent steps.",
  "useCaseTechniques": ["One or two Claude Code technique names that this scenario demonstrates, like 'Plan Mode' or 'Git Worktrees' or 'Verification Loop'"],
  "howTo": "Write 2 to 4 numbered action steps that tell the reader exactly what to do for this step. Start each step with a verb. Include the specific command, file path, or menu path. Be concrete — no vague instructions like 'try the technique'. Example format: '1. Open your terminal in the project root.\n2. Run: claude --permission-mode plan\n3. Describe your feature and iterate on the plan until it covers edge cases.\n4. Press Shift+Tab to exit plan mode and let Claude implement.'"
}

Important: do not repeat what the step already explains. Add new angles the step does not cover. Every sentence should teach something the reader did not know before reading it.`;

function loadDocExcerpts(lessonId: number): string {
  const docFiles = lessonDocMap[lessonId];
  if (!docFiles || docFiles.length === 0) return '';

  const excerpts: string[] = [];
  const maxPerDoc = Math.floor(3000 / docFiles.length);

  for (const filename of docFiles) {
    try {
      const filePath = join(process.cwd(), '.claude', 'docs', 'official', filename);
      const content = readFileSync(filePath, 'utf-8');
      excerpts.push(`--- ${filename} ---\n${content.slice(0, maxPerDoc)}`);
    } catch {
      // Skip missing files
    }
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

  const { lessonTitle, stepTitle, stepDescription, lessonId, stepIndex } = body;

  if (typeof lessonTitle !== 'string' || typeof stepTitle !== 'string' || typeof stepDescription !== 'string') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const lid = typeof lessonId === 'number' ? lessonId : null;
  const sidx = typeof stepIndex === 'number' ? stepIndex : null;

  // Check Supabase cache first.
  // NOTE: we do NOT filter on expires_at — earlier inserts never set it, so
  // every existing row has expires_at = NULL and a `gt` filter excluded all of
  // them. Lesson content is stable enough that we treat any existing row as
  // valid. To force a regeneration, delete the row from the cache table.
  if (lid !== null && sidx !== null) {
    try {
      const { data: cached } = await supabase
        .from('enrichment_cache')
        .select('enrichment')
        .eq('lesson_id', lid)
        .eq('step_index', sidx)
        .maybeSingle();

      if (cached?.enrichment) {
        return NextResponse.json({ enriched: cached.enrichment, cached: true });
      }
    } catch {
      // Cache miss — generate fresh
    }
  }

  const docContent = lid !== null ? loadDocExcerpts(lid) : '';

  const userPrompt = `Lesson: ${lessonTitle}
Step: ${stepTitle}
Step content: ${stepDescription.slice(0, 500)}
${docContent ? `\n--- OFFICIAL DOCUMENTATION (use this as your primary source) ---\n${docContent}` : ''}

Generate deeper context for this step grounded in the official documentation. Return ONLY the JSON object.`;

  try {
    const message = await anthropic.messages.create({
      // Haiku per CLAUDE.md spec — Opus 4.6 was ~10x more expensive for the
      // same enrichment quality. Cached after first generation anyway.
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const enriched = JSON.parse(cleaned);

    // Store in Supabase cache
    if (lid !== null && sidx !== null) {
      supabase
        .from('enrichment_cache')
        .upsert(
          { lesson_id: lid, step_index: sidx, enrichment: enriched },
          { onConflict: 'lesson_id,step_index' }
        )
        .then(() => {});
    }

    return NextResponse.json({ enriched });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
