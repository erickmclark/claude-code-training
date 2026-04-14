import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_PROMPT = `You design capstone projects for developers who just finished a Claude Code training course. They know the tools. Now they need to prove they can use them to ship something real.

Your job is to give them a project that is portfolio worthy, technically interesting, and impossible to complete well without using Claude Code throughout the process. Not just "build an app" but "build it the way a 10x engineer builds with Claude Code."

Think about what makes a capstone memorable. It should be the kind of project someone puts on their resume and talks about in interviews. Something that solves a real problem in a creative way.

Every requirement you write should tell the student both WHAT to build and HOW to build it with Claude Code. Instead of "build an API" write "use 3 parallel Claude sessions in separate worktrees to build the API endpoints, the test suite, and the documentation simultaneously, then merge all three." That way they practice the technique while building the feature.

Here are the Claude Code techniques they learned and what each one actually does:

Parallel execution means running 3 to 5 Claude sessions at the same time, each in its own terminal tab. Plan mode means pressing Shift+Tab twice to have Claude analyze and plan before writing code. CLAUDE.md is a file at the project root where you write conventions and rules that Claude reads every session. Git worktrees create isolated copies of the repo so parallel sessions do not conflict. Verification loops mean giving Claude a test suite or screenshot to check its own work against. Custom agents are markdown files in .claude/agents/ with specialized instructions and tool restrictions. Skills are reusable workflows in .claude/skills/ that you or Claude can invoke. Hooks are scripts in .claude/settings.json that run automatically when Claude edits files or finishes tasks. MCP connects Claude to external services like Slack, databases, and APIs. The Chrome extension lets Claude open a browser and test web UIs. CI/CD means GitHub Actions or GitLab pipelines that run Claude on PRs. Headless mode runs Claude from scripts with claude -p. Permission modes control what Claude can do: auto mode for autonomous work, /sandbox for isolation, /permissions for allowlists.

Respond with ONLY valid JSON, no markdown, no code fences:
{
  "title": "A specific project title that sounds portfolio worthy",
  "description": "Two to three sentences on what the student builds and why someone would actually use it",
  "goal": "One sentence describing the finished product and the Claude Code mastery it proves",
  "requirements": ["8 to 10 requirements, each naming a specific Claude Code technique and how to use it for that feature"],
  "deliverables": ["5 to 6 things the student submits: repo link, deployed URL, CLAUDE.md, demo video, etc"],
  "estimatedHours": 10,
  "techniques": ["The specific techniques from the list above that this project requires"],
  "rubric": [
    {"criteria": "Category that names a technique", "description": "What mastery looks like for this technique in this project", "points": 15}
  ]
}

The rubric must have 6 to 8 criteria that add up to exactly 100 points. Each criterion should assess how well they used a Claude Code technique, not just whether the feature works. Generate something genuinely unique and creative every time.`;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { domain, skillLevel, sessionId } = body;

  if (typeof domain !== 'string' || typeof skillLevel !== 'string') {
    return NextResponse.json({ error: 'Missing domain or skillLevel' }, { status: 400 });
  }

  // Check Supabase for existing capstone for this session
  if (typeof sessionId === 'string') {
    try {
      const { data: existing } = await supabase
        .from('capstone_projects')
        .select('project')
        .eq('user_session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing?.project) {
        return NextResponse.json({ project: existing.project, cached: true });
      }
    } catch { /* no cached project */ }
  }

  const userPrompt = `Generate a unique capstone project for:

Domain: ${domain}
Skill Level: ${skillLevel}

The student has completed a Claude Code training course covering: parallel execution, plan mode, CLAUDE.md files, git worktrees, voice dictation, verification loops, custom agents, slash commands, hooks & automation, MCP integrations, Chrome extension, CI/CD, plugins, Slack integration, scheduled tasks, remote control, extended thinking, context management, session management, skills system, IDE integration, headless mode, cloud sessions, desktop app, and permission modes.

Generate a project that requires demonstrating at least 8 of these techniques. Make it creative and unique. Not a generic CRUD app. Return ONLY the JSON object.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const project = JSON.parse(cleaned);

    // Store in Supabase
    if (typeof sessionId === 'string') {
      supabase
        .from('capstone_projects')
        .insert({
          user_session_id: sessionId,
          domain,
          skill_level: skillLevel,
          project,
        })
        .then(() => {});
    }

    return NextResponse.json({ project });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
