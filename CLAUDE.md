# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (usually localhost:3000, may use 3003 if 3000 is busy)
npm run build    # Production build — must pass with zero errors before committing
npm run lint     # ESLint with Next.js core-web-vitals + TypeScript rules — must pass with zero warnings
npm start        # Start production server (run build first)
```

There is no test suite configured. Verify changes with `npm run build && npm run lint`.

## Architecture

B2C learning platform for Claude Code mastery. Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript strict mode. 30 lessons across 5 modules with AI-generated quizzes, AI-enriched step content, and gamification (XP, streaks, badges).

### Directory Structure

The project uses **two directory trees**:
- `app/` — Next.js route files (pages Next.js serves)
- `src/` — New components, pages, data, and styles (preferred location for new code)

**Route bridge pattern** — New pages live in `src/app/`, with a one-line bridge in `app/`:
```tsx
// app/dashboard/page.tsx
export { default } from '@/src/app/dashboard/page';
```

### Design System (`src/styles/design-system.css`)

All new UI uses CSS custom properties — **no hardcoded colors, no Tailwind color classes**:
- **Palette:** `--color-cream` (#faf8f5 bg), `--color-sand`, `--color-border`, `--color-coral` (#cc5c38 accent), `--color-coral-dark`, `--color-coral-light`, `--color-ink` (headings), `--color-body` (text), `--color-secondary`, `--color-hint`
- **Fonts:** `--font-display` (Lora serif for headings), `--font-body` (DM Sans for body)
- **Radius:** `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (14px), `--radius-full` (pill)
- **Border:** `--border` (0.5px solid)
- **Accent is CORAL (#cc5c38)**, not blue. Old blue/purple classes overridden in globals.css.

Apply via inline styles: `style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}`

### Data layer

- `data/lessons.ts` — **30 lessons** with steps, code examples, Boris tips, and **8 situational quiz questions per lesson** (fallback; quizzes are now AI-generated). Exports `lessons`, `lessonSummaries`.
- `data/practiceExercises.ts` — **30+ interactive exercises** indexed by lesson ID (challenge, hints, solution, success message).
- `data/modules.ts` — 5 modules with lesson mappings, unlock logic via `isModuleUnlocked(moduleId, completedLessonIds[])`.
- `src/data/lessonDocs.ts` — Maps lesson IDs to official doc filenames for AI enrichment grounding.
- `data/quizzes.ts` — Legacy quiz data + final test (being replaced by inline quizzes in lessons.ts).
- `data/skills.ts` — Skill examples and categories for Skills teaching page.
- `data/case-studies.ts` — 7 real company case studies.
- `data/guided-build.ts` — 3 guided builds (Spotify, Stripe, Vulcan).
- `data/roadmap.ts` — 4-week practice roadmap + actionable checklist.
- `data/capstones.ts` — 3 capstone projects.
- `src/data/lessons/index.ts` — Re-exports with helpers: `getLessonById()`, `getModuleForLesson()`.

### Two localStorage Keys

1. **`claude-code-training-progress`** — Original system in `utils/progress.ts`. Tracks lesson completion, quiz scores, steps.
2. **`claude-training-progress`** — New dashboard system in `src/app/dashboard/page.tsx`. Tracks lessons, streak, XP, activity.

### Key Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage (cream bg, coral accents, module cards, lesson grid) |
| `/lessons/[id]` | `app/lessons/[id]/page.tsx` | Two-column lesson page (sidebar steps + content/quiz/practice) |
| `/dashboard` | `app/dashboard/page.tsx` → `src/app/dashboard/page.tsx` | Stats, resume banner, module cards, streak, certificate, activity |
| `/modules/[id]` | `app/modules/[id]/page.tsx` | Module detail (legacy) |
| `/module/[moduleId]` | `app/module/[moduleId]/page.tsx` → `src/app/module/[moduleId]/page.tsx` | Module preview — hero, outcomes, lessons list (3 states), sidebar |
| `/lesson/[lessonId]` | `app/lesson/[lessonId]/page.tsx` → `src/app/lesson/[lessonId]/page.tsx` | Singular alias for lesson player (uses `LessonPage` component) |
| `/lesson/[lessonId]/intro` | `app/lesson/[lessonId]/intro/page.tsx` → `src/app/lesson/[lessonId]/intro/page.tsx` | Lesson intro — stat tiles, roadmap, knowledge check A/B/C, start button |
| `/skills` | `app/skills/page.tsx` | Skills teaching module |
| `/workflow` | `app/workflow/page.tsx` | 7-phase workflow + techniques table + 4-week roadmap |
| `/build` | `app/build/page.tsx` | Guided builds |
| `/case-studies` | `app/case-studies/page.tsx` | Company case studies |
| `/getting-started` | `app/getting-started/page.tsx` | Installation guide |

### New Components (`src/components/`)

- `src/components/lesson/LessonPage.tsx` — Two-column lesson layout (steps, quiz, exercise tabs + install banner)
- `src/components/lesson/LessonSidebar.tsx` — Step list + section tabs (Quiz, Exercise)
- `src/components/lesson/StepContent.tsx` — Step renderer with code blocks, tip blocks, AI-enriched context cards
- `src/components/quiz/BeginnerQuiz.tsx` — AI-generated situational quiz with adaptive explanations
- `src/components/lesson/PracticeExercise.tsx` — Checklist with coral checkboxes
- `src/components/chat/ChatWidget.tsx` — Full-height right-side drawer chat (400px, slides in from edge)
- `src/components/terminal/TerminalLauncher.tsx` — Claude Code launcher panel (replaced fake terminal emulator)

## Key Patterns

**Design token styling** — All new UI uses inline styles with CSS vars:
```tsx
<h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>Title</h2>
<button style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)' }}>Action</button>
```

**AI-generated quizzes** — Quiz questions are generated at runtime by Claude Haiku, cached in Supabase (`quiz_cache` table, 7-day expiry). Falls back to static questions in `lesson.quiz` if API fails. Each retry generates fresh questions.

**AI-enriched step content** — Each lesson step fetches deeper context (why/when/mistakes) from Claude Haiku at runtime, grounded in official docs via `lessonDocMap`. Cached in Supabase (`enrichment_cache` table, 30-day expiry) and `sessionStorage`.

**Situational quiz questions** — All questions present real work scenarios. Never "What is X?" — always "You're in situation Y, what do you do?"

**Practice exercises** — Wired from `data/practiceExercises.ts`. Shows challenge cards with collapsible hints (`<details>`) and solutions. Falls back to `lesson.exercise` for lessons without practiceExercises.

**Module unlock** — `isModuleUnlocked(moduleId, completedLessonIds[])`. Module 1 always unlocked. Others require ALL previous module lessons completed.

**Module difficulty** — Stored on each module in `data/modules.ts` as `difficulty` field. All 5 modules are Beginner/Beginner/Intermediate/Advanced/Advanced. No 'Expert' level on modules.

**Lesson routing** — All lesson links use singular `/lesson/[lessonId]`, not plural `/lessons/[id]`. The `/lessons/[id]` route is a legacy standalone page — do not add new features there.

**Completed lesson IDs** — Derived consistently across pages:
```ts
const completedLessonIds: number[] = Object.entries(progress.lessons)
  .filter(([, v]) => v.status === 'complete')
  .map(([k]) => parseInt(k, 10));
```

**Pre-existing lint issues** — 18 lint errors/warnings exist in `capstones/`, `components/`, `utils/assessment.ts`. These are pre-existing; new `src/app/` files have zero issues.

**Next.js 16 params** — `const { id } = use(params)` in client components, `await params` in server components.

**React 19 setState** — No `setState` in render or synchronous code paths. Use `useState(() => ...)` lazy initializer for static defaults only.

**Hydration safety** — NEVER use `typeof window === 'undefined'` inside `useState` initializers. React 19 runs the lazy initializer on both server and client, and any divergence causes a hydration mismatch error in the browser console. Instead, initialize with the server-safe default and populate from `localStorage`/`window` in a `useEffect`:
```tsx
// ❌ WRONG — causes hydration mismatch
const [val] = useState(() => {
  if (typeof window === 'undefined') return default;
  return localStorage.getItem('key');
});

// ✅ CORRECT — server and client render identically on first pass
const [val, setVal] = useState(default);
useEffect(() => { setVal(localStorage.getItem('key')); }, []);
```
This pattern was applied to: `app/page.tsx`, `app/HomeCourseView.tsx`, `app/lessons/[id]/page.tsx`, `app/lessons/[id]/LessonClient.tsx`, `components/Navbar.tsx`, `components/LessonFilter.tsx`, `src/components/lesson/LessonPage.tsx`.

## Sidebar lesson click + overview interaction

In `src/components/lesson/LessonSidebar.tsx`, the lesson button onClick must special-case the Course Overview state. When `isOverviewActive` is true and the user clicks the *current* lesson, naively calling `toggleLesson(lessonId)` removes it from the pre-expanded set (initial `useState` seeds `currentLessonId`) AND skips `router.push` (because `lessonId === currentLessonId`), leaving the user stranded on the overview view with the lesson collapsed. Fix: if `isOverviewActive && lessonId === currentLessonId`, call `onOverviewClick()` to return to lesson view and force-add the lesson to `expandedLessons` instead of toggling.

## Plugins

- `frontend-design@claude-plugins-official` — installed at user scope

## Content Guidelines

- Source: **official Claude Code docs** (`.claude/docs/official/`) + **Boris Cherny's tips** (`.claude/docs/`)
- Quiz questions are **AI-generated at runtime** by Haiku, grounded in lesson content. Fallback static questions in `lesson.quiz`.
- Step enrichment is **AI-generated at runtime** with why/when/mistakes context, grounded in official docs via `src/data/lessonDocs.ts`.
- Teaching content: **exact commands, full file contents, copy-pasteable code**
- Boris quotes: `"Quote text." — Boris Cherny`

## Style

Cream background (#faf8f5), coral accent (#cc5c38), Lora serif headings, DM Sans body. White cards with subtle borders. **No dark theme for UI elements. No blue/purple. All coral.** The ONLY dark backgrounds allowed are code blocks (`var(--color-ink)` / `#1a1916`). Banners, badges, headers, CTAs, and all other UI must use coral/cream palette.

## About This App

This is a **beginner-focused Claude Code training app**. Target audience: developers new to Claude Code wanting a structured, hands-on learning path from installation through advanced multi-agent workflows. Approachable, step-by-step, assumes no prior experience.

## Session Learnings (April 2026)

### What went well
- **Dev server restart** — Killing existing processes on ports 3000/3003 before restarting avoids port conflicts. Use `lsof -ti:3000,3003 | xargs kill -9` then `npm run dev`.
- **Plugin installation via CLI** — `claude plugin install <name>@<marketplace>` works cleanly. Always run `/reload-plugins` after installing to activate without restarting the session.
- **4 new lessons built from official docs** — Lessons 27-30 (Chrome, CI/CD, Plugins, Slack/Scheduling) added to Module 3 with 8 quiz questions each, all sourced from `.claude/docs/official/`.
- **Supabase caching for AI content** — Quiz generation went from ~15s to ~0.15s after first load. Project: "Claude Code Mastery" (`uvgxefulkovletvtgynq`).
- **AI enrichment grounded in docs** — Feeding official doc excerpts into the Haiku prompt produces much more accurate, terminology-correct enrichments vs. general knowledge.
- **Module preview pages fixed** — `progress.modules` crash fixed with optional chaining; module 5 added to `createDefaultProgress()`.
- **Homepage redesign** — Accordion modules replaced with 5 clickable box cards linking to `/module/{id}` preview pages.
- **CSS animation system** — Pure CSS `@keyframes` + utility classes in `design-system.css` (no dependencies). Applied to homepage, module preview, lesson steps, quizzes, getting-started.
- **Playwright for visual verification** — Using the Playwright MCP server to navigate, snapshot, and screenshot pages catches bugs the build can't (like the module preview crash).

### Mistakes to avoid
- **NEVER use dark theme (#0d1117) for new UI elements** — The user explicitly rejected dark-themed components (install banner, AI badges, getting-started header/CTA). ALL new UI must use the coral/cream design system. Only exception: code blocks use `var(--color-ink)` which is the standard dark code background.
- **Don't build fake terminal emulators** — The user rejected the simulated terminal that generated fake Claude Code responses. Instead, direct users to open real Claude Code (`claude.ai/code` or `claude` in terminal).
- **Don't generate terminal screenshot mockups** — Playwright-captured mockup images of fake terminal output looked bad and were rejected. If screenshots are needed, use only real product screenshots or skip them.
- **Always add optional chaining for progress data** — `progress.modules?.[]` not `progress.modules[]`. Users may have stale localStorage data missing new fields (like module 5). The module preview page crashed because of this.
- **Always add new modules to `createDefaultProgress()`** — When adding module 5, the default progress object in `src/lib/progress.ts` was missing it, causing crashes for users without existing localStorage data.
- **Restart dev server after data file changes** — Changes to `data/lessons.ts` and `data/modules.ts` require a dev server restart to take effect. The build passing doesn't mean the running server has the new data.
- **Don't duplicate Supabase projects across orgs** — Check which org the user wants before creating. We accidentally created the project in the wrong org and had to switch.
- **Auth is currently disabled** — `utils/supabase/middleware.ts` has the auth redirect commented out. Uncomment when ready to ship.

### API Routes
| Route | Purpose | Model | Cache |
|-------|---------|-------|-------|
| `/api/quiz/generate` | AI-generated quiz questions | Haiku 4.5 | Supabase `quiz_cache` (7 days) |
| `/api/lesson/enrich` | AI-enriched step context (why/when/mistakes) | Haiku 4.5 | Supabase `enrichment_cache` (30 days) |
| `/api/agents/explain` | Adaptive wrong-answer explanations | Haiku 4.5 | None (per-request) |
| `/api/terminal` | Legacy simulated terminal (not used in lessons anymore) | Haiku 4.5 | None |

### Supabase
- **Project:** Claude Code Mastery (`uvgxefulkovletvtgynq`)
- **Org:** `wgxrotjgtwpxodvaelgv`
- **Tables:** `quiz_cache`, `enrichment_cache`
- **RLS:** Public read/write (no auth needed for training app)
- **Auth:** Disabled in middleware until ready to ship

## Reference Docs

Primary source materials for lesson content, Boris quotes, and training methodology.

**Boris guides:**
@.claude/docs/boris-claude-code-guide.md
@.claude/docs/boris-master-guide.md

### Always loaded
@.claude/docs/official/overview.md
@.claude/docs/official/claude-md.md
@.claude/docs/official/workflows-part-1.md
@.claude/docs/official/workflows-part-2.md

### Build with Claude Code (load on demand)
# @.claude/docs/official/sub-agents-part-1.md
# @.claude/docs/official/sub-agents-part-2.md
# @.claude/docs/official/agent-teams.md
# @.claude/docs/official/skills-part-1.md
# @.claude/docs/official/skills-part-2.md
# @.claude/docs/official/hooks-part-1.md
# @.claude/docs/official/hooks-part-2.md
# @.claude/docs/official/hooks-reference-part-1.md
# @.claude/docs/official/hooks-reference-part-2.md
# @.claude/docs/official/channels.md
# @.claude/docs/official/mcp.md
# @.claude/docs/official/scheduled-tasks.md
# @.claude/docs/official/headless.md
# @.claude/docs/official/features-overview.md
# @.claude/docs/official/plugins.md
# @.claude/docs/official/plugins-reference.md
# @.claude/docs/official/discover-plugins.md

### Reference (load on demand)
# @.claude/docs/official/cli-reference.md
# @.claude/docs/official/settings.md
# @.claude/docs/official/troubleshooting.md
# @.claude/docs/official/setup.md
# @.claude/docs/official/security.md

### Deployment (load on demand)
# @.claude/docs/official/github-actions.md
# @.claude/docs/official/gitlab-ci.md
# @.claude/docs/official/third-party.md
# @.claude/docs/official/bedrock.md
# @.claude/docs/official/vertex-ai.md

### Platforms (load on demand)
# @.claude/docs/official/platforms.md
# @.claude/docs/official/vs-code.md
# @.claude/docs/official/jetbrains.md
# @.claude/docs/official/desktop.md
# @.claude/docs/official/web.md
# @.claude/docs/official/chrome.md
# @.claude/docs/official/computer-use.md
# @.claude/docs/official/remote-control.md
# @.claude/docs/official/slack.md
# @.claude/docs/official/code-review-ci.md

### Misc (load on demand)
# @.claude/docs/official/changelog.md
# @.claude/docs/official/legal.md
# @.claude/docs/official/whats-new.md
