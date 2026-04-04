---
name: Pre-existing lint issues
description: Files that had lint errors before this work started — do not confuse with new issues
type: project
---

As of April 2026, `npm run lint` reports 17 problems (13 errors, 4 warnings) in these pre-existing files:

- `capstones/page.tsx` — old duplicate capstone page with useEffect setState
- `components/capstones/page.tsx` — another duplicate with useEffect setState
- `components/AssessmentDashboard.tsx` — useEffect setState + unused vars
- `components/Certificate.tsx` — useEffect setState
- `components/InteractivePracticeSession.tsx` — useEffect setState
- `components/ModuleExam.tsx` — Date.now() in render (purity violation)
- `components/ProgressTracker.tsx` — useEffect setState
- `components/Quiz.tsx` — unused variable
- `utils/assessment.ts` — explicit any types

**Why:** These were documented in CLAUDE.md: "18 lint errors/warnings exist in capstones/, components/, utils/assessment.ts. These are pre-existing; new src/app/ files have zero issues."
**How to apply:** When linting, verify NEW files have zero issues by linting them individually. Don't count pre-existing errors as regressions.
