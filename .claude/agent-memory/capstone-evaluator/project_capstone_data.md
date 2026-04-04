---
name: Capstone data structure
description: CapstoneProject type shape, tier values, rubric fields, and where data lives
type: project
---

Data lives in `data/capstones.ts` (root-level, NOT src/data). Imports `CapstoneProject` from `@/types/assessment`.

**CapstoneProject fields:**
- `id`: string (e.g. 'beginner-landing', 'intermediate-dashboard', 'advanced-saas')
- `tier`: 'beginner' | 'intermediate' | 'advanced'
- `title`, `description`, `goal`: strings
- `requirements`: string[] — checklist items
- `deliverables`: string[]
- `estimatedHours`: number
- `learningOutcome`: string
- `rubric`: RubricItem[] — `{ criteria, description, points }`
- `techniques`: string[] — names of Claude Code techniques

**Why:** needed to build the submission form and pass the right fields to the evaluator.
**How to apply:** When building capstone-related UI, import from `@/data/capstones` and use `capstoneProjects` array directly.
