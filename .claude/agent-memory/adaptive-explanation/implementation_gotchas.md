---
name: Implementation gotchas
description: Non-obvious issues discovered during adaptive explanation implementation
type: project
---

## Two separate localStorage keys

The project has two progress systems with different keys:
- `claude-training-progress` → `src/lib/progress.ts` (new dashboard system, has `userLevel`)
- `claude-code-training-progress` → `utils/progress.ts` (old system, no `userLevel`)

Always use `src/lib/progress.ts` for `userLevel`.

## userLevel values are 'A'/'B'/'C', not human-readable

Must map: `{ A: 'beginner', B: 'intermediate', C: 'advanced' }` before sending to the API.

## React 19: no setState inside useEffect

The `resolveUserLevel()` helper is a plain function called inside event handlers — not in a useEffect — to avoid the React 19 lint rule against `setState` inside effects.

## Pre-existing lint errors

18 lint errors/warnings exist in `capstones/`, `components/`, `utils/assessment.ts`. These are pre-existing and NOT caused by new code. New files in `src/` must have zero issues.

## Loading state should NOT block the "Next" button

The "Next Question" button is shown as soon as `showFeedback` is true, regardless of `loadingExplanation`. This means users can advance before the adaptive explanation arrives; that's intentional UX.

## CSS animation in JSX

The pulse animation is defined inline via `<style>{`@keyframes pulse ...`}</style>` inside the feedback panel. Tailwind `animate-pulse` was not used to avoid Tailwind color class lint issues (design system rule: CSS vars only).

## `@/src/lib/progress` import path

The alias `@/` maps to the repo root, so the import is `@/src/lib/progress` (not `@/lib/progress`). Confirmed by existing usage in the codebase.
