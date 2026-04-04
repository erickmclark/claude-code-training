import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import { roadmap } from '@/data/roadmap';

const phases = [
  {
    number: 1,
    title: 'Start Smart',
    description: 'Open your project and enter Plan Mode for complex tasks.',
    code: `# Open your project
cd my-project

# Start Claude Code
claude

# For complex tasks, enter Plan Mode
# Press Shift+Tab twice
# You'll see: ▮▮ plan mode on

# Or start directly in plan mode:
claude --permission-mode plan`,
    tip: 'Boris starts most sessions in Plan Mode. Only skip it for quick fixes under 5 minutes.',
  },
  {
    number: 2,
    title: 'Plan Before Building',
    description: 'Iterate on the plan until it\'s solid. Include verification steps.',
    code: `# Your prompt in Plan Mode:
"I need to add OAuth2 authentication with Google and GitHub.
Design a complete implementation plan including:
1. Database schema changes
2. OAuth callback routes
3. Session management
4. Protected route middleware
5. Frontend login buttons
6. Testing strategy for each component
7. Rollback approach if something breaks"

# Claude produces a detailed plan
# Press Ctrl+G to edit it in your text editor
# Refine: "Add rate limiting to auth endpoints"
# When ready: "Perfect. Build it."
# Press Shift+Tab to exit plan mode → Claude implements`,
    tip: '"A good plan is really important to avoid issues down the line." Pour your energy into the plan so Claude can 1-shot the implementation.',
  },
  {
    number: 3,
    title: 'Set Up Automatic Verification',
    description: 'Configure hooks ONCE — they verify every change automatically from now on.',
    code: `// Save to: .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \\"$FILE\\" || true"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Run npm test. If any tests fail, respond with ok: false and include the failure details."
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash(git commit *)",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint || exit 2"
          }
        ]
      }
    ]
  }
}`,
    tip: '"Give Claude a way to verify its work — it will 2-3x the quality." Now every edit is auto-formatted, every response triggers tests, and every commit must pass lint.',
  },
  {
    number: 4,
    title: 'Parallelize Heavy Work',
    description: 'Split independent tasks across worktrees. Each Claude works in isolation.',
    code: `# Terminal 1: Backend work
claude --worktree oauth-backend
> "Build OAuth2 backend: migrations, callback routes,
   session management. Run tests after each file."

# Terminal 2: Frontend work
claude --worktree oauth-frontend
> "Build OAuth2 frontend: login buttons, redirect handling,
   auth state management. Run tests."

# Terminal 3: Integration tests
claude --worktree oauth-tests
> "Write comprehensive integration tests for the full
   OAuth2 flow: signup, login, token refresh, logout.
   Test both Google and GitHub providers."

# Use /color to distinguish sessions visually:
# Terminal 1: /color blue
# Terminal 2: /color green
# Terminal 3: /color red`,
    tip: '"Running 3-5 worktrees simultaneously is the single biggest productivity unlock." Merge in dependency order: backend first, then frontend, then tests.',
  },
  {
    number: 5,
    title: 'Review with a Custom Agent',
    description: 'Create a specialized reviewer agent and let it audit the implementation.',
    code: `# Save to: .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob
model: sonnet
---

Review the OAuth2 implementation for:
1. Token storage security (no localStorage for refresh tokens)
2. CSRF protection on OAuth callbacks
3. Input validation on all endpoints
4. Proper error handling (don't leak internal errors)
5. Rate limiting effectiveness
6. Session fixation prevention

Provide specific file:line references and suggested fixes.

# Then in your Claude session:
> "Use the security-reviewer agent to audit the OAuth implementation."

# Or challenge Claude directly:
> "Grill me on these changes. Don't open a PR until I pass your test."
> "Prove to me this works. Diff behavior between main and your branch."`,
    tip: '"Don\'t accept the first solution. Push Claude to do better — it usually can." Three patterns: grill me, prove it works, scrap and redo.',
  },
  {
    number: 6,
    title: 'Ship It',
    description: 'Use your custom skill to commit, push, and open a PR in one command.',
    code: `# If you created the /commit-push-pr skill:
/commit-push-pr

# Or the /deploy skill for production:
/deploy

# What happens:
# 1. Git status and diff are analyzed
# 2. A clear commit message is written
# 3. Files are staged and committed
# 4. Branch is pushed to remote
# 5. PR is created with gh cli
# 6. (deploy) Tests, lint, build all pass first`,
    tip: '"If you do something more than once a day, turn it into a skill or command." Your /deploy skill replaces a 10-step manual checklist.',
  },
  {
    number: 7,
    title: 'Learn and Compound',
    description: 'Update CLAUDE.md so Claude never makes the same mistake twice.',
    code: `# After every session, tell Claude:
> "Update CLAUDE.md with what we learned:
   - OAuth uses httpOnly cookies for tokens (not localStorage)
   - Rate limiting is 100 req/15min per IP on auth endpoints
   - Always test with both Google and GitHub providers
   - The OAuth callback URL must exactly match the provider config"

# In PR reviews, tag @.claude to add learnings:
# "nit: use httpOnly cookies for tokens.
#  @claude add to CLAUDE.md: never store OAuth tokens
#  in localStorage, always use httpOnly cookies"

# Over time, your CLAUDE.md becomes a comprehensive
# style guide that eliminates repeated corrections.`,
    tip: '"Ruthlessly edit your CLAUDE.md over time. Keep iterating until Claude\'s mistake rate measurably drops." Boris calls this "Compounding Engineering."',
  },
];

