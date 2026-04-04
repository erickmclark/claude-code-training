---
name: userLevel storage
description: How userLevel is stored and retrieved in src/lib/progress.ts
type: project
---

## Storage key

`claude-training-progress` in localStorage (note: different from the older `claude-code-training-progress` key used by utils/progress.ts).

## Type

`UserProgress.userLevel: 'A' | 'B' | 'C' | null`

- `A` = beginner
- `B` = intermediate
- `C` = advanced
- `null` = not yet set (default to 'beginner' in adaptive logic)

## Retrieval

```ts
import { getProgress } from '@/src/lib/progress';
const progress = getProgress();
const level = progress.userLevel; // 'A' | 'B' | 'C' | null
```

`getProgress()` is SSR-safe: returns a default object when `typeof window === 'undefined'`.

## Setting

```ts
import { saveUserLevel } from '@/src/lib/progress';
saveUserLevel('A'); // or 'B' or 'C'
```

## Mapping for adaptive explanations

```ts
const LEVEL_MAP = { A: 'beginner', B: 'intermediate', C: 'advanced' };
const userLevel = progress.userLevel ? (LEVEL_MAP[progress.userLevel] ?? 'beginner') : 'beginner';
```
