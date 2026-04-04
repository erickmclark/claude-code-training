---
name: BeginnerQuiz shape
description: Props, state fields, and key behavior patterns in src/components/quiz/BeginnerQuiz.tsx
type: project
---

## Props

```ts
interface BeginnerQuizProps {
  questions: QuizQuestion[];   // from @/types/lesson
  onComplete: (score: number) => void;
}
```

## State

| Field | Type | Purpose |
|---|---|---|
| `currentIndex` | `number` | Current question index (0-based) |
| `selectedAnswer` | `number \| null` | Index of chosen option, null if none |
| `showFeedback` | `boolean` | Whether to show correct/wrong feedback |
| `correctCount` | `number` | Running count of correct answers |
| `finished` | `boolean` | Whether all questions are done |
| `loadingExplanation` | `boolean` | True while fetching adaptive explanation from API |
| `adaptedExplanation` | `string \| null` | AI-tailored explanation; null = use static fallback |

## Key behaviors

- `handleSelect(index)`: sets answer, shows feedback, and (on wrong answer) fires `/api/agents/explain` fetch
- `handleNext()`: advances question index, resets `selectedAnswer`, `showFeedback`, `adaptedExplanation`
- `handleRetry()`: resets everything including `adaptedExplanation`
- Feedback panel shows loading pulse if `loadingExplanation`, then `adaptedExplanation ?? question.explanation`
- `resolveUserLevel()`: reads `getProgress().userLevel` ('A'|'B'|'C'|null) and maps to 'beginner'|'intermediate'|'advanced'

## QuizQuestion type (from @/types/lesson)

```ts
{
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
```