export default function WorkflowPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          The Complete Workflow
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          How to combine every Claude Code technique into one production workflow.
          This is the &ldquo;put it all together&rdquo; method.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
          Plan → Build (parallel) → Auto-verify → Review → Ship → Learn
        </div>
      </div>

      {/* Visual flow */}
      <div className="flex items-center justify-center gap-2 mb-16 flex-wrap">
        {['Plan', 'Build', 'Verify', 'Review', 'Ship', 'Learn'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-900 dark:text-white">
              {step}
            </div>
            {i < 5 && (
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Phases */}
      <div className="space-y-8">
        {phases.map((phase) => (
          <section key={phase.number} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {phase.number}
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {phase.title}
                </h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4 ml-11">
                {phase.description}
              </p>
              <CodeBlock code={phase.code} language={phase.number === 3 ? 'json' : 'bash'} />
              <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Boris Tip:</span> {phase.tip}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Techniques Ranked by Impact */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          12 Techniques Ranked by Impact
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400">Rank</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400">Technique</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400">Impact</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400">Effort</th>
                  <th className="text-left p-3 font-semibold text-gray-600 dark:text-gray-400">Lesson</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { rank: 1, tech: 'Verification (Browser)', impact: '3x quality', effort: 'Low', lesson: 6 },
                  { rank: 2, tech: 'Plan Mode', impact: '2x speed', effort: 'Low', lesson: 2 },
                  { rank: 3, tech: 'Parallel Execution', impact: '5x speed', effort: 'Medium', lesson: 1 },
                  { rank: 4, tech: 'CLAUDE.md', impact: 'Compounding', effort: 'Low', lesson: 3 },
                  { rank: 5, tech: 'Git Worktrees', impact: 'Enables parallel', effort: 'Low', lesson: 4 },
                  { rank: 6, tech: 'Custom Agents', impact: 'Specialized work', effort: 'Medium', lesson: 8 },
                  { rank: 7, tech: 'Voice Dictation', impact: '3x faster input', effort: 'Low', lesson: 5 },
                  { rank: 8, tech: '/batch', impact: '10x on big tasks', effort: 'Medium', lesson: 9 },
                  { rank: 9, tech: 'Hooks', impact: 'Perfect code', effort: 'Medium', lesson: 10 },
                  { rank: 10, tech: 'Mobile Control', impact: 'Work anywhere', effort: 'Low', lesson: 11 },
                  { rank: 11, tech: 'Slash Commands', impact: 'Faster workflows', effort: 'Low', lesson: 9 },
                  { rank: 12, tech: 'Effort Levels', impact: 'Better on hard problems', effort: 'Low', lesson: 12 },
                ].map((row) => (
                  <tr key={row.rank}>
                    <td className="p-3 text-gray-900 dark:text-white font-bold">{row.rank}</td>
                    <td className="p-3 text-gray-900 dark:text-white">{row.tech}</td>
                    <td className="p-3 text-blue-600 font-medium">{row.impact}</td>
                    <td className="p-3 text-gray-500">{row.effort}</td>
                    <td className="p-3">
                      <Link href={`/lessons/${row.lesson}`} className="text-blue-600 hover:underline text-xs">
                        Lesson {row.lesson}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Master these 3 first: Plan Mode, Parallel Work, CLAUDE.md. After 1 week: 3-5x faster development.
        </p>
      </section>

      {/* Master's Mindset */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          The Master&apos;s Mindset
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            After mastering these techniques, every task follows this decision framework:
          </p>
          <div className="space-y-4">
            {[
              { q: 'Can I parallelize this?', a: 'Yes → split into 5 parts, spawn 5 Claudes in worktrees' },
              { q: 'Do I need a plan?', a: 'Complex task → Plan Mode. Quick fix → go straight to code.' },
              { q: 'Can Claude verify the work?', a: 'Web → give browser. API → give tests. Systems → give logs.' },
              { q: 'Do I have CLAUDE.md patterns?', a: 'Check CLAUDE.md first. Follow established patterns.' },
              { q: 'Should I use custom agents?', a: 'Yes → spawn CodeReviewer in parallel for quality check.' },
              { q: 'Voice or typed?', a: 'Voice — 3x faster, and prompts get way more detailed.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-950">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.q}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Result:</span> Complex features built in hours, not days. Quality is high because verification is built-in.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Week Practice Roadmap */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          4-Week Practice Roadmap
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Follow this structured plan to go from beginner to master in 28 days.
        </p>
        <div className="space-y-6">
          {roadmap.map((week) => (
            <div key={week.week} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Week {week.week}: {week.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{week.description}</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {week.days.map((day) => (
                  <div key={day.id} className="px-6 py-3 flex items-start gap-3">
                    <span className="text-xs text-gray-400 font-mono w-14 shrink-0 pt-0.5">{day.day}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{day.task}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{day.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-950">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Deliverable:</span> {week.deliverable}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="mt-16 p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          That&apos;s the 10x Workflow
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          Plan mode eliminates wrong approaches. Parallel worktrees multiply throughput. Hooks guarantee quality. Custom agents catch what you miss. Skills automate the repetitive parts. CLAUDE.md compounds your learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/build"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            Practice with a Guided Build
          </Link>
          <Link
            href="/lessons/1"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
          >
            Start with Lesson 1
          </Link>
        </div>
      </section>
    </div>
  );
}
