---
name: API route pattern
description: How Next.js API routes are structured with src/ and app/ bridge pattern
type: project
---

## Pattern

New API routes live in `src/app/api/*/route.ts`. A one-line bridge in `app/api/*/route.ts` re-exports them:

```ts
// app/api/agents/explain/route.ts
export { POST } from '@/src/app/api/agents/explain/route';
```

## Anthropic SDK usage

```ts
import Anthropic from '@anthropic-ai/sdk';

// SDK auto-reads ANTHROPIC_API_KEY from process.env
const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 300,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: userPrompt }],
});

const text = message.content[0].type === 'text' ? message.content[0].text : fallback;
```

Note: The existing `app/api/analyze/route.ts` uses a conditional `if (process.env.ANTHROPIC_API_KEY)` guard. The new agent routes instantiate `new Anthropic()` directly and let the SDK throw if the key is missing (caught in try/catch returning 500).

## Agent logic module

Agent system prompts and user prompt builders live in `src/agents/*.ts` (e.g., `src/agents/adaptiveExplanation.ts`). They export named constants/functions imported by the route.

## Existing agent routes

- `app/api/agents/coach/` — coaching agent
- `app/api/agents/evaluate-capstone/` — capstone evaluation
- `app/api/agents/explain/` — adaptive quiz explanation (new)
