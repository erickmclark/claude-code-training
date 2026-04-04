---
name: Progress Coach feature implementation
description: Files created and wiring done for the Progress Coach AI feedback feature
type: project
---

Progress Coach delivers personalized AI coaching after a student completes a lesson exercise. Implemented 2026-04-04.

**Files created:**
- `src/agents/progressCoach.ts` — SYSTEM_PROMPT, CoachInput/CoachResponse types, buildUserPrompt()
- `src/app/api/agents/coach/route.ts` — Next.js App Router POST handler using claude-haiku-4-5-20251001, max_tokens: 300, strips markdown fences before JSON.parse
- `app/api/agents/coach/route.ts` — One-line bridge: `export { POST } from '@/src/app/api/agents/coach/route'`
- `src/components/lesson/LessonComplete.tsx` — Client component, fetches /api/agents/coach on mount, shows loading spinner → insight/strength/focus_for_next card with coral accent strip

**Wiring in LessonPage.tsx:**
- Added `exerciseDone` state (useState(false))
- `handleExerciseComplete` sets `exerciseDone = true` after calling `markLessonComplete`
- `<LessonComplete>` renders below `<PracticeExercise>` when `exerciseDone && activeSection === 'exercise'`
- `exerciseDescription` is passed as `lesson.exercise.title`

**Design:**
- White card, 4px coral top strip, no Tailwind color classes, all via CSS vars
- Loading: spinner with `@keyframes spin` injected via `<style>` tag
- Error: graceful fallback message, never throws to the user
- Fallback JSON returned by API when no ANTHROPIC_API_KEY is set (no 500)

**Why:** build must pass — confirmed with `npm run build` (zero new errors). Zero new lint issues in new files (18 pre-existing issues in capstones/, components/, utils/assessment.ts are unchanged).
