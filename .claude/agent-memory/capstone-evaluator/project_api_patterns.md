---
name: API and agent patterns
description: How Anthropic SDK is used, route bridge pattern, and Next.js 16 response syntax
type: project
---

**Anthropic SDK pattern** (from `app/api/chat/route.ts` and `app/api/analyze/route.ts`):
```ts
import Anthropic from '@anthropic-ai/sdk';
const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;
// Always guard: if (!client) return fallback
```
Model IDs in use: `claude-haiku-4-5-20251001` (cheap), `claude-sonnet-4-6` (capstone evaluator).

**Response syntax** in Next.js 16 App Router:
- Use `Response.json(data)` — NOT `NextResponse.json(data)` in src/app routes
- Import `NextRequest` only if you need to read the request body

**Route bridge pattern:**
- New API routes live in `src/app/api/<path>/route.ts`
- One-line bridge at `app/api/<path>/route.ts`: `export { POST } from '@/src/app/api/<path>/route'`

**Agent module pattern** (see `src/agents/adaptiveExplanation.ts`):
- Agents in `src/agents/` export prompt constants and functions
- API route in `src/app/api/agents/` imports from the agent module
- Keep the system prompt and user prompt builder in the agent module, keep HTTP wiring in the route

**Why:** Consistent with existing codebase patterns; ensures routes work from both app/ and src/app/ trees.
**How to apply:** Follow this pattern for any new AI-powered endpoints.
