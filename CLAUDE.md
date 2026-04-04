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

B2C learning platform for Claude Code mastery. Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript strict mode. 20 lessons across 4 modules with situational quizzes, interactive practice exercises, and gamification (XP, streaks, badges).

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

- `data/lessons.ts` — **20 lessons** with steps, code examples, Boris tips, and **8 situational quiz questions per lesson** (161 total). Exports `lessons`, `lessonSummaries`.
- `data/practiceExercises.ts` — **30+ interactive exercises** indexed by lesson ID (challenge, hints, solution, success message).
- `data/modules.ts` — 4 modules with lesson mappings, unlock logic via `isModuleUnlocked(moduleId, completedLessonIds[])`.
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

- `src/components/lesson/LessonPage.tsx` — Two-column lesson layout
- `src/components/lesson/LessonSidebar.tsx` — Step list (done/active/locked states)
- `src/components/lesson/StepContent.tsx` — Step renderer with code blocks, tip blocks
- `src/components/quiz/BeginnerQuiz.tsx` — A/B/C/D scenario quiz with feedback
- `src/components/lesson/PracticeExercise.tsx` — Checklist with coral checkboxes

## Key Patterns

**Design token styling** — All new UI uses inline styles with CSS vars:
```tsx
<h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>Title</h2>
<button style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)' }}>Action</button>
```

**Situational quiz questions** — All 161 questions present real work scenarios. Never "What is X?" — always "You're in situation Y, what do you do?" 8 questions per lesson.

**Practice exercises** — Wired from `data/practiceExercises.ts`. Shows challenge cards with collapsible hints (`<details>`) and solutions. Falls back to `lesson.exercise` for lessons without practiceExercises.

**Module unlock** — `isModuleUnlocked(moduleId, completedLessonIds[])`. Module 1 always unlocked. Others require ALL previous module lessons completed.

**Module difficulty** — Hardcoded map (not in data): `{ 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Advanced' }`. No 'Expert' level exists.

**Lesson routing** — All lesson links use singular `/lesson/[lessonId]`, not plural `/lessons/[id]`. The singular route wraps the same `LessonPage` component.

**Completed lesson IDs** — Derived consistently across pages:
```ts
const completedLessonIds: number[] = Object.entries(progress.lessons)
  .filter(([, v]) => v.status === 'complete')
  .map(([k]) => parseInt(k, 10));
```

**Pre-existing lint issues** — 18 lint errors/warnings exist in `capstones/`, `components/`, `utils/assessment.ts`. These are pre-existing; new `src/app/` files have zero issues.

**Next.js 16 params** — `const { id } = use(params)` in client components, `await params` in server components.

**React 19 setState** — No `setState` in `useEffect`. Use `useState(() => ...)` lazy initializer.

**Hydration safety** — Client-only components use `useState(() => { if (typeof window === 'undefined') return default; ... })`.

## Content Guidelines

- Source: **official Claude Code docs** (`.claude/docs/official/`) + **Boris Cherny's tips** (`.claude/docs/`)
- Quiz questions must be **situational** — present a scenario, ask what to do. Never recall.
- Each lesson: **8 quiz questions**, **3 practice exercises**
- Teaching content: **exact commands, full file contents, copy-pasteable code**
- Boris quotes: `"Quote text." — Boris Cherny`

## Style

Cream background (#faf8f5), coral accent (#cc5c38), Lora serif headings, DM Sans body. White cards with subtle borders. No dark theme. No blue/purple. All coral.

## About This App

This is a **beginner-focused Claude Code training app**. Target audience: developers new to Claude Code wanting a structured, hands-on learning path from installation through advanced multi-agent workflows. Approachable, step-by-step, assumes no prior experience.

## Reference Docs

Primary source materials for lesson content, Boris quotes, and training methodology.

**Boris guides:**
@.claude/docs/boris-claude-code-guide.md
@.claude/docs/boris-master-guide.md

**Official Claude Code docs** (split into topic files under `.claude/docs/official/`):
@.claude/docs/official/overview.md
@.claude/docs/official/cli-reference.md
@.claude/docs/official/claude-md.md
@.claude/docs/official/hooks-part-1.md
@.claude/docs/official/hooks-part-2.md
@.claude/docs/official/skills-part-1.md
@.claude/docs/official/skills-part-2.md
@.claude/docs/official/sub-agents-part-1.md
@.claude/docs/official/sub-agents-part-2.md
@.claude/docs/official/mcp.md
@.claude/docs/official/settings.md
@.claude/docs/official/workflows-part-1.md
@.claude/docs/official/workflows-part-2.md
