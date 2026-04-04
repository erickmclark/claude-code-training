# Claude Code Training Platform

Interactive hands-on training platform for mastering Claude Code techniques from Boris Cherny's methods.

## Canonical Project Location

**Use this folder only:**

```bash
/Users/erick/claude-code-training
```

Do **not** run or edit the stale duplicate under:

```bash
/Users/erick/.openclaw/workspace/ventures/claude-code-training
```

That duplicate caused server drift and agent confusion.

## Root Cause of Prior Failures

The app itself was not broken. The real issue was **project duplication + dev server drift**:

- one Claude/agent run edited one copy of the project
- localhost was serving a different copy
- stray Next.js dev servers were still running
- this made it look like the agent was failing when the wrong app was actually being served

### Symptoms

- localhost showed older or unexpected UI
- agent changes seemed to "not appear"
- inconsistent routes/features between runs
- intermittent confusion about whether Claude Code actually completed work

### Prevention Rules

1. **Single canonical folder only**
   - Always use `/Users/erick/claude-code-training`
   - Never build from both folders

2. **Single dev server only**
   - Before starting, kill any old Next.js servers for this project
   - Run only one `npm run dev` instance

3. **Verify served folder before debugging**
   - Confirm the running process points to the same folder you’re editing

4. **Build-check after agent runs**
   - Run:
     ```bash
     npm run build
     ```
   - If build passes, issue is likely process/path related, not code failure

5. **Prefer one persistent Claude session per project**
   - avoid spawning many overlapping one-shot sessions that edit different copies or assumptions

## Development

### Start clean

```bash
pkill -f '/Users/erick/claude-code-training/node_modules/.bin/next dev' || true
cd /Users/erick/claude-code-training
npm run dev
```

### Open locally

```bash
http://localhost:3000
```

### Verify production build

```bash
cd /Users/erick/claude-code-training
npm run build
```

## Current Feature Set

- interactive lesson pages
- practice sessions with guided feedback
- quizzes
- module exams
- capstone projects
- certificate flow
- dashboard and supporting pages

## Notes

- Updated for Next.js 16 by switching deprecated `middleware.ts` convention to `proxy.ts`
- If localhost looks wrong again, first check for duplicate dev servers and duplicate project folders
