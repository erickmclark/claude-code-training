#!/bin/bash
# Generates VHS tape files for every lesson that doesn't have one yet.
# Each tape simulates a realistic Claude Code terminal session showing
# the key technique taught in that lesson.

TAPES_DIR="public/tapes"
mkdir -p "$TAPES_DIR"

write_tape() {
  local name="$1"
  local file="$TAPES_DIR/$name.tape"
  if [ -f "$file" ]; then return; fi  # skip if already exists
  cat > "$file"
}

# ── Lesson 1: Parallel Execution ────────────────────────────
write_tape "parallel-execution" <<'TAPE'
Output public/screenshots/parallel-execution.gif
Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[90m# Terminal 1 — Session A\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[1;36m$\033[0m claude "Build the hero section"\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Read\033[0m src/components/Hero.tsx\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Edit\033[0m src/components/Hero.tsx\n'`
Enter
Sleep 500ms
Type `printf '\n\033[90m# Terminal 2 — Session B (running simultaneously)\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[1;36m$\033[0m claude "Build the pricing section"\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Read\033[0m src/components/Pricing.tsx\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Edit\033[0m src/components/Pricing.tsx\n'`
Enter
Sleep 500ms
Type `printf '\n\033[90m# Terminal 3 — Session C (running simultaneously)\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[1;36m$\033[0m claude "Build the features grid"\n'`
Enter
Sleep 600ms
Type `printf '\033[32m✓ All 3 sessions complete.\033[0m Merge in order.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 3: CLAUDE.md Files ────────────────────────────
write_tape "claudemd-files" <<'TAPE'
Output public/screenshots/claudemd-files.gif
Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m cat CLAUDE.md\n'`
Enter
Sleep 400ms
Type `printf '\033[1m# CLAUDE.md\033[0m\n\n'`
Enter
Type `printf '\033[36m## Stack\033[0m\n'`
Enter
Type `printf 'Next.js 16 + React 19 + TypeScript + Tailwind CSS 4\n\n'`
Enter
Type `printf '\033[36m## Rules\033[0m\n'`
Enter
Type `printf '- Use ES modules (import/export), never CommonJS\n'`
Enter
Type `printf '- \033[1mNever\033[0m use enums — prefer string literal unions\n'`
Enter
Type `printf '- Run npm test before committing\n\n'`
Enter
Type `printf '\033[36m## Testing\033[0m\n'`
Enter
Type `printf '- Prefer running single tests, not the whole suite\n'`
Enter
Type `printf '- bun run test -- -t "test name"\n'`
Enter
Sleep 800ms
Type `printf '\n\033[90m● Claude reads CLAUDE.md at the start of every session\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● Rules above loaded into context automatically\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 5: Voice Dictation ────────────────────────────
write_tape "voice-dictation" <<'TAPE'
Output public/screenshots/voice-dictation.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /voice\n'`
Enter
Sleep 600ms
Type `printf '\033[33m🎙 Voice mode active\033[0m — hold spacebar to talk\n'`
Enter
Sleep 800ms
Type `printf '\n\033[90m[Recording...]\033[0m Build a React component called UserProfile\n'`
Enter
Sleep 300ms
Type `printf 'that takes a user object with name, email, and avatar URL.\n'`
Enter
Sleep 300ms
Type `printf 'Display the avatar as a circle, the name in bold, and the\n'`
Enter
Sleep 300ms
Type `printf 'email below it. Use Tailwind CSS for styling.\n'`
Enter
Sleep 600ms
Type `printf '\n\033[32m✓ Transcribed\033[0m — 42 words in 8 seconds (3x faster than typing)\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 7: /batch Parallelization ────────────────────────────
write_tape "batch-parallelization" <<'TAPE'
Output public/screenshots/batch-parallelization.gif
Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /batch migrate all 50 components from class to functional\n'`
Enter
Sleep 800ms
Type `printf '\n\033[1m📋 Batch plan\033[0m — 10 agents, 5 components each\n'`
Enter
Sleep 400ms
Type `printf '\n\033[90m● Agent 1\033[0m ▸ components/Header, Nav, Footer, Sidebar, Menu\n'`
Enter
Sleep 200ms
Type `printf '\033[90m● Agent 2\033[0m ▸ components/Card, List, Table, Grid, Modal\n'`
Enter
Sleep 200ms
Type `printf '\033[90m● Agent 3\033[0m ▸ components/Form, Input, Select, Radio, Toggle\n'`
Enter
Sleep 200ms
Type `printf '\033[90m  ...\033[0m\n'`
Enter
Sleep 200ms
Type `printf '\033[90m● Agent 10\033[0m ▸ components/Toast, Alert, Badge, Tag, Chip\n'`
Enter
Sleep 600ms
Type `printf '\n\033[33m⏳ Running...\033[0m 10 agents in parallel (worktree isolation)\n'`
Enter
Sleep 800ms
Type `printf '\033[32m✓ Agent 1 done\033[0m — 5 PRs created\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓ Agent 2 done\033[0m — 5 PRs created\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓ All 10 agents complete.\033[0m 50 PRs ready for review.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 8: Custom Agents ────────────────────────────
write_tape "custom-agents" <<'TAPE'
Output public/screenshots/custom-agents.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m cat .claude/agents/code-reviewer.md\n'`
Enter
Sleep 400ms
Type `printf '---\n'`
Enter
Type `printf 'name: code-reviewer\n'`
Enter
Type `printf 'description: Reviews code for bugs and security\n'`
Enter
Type `printf 'tools: Read, Grep, Glob\n'`
Enter
Type `printf 'model: sonnet\n'`
Enter
Type `printf '---\n\n'`
Enter
Type `printf 'You are a senior code reviewer. Focus on:\n'`
Enter
Type `printf '- Security vulnerabilities\n'`
Enter
Type `printf '- Performance issues\n'`
Enter
Type `printf '- Missing error handling\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m❯\033[0m Use the code-reviewer agent on src/auth/\n'`
Enter
Sleep 500ms
Type `printf '\033[90m● Launching subagent: \033[36mcode-reviewer\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● Agent scanning 8 files...\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\033[33m⚠ Found:\033[0m Missing input validation in login.ts:42\n'`
Enter
Sleep 300ms
Type `printf '\033[33m⚠ Found:\033[0m SQL injection risk in query.ts:18\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 11: Mobile Control ────────────────────────────
write_tape "mobile-control" <<'TAPE'
Output public/screenshots/mobile-control.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /remote-control\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1mRemote Control\033[0m\n'`
Enter
Sleep 300ms
Type `printf 'Session URL: \033[36mhttps://claude.ai/code/session/abc123\033[0m\n'`
Enter
Sleep 300ms
Type `printf 'QR code: \033[90m[scan with Claude mobile app]\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\n\033[32m● Connected\033[0m — controlling from your phone\n'`
Enter
Sleep 400ms
Type `printf '\033[90m↳ Phone message:\033[0m "Fix the login button styling"\n'`
Enter
Sleep 500ms
Type `printf '\n\033[33m● Edit\033[0m src/components/LoginButton.tsx\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓ Done\033[0m — change pushed, visible on phone\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 12: Advanced Mastery ────────────────────────────
write_tape "advanced-mastery" <<'TAPE'
Output public/screenshots/advanced-mastery.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m Knowing everything you know now, scrap this and\n'`
Enter
Type `printf '  implement the elegant solution.\n'`
Enter
Sleep 800ms
Type `printf '\n\033[90m● Read\033[0m 12 files across src/auth/, src/api/, src/middleware/\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● Planning\033[0m redesign based on full codebase understanding...\n'`
Enter
Sleep 600ms
Type `printf '\033[33m● Edit\033[0m 8 files — clean architecture, single responsibility\n'`
Enter
Sleep 400ms
Type `printf '\033[33m● Bash\033[0m npm test → \033[32m✓ 67 tests passed\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Bash\033[0m npm run lint → \033[32m✓ 0 errors\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;32m✓\033[0m Elegant solution: 40%% fewer lines, same test coverage.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 13: CLAUDE.local.md ────────────────────────────
write_tape "claude-local-md" <<'TAPE'
Output public/screenshots/claude-local-md.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m cat CLAUDE.local.md\n'`
Enter
Sleep 400ms
Type `printf '\033[1m# Personal preferences (gitignored)\033[0m\n\n'`
Enter
Type `printf '- My sandbox URL: http://localhost:3003\n'`
Enter
Type `printf '- Preferred test data: user@test.com / password123\n'`
Enter
Type `printf '- I like verbose commit messages\n'`
Enter
Type `printf '- Skip the UI walkthrough, just write code\n'`
Enter
Sleep 600ms
Type `printf '\n\033[90m$ git status\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[31mUntracked:\033[0m  CLAUDE.local.md\n'`
Enter
Sleep 200ms
Type `printf '\n\033[90m$ cat .gitignore | grep local\033[0m\n'`
Enter
Sleep 200ms
Type `printf 'CLAUDE.local.md  \033[90m← personal, never committed\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 14: Checkpointing & /rewind ────────────────────────────
write_tape "rewind" <<'TAPE'
Output public/screenshots/rewind.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m Fix the auth middleware\n'`
Enter
Sleep 500ms
Type `printf '\033[33m● Edit\033[0m src/middleware.ts — attempt 1\n'`
Enter
Sleep 400ms
Type `printf '\033[31m✗ Tests failed\033[0m — broke session handling\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Edit\033[0m src/middleware.ts — attempt 2\n'`
Enter
Sleep 400ms
Type `printf '\033[31m✗ Tests failed\033[0m — different error this time\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;33m⚠ Two failed attempts.\033[0m Time to rewind.\n'`
Enter
Sleep 600ms
Type `printf '\n\033[90m[Esc][Esc] — opening rewind menu...\033[0m\n'`
Enter
Sleep 400ms
Type `printf '  \033[36m→ Checkpoint 1:\033[0m Before any edits (2 min ago)\n'`
Enter
Type `printf '    Checkpoint 2: After first edit (1 min ago)\n'`
Enter
Sleep 400ms
Type `printf '\n\033[32m✓ Rewound to Checkpoint 1\033[0m — clean state restored\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  Conversation history preserved. Re-plan with better context.\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 15: Ultraplan ────────────────────────────
write_tape "ultraplan" <<'TAPE'
Output public/screenshots/ultraplan.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /ultraplan migrate auth service to JWTs\n'`
Enter
Sleep 800ms
Type `printf '\n\033[90m◇ ultraplan\033[0m Researching codebase...\n'`
Enter
Sleep 600ms
Type `printf '\033[90m◇ ultraplan\033[0m Analyzing 23 files in src/auth/\n'`
Enter
Sleep 500ms
Type `printf '\033[90m◇ ultraplan\033[0m Drafting migration plan...\n'`
Enter
Sleep 800ms
Type `printf '\n\033[1;32m◆ ultraplan ready\033[0m\n'`
Enter
Sleep 300ms
Type `printf '  Open in browser: \033[36mhttps://claude.ai/code/plan/abc123\033[0m\n'`
Enter
Sleep 300ms
Type `printf '  Review, comment inline, then approve to execute.\n'`
Enter
Sleep 300ms
Type `printf '\n\033[90m  Your terminal is free while the plan drafts in the cloud.\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 16: Channels ────────────────────────────
write_tape "channels" <<'TAPE'
Output public/screenshots/channels.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m claude --channels plugin:telegram@claude-plugins-official\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Telegram channel connected\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\n\033[33m◀ Channel:\033[0m github-actions\n'`
Enter
Sleep 200ms
Type `printf '\033[33m  Event:\033[0m test_failed\n'`
Enter
Sleep 200ms
Type `printf '\033[33m  Payload:\033[0m {run_id: 4521, branch: "feat/auth"}\n'`
Enter
Sleep 500ms
Type `printf '\n\033[90m● Claude investigating CI failure...\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● Read\033[0m .github/workflows/test.yml\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● Read\033[0m src/auth/session.test.ts\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Edit\033[0m src/auth/session.ts — fixed race condition\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓\033[0m Fix pushed. CI re-running.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 17: Agent Teams ────────────────────────────
write_tape "agent-teams" <<'TAPE'
Output public/screenshots/agent-teams.gif
Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m Create a team: security reviewer, perf tester, and\n'`
Enter
Type `printf '  test coverage analyst. Review PR #142.\n'`
Enter
Sleep 800ms
Type `printf '\n\033[1m👥 Team created\033[0m — 3 teammates\n'`
Enter
Sleep 300ms
Type `printf '  \033[36m● security-reviewer\033[0m  scanning for vulnerabilities...\n'`
Enter
Sleep 200ms
Type `printf '  \033[33m● perf-tester\033[0m        profiling hot paths...\n'`
Enter
Sleep 200ms
Type `printf '  \033[35m● coverage-analyst\033[0m   checking test gaps...\n'`
Enter
Sleep 800ms
Type `printf '\n\033[36m● security-reviewer:\033[0m Found XSS risk in UserInput.tsx:34\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● perf-tester:\033[0m N+1 query in getUsers() — suggest batching\n'`
Enter
Sleep 300ms
Type `printf '\033[35m● coverage-analyst:\033[0m auth/login.ts has 0%% coverage\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;32m✓ Review complete.\033[0m 3 findings from 3 perspectives.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 18: Computer Use ────────────────────────────
write_tape "computer-use" <<'TAPE'
Output public/screenshots/computer-use.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m Build the app and verify the dashboard matches the mockup\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Bash\033[0m npm run build && npm start\n'`
Enter
Sleep 500ms
Type `printf '\033[90m● computer-use\033[0m Opening http://localhost:3000/dashboard\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● computer-use\033[0m Taking screenshot...\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● computer-use\033[0m Comparing to mockup at ./design.png\n'`
Enter
Sleep 500ms
Type `printf '\n\033[33m⚠ Differences found:\033[0m\n'`
Enter
Type `printf '  - Sidebar width: 240px (mockup says 280px)\n'`
Enter
Type `printf '  - Header font: 16px (mockup says 18px)\n'`
Enter
Sleep 400ms
Type `printf '\033[33m● Edit\033[0m src/components/Layout.tsx — fixing sidebar + header\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● computer-use\033[0m Re-checking... \033[32m✓ Matches mockup\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 19: MCP Integrations ────────────────────────────
write_tape "mcp-integrations" <<'TAPE'
Output public/screenshots/mcp-integrations.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m cat .mcp.json\n'`
Enter
Sleep 400ms
Type `printf '{\n'`
Enter
Type `printf '  \033[36m"mcpServers"\033[0m: {\n'`
Enter
Type `printf '    \033[36m"github"\033[0m: { \033[36m"command"\033[0m: \033[33m"mcp-github"\033[0m },\n'`
Enter
Type `printf '    \033[36m"sentry"\033[0m: { \033[36m"command"\033[0m: \033[33m"mcp-sentry"\033[0m },\n'`
Enter
Type `printf '    \033[36m"slack"\033[0m:  { \033[36m"type"\033[0m: \033[33m"http"\033[0m, \033[36m"url"\033[0m: \033[33m"https://slack.mcp..."\033[0m }\n'`
Enter
Type `printf '  }\n'`
Enter
Type `printf '}\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m❯\033[0m Check the latest Sentry errors and fix the top one\n'`
Enter
Sleep 500ms
Type `printf '\033[90m● mcp__sentry\033[0m Fetching recent errors...\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● mcp__github\033[0m Reading PR #89 for context...\n'`
Enter
Sleep 400ms
Type `printf '\033[33m● Edit\033[0m src/api/handler.ts — fixed null pointer\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓\033[0m Error fixed, Sentry issue resolved.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 20: Cost Management ────────────────────────────
write_tape "cost-management" <<'TAPE'
Output public/screenshots/cost-management.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /model\n'`
Enter
Sleep 400ms
Type `printf '\n\033[1mSelect model:\033[0m\n'`
Enter
Type `printf '  \033[36m● Opus\033[0m    — Best reasoning, highest cost\n'`
Enter
Type `printf '  \033[32m● Sonnet\033[0m  — Good balance of speed and quality \033[33m← current\033[0m\n'`
Enter
Type `printf '  \033[90m● Haiku\033[0m   — Fastest, cheapest, routine work\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m❯\033[0m /model haiku\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓\033[0m Switched to Haiku — for writing tests\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;36m❯\033[0m /cost\n'`
Enter
Sleep 300ms
Type `printf '\n\033[1mSession cost:\033[0m $0.12\n'`
Enter
Type `printf '  Input:  42,301 tokens\n'`
Enter
Type `printf '  Output: 8,420 tokens\n'`
Enter
Type `printf '  Cache:  \033[32m67%% hit rate\033[0m (saved ~$0.08)\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 21: Extended Thinking ────────────────────────────
write_tape "extended-thinking" <<'TAPE'
Output public/screenshots/extended-thinking.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /effort max\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓\033[0m Effort level set to \033[1mmax\033[0m (deep reasoning)\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;36m❯\033[0m Design a caching strategy for our API that handles\n'`
Enter
Type `printf '  1M requests/day with <100ms p99 latency\n'`
Enter
Sleep 800ms
Type `printf '\n\033[90m⟳ Thinking...\033[0m (extended reasoning active)\n'`
Enter
Sleep 800ms
Type `printf '\033[90m  Analyzing cache invalidation patterns...\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\033[90m  Evaluating Redis vs Memcached tradeoffs...\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\033[90m  Considering write-through vs write-behind...\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1m📋 Recommendation:\033[0m Multi-layer cache\n'`
Enter
Type `printf '  L1: In-process LRU (1ms) → L2: Redis cluster (5ms) → L3: DB\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 22: Context Management ────────────────────────────
write_tape "context-management" <<'TAPE'
Output public/screenshots/context-management.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /compact Focus on the API changes we discussed\n'`
Enter
Sleep 600ms
Type `printf '\n\033[90m⟳ Compacting conversation...\033[0m\n'`
Enter
Sleep 400ms
Type `printf '  Before: \033[31m156,200 tokens (82%% of context)\033[0m\n'`
Enter
Sleep 300ms
Type `printf '  After:  \033[32m42,100 tokens (22%% of context)\033[0m\n'`
Enter
Sleep 300ms
Type `printf '  Saved:  114,100 tokens\n'`
Enter
Sleep 400ms
Type `printf '\n\033[32m✓ Compacted.\033[0m API changes, file paths, and key decisions preserved.\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  CLAUDE.md re-injected automatically.\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 23: Session Management ────────────────────────────
write_tape "session-management" <<'TAPE'
Output public/screenshots/session-management.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m claude --resume\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1mRecent sessions:\033[0m\n'`
Enter
Type `printf '  \033[36m→ auth-refactor\033[0m        (2 hours ago, 34 messages)\n'`
Enter
Type `printf '    api-migration       (yesterday, 12 messages)\n'`
Enter
Type `printf '    dashboard-fixes     (2 days ago, 8 messages)\n'`
Enter
Sleep 600ms
Type `printf '\n\033[32m✓ Resumed:\033[0m auth-refactor\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  Full conversation history restored.\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  Last message: "I fixed the token refresh logic..."\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;36m❯\033[0m Great, now add tests for the token refresh\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 24: Skills System ────────────────────────────
write_tape "skills-system" <<'TAPE'
Output public/screenshots/skills-system.gif
Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m cat .claude/skills/review-pr/SKILL.md\n'`
Enter
Sleep 400ms
Type `printf '---\n'`
Enter
Type `printf 'name: review-pr\n'`
Enter
Type `printf 'description: Review a PR for bugs, security, and style\n'`
Enter
Type `printf 'disable-model-invocation: true\n'`
Enter
Type `printf '---\n\n'`
Enter
Type `printf 'Review PR $ARGUMENTS:\n'`
Enter
Type `printf '1. Check for security vulnerabilities\n'`
Enter
Type `printf '2. Verify test coverage\n'`
Enter
Type `printf '3. Check coding standards\n'`
Enter
Type `printf '4. Create review comments\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m❯\033[0m /review-pr 142\n'`
Enter
Sleep 500ms
Type `printf '\033[90m● Fetching PR #142 diff...\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● Scanning 12 changed files...\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓ Review complete.\033[0m 2 issues found, comments posted.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 25: IDE Integration ────────────────────────────
write_tape "ide-integration" <<'TAPE'
Output public/screenshots/ide-integration.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[90m# VS Code: Cmd+Shift+P → "Claude Code"\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[90m# Or click the ✱ Spark icon in the Editor Toolbar\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m❯\033[0m Explain the logic in @src/auth/session.ts\n'`
Enter
Sleep 500ms
Type `printf '\033[90m● Read\033[0m src/auth/session.ts (from @-mention)\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● mcp__ide__getDiagnostics\033[0m 0 errors, 2 warnings\n'`
Enter
Sleep 500ms
Type `printf '\nThis file manages JWT session tokens. Key flow:\n'`
Enter
Type `printf '1. createSession() signs a JWT with user ID + expiry\n'`
Enter
Type `printf '2. validateSession() verifies the signature + checks expiry\n'`
Enter
Type `printf '3. refreshSession() issues a new token before the old expires\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 26: Headless Mode ────────────────────────────
write_tape "headless-mode" <<'TAPE'
Output public/screenshots/headless-mode.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m claude -p "List all API endpoints" --output-format json \\\\\n'`
Enter
Type `printf '    --allowedTools "Read,Grep" --bare\n'`
Enter
Sleep 800ms
Type `printf '{\n'`
Enter
Type `printf '  \033[36m"result"\033[0m: "Found 12 API endpoints:\\n...",\n'`
Enter
Type `printf '  \033[36m"session_id"\033[0m: "sess_a8f2c...",\n'`
Enter
Type `printf '  \033[36m"cost"\033[0m: { "input_tokens": 8420, "output_tokens": 1203 }\n'`
Enter
Type `printf '}\n'`
Enter
Sleep 600ms
Type `printf '\n\033[90m# Use in CI/CD pipelines:\033[0m\n'`
Enter
Type `printf '\033[1;36m$\033[0m claude -p "Fix all lint errors" \\\\\n'`
Enter
Type `printf '    --allowedTools "Edit,Bash(npm run lint*)" \\\\\n'`
Enter
Type `printf '    --permission-mode auto\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 27: Chrome Extension ────────────────────────────
write_tape "chrome-extension" <<'TAPE'
Output public/screenshots/chrome-extension.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m @browser go to localhost:3000 and check for console errors\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● browser\033[0m Opening new tab: http://localhost:3000\n'`
Enter
Sleep 400ms
Type `printf '\033[90m● browser\033[0m Page loaded (1.2s)\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● browser\033[0m Reading console messages...\n'`
Enter
Sleep 400ms
Type `printf '\n\033[33m⚠ Console errors found:\033[0m\n'`
Enter
Type `printf '  \033[31mTypeError:\033[0m Cannot read property "name" of undefined (Dashboard.tsx:42)\n'`
Enter
Type `printf '  \033[31m404:\033[0m /api/users returned Not Found\n'`
Enter
Sleep 500ms
Type `printf '\n\033[33m● Edit\033[0m src/components/Dashboard.tsx — added null check\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● browser\033[0m Refreshing... \033[32m✓ No console errors\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 28: CI/CD ────────────────────────────
write_tape "cicd" <<'TAPE'
Output public/screenshots/cicd.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 30ms
Set Padding 16

Type `printf '\033[90m# .github/workflows/claude.yml\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[1;36m$\033[0m cat .github/workflows/claude.yml\n'`
Enter
Sleep 400ms
Type `printf 'name: Claude Code\n'`
Enter
Type `printf 'on:\n  issue_comment: [created]\n'`
Enter
Type `printf 'jobs:\n  claude:\n    runs-on: ubuntu-latest\n'`
Enter
Type `printf '    steps:\n'`
Enter
Type `printf '      - uses: anthropics/claude-code-action@v1\n'`
Enter
Type `printf '        with:\n'`
Enter
Type `printf '          anthropic_api_key: \033[33m${{ secrets.ANTHROPIC_API_KEY }}\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\n\033[90m# In a PR comment:\033[0m\n'`
Enter
Type `printf '\033[36m@claude\033[0m fix the failing tests and update the types\n'`
Enter
Sleep 500ms
Type `printf '\n\033[32m✓\033[0m Claude Code Action triggered → fixes pushed to PR\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 29: Plugins ────────────────────────────
write_tape "plugins" <<'TAPE'
Output public/screenshots/plugins.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /plugin install typescript-lsp@claude-plugins-official\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Downloading plugin...\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓ Installed:\033[0m typescript-lsp (code intelligence for TypeScript)\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  LSP server: typescript-language-server\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\n\033[1;36m❯\033[0m /reload-plugins\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓\033[0m Reloaded: 3 plugins, 5 skills, 2 agents, 1 LSP server\n'`
Enter
Sleep 500ms
Type `printf '\n\033[90m● LSP diagnostics:\033[0m After each edit, type errors appear instantly\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● Go to definition, find references, hover info — all available\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 30: Slack & Scheduling ────────────────────────────
write_tape "slack-scheduling" <<'TAPE'
Output public/screenshots/slack-scheduling.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[90m# In Slack: @Claude fix the auth bug from issue #234\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\033[90m● Claude Code session created on the web\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[90m● Cloning repo, reading issue, implementing fix...\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\033[32m✓\033[0m PR #89 created from Slack → ready for review\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m❯\033[0m /loop 5m check if the deploy finished\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓\033[0m Scheduled: checking every 5 minutes\n'`
Enter
Sleep 500ms
Type `printf '\n\033[90m[5 min later]\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Checking deploy status...\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓ Deploy complete.\033[0m All health checks passing.\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 31: Claude Code on the Web ────────────────────────────
write_tape "web-sessions" <<'TAPE'
Output public/screenshots/web-sessions.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m$\033[0m claude --remote "Fix the flaky test in auth.spec.ts"\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Creating web session...\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓\033[0m Session started on Anthropic cloud\n'`
Enter
Sleep 200ms
Type `printf '  URL: \033[36mhttps://claude.ai/code/session/xyz789\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\n\033[90m  Working autonomously in the cloud...\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  (your laptop can sleep — the session keeps running)\033[0m\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m$\033[0m claude --teleport\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓ Teleported:\033[0m web session pulled into your terminal\n'`
Enter
Sleep 300ms
Type `printf '\033[90m  Branch checked out, conversation history loaded.\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 32: Desktop App ────────────────────────────
write_tape "desktop-app" <<'TAPE'
Output public/screenshots/desktop-app.gif
Set FontSize 13
Set Width 900
Set Height 450
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[90m# Claude Code Desktop — the Code tab\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\033[90m# Select Local → choose project folder → pick model\033[0m\n'`
Enter
Sleep 500ms
Type `printf '\n\033[1;36m❯\033[0m Add a dark mode toggle to the settings page\n'`
Enter
Sleep 600ms
Type `printf '\033[90m● Reading project structure...\033[0m\n'`
Enter
Sleep 300ms
Type `printf '\033[33m● Edit\033[0m src/components/Settings.tsx\n'`
Enter
Sleep 300ms
Type `printf '\n\033[90m📊 Diff view:\033[0m +12 lines, -1 line\n'`
Enter
Type `printf '  \033[32m+ const [darkMode, setDarkMode] = useState(false)\033[0m\n'`
Enter
Type `printf '  \033[32m+ <Toggle checked={darkMode} onChange={setDarkMode} />\033[0m\n'`
Enter
Sleep 400ms
Type `printf '\n\033[90m🖥 Preview:\033[0m localhost:3000/settings — dark mode toggle visible\n'`
Enter
Sleep 300ms
Type `printf '\033[32m✓\033[0m Accept changes? [y/n]\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 33: Permission Modes ────────────────────────────
write_tape "permission-modes" <<'TAPE'
Output public/screenshots/permission-modes.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[90m# Permission modes — Shift+Tab to cycle:\033[0m\n'`
Enter
Sleep 300ms
Type `printf '  \033[1mNormal\033[0m     → Ask before each action\n'`
Enter
Type `printf '  \033[33mAuto-accept\033[0m → Accept edits, ask for commands\n'`
Enter
Type `printf '  \033[36mPlan\033[0m       → Read-only exploration\n'`
Enter
Type `printf '  \033[32mAuto\033[0m       → Classifier handles approvals\n'`
Enter
Sleep 600ms
Type `printf '\n\033[1;36m$\033[0m claude --permission-mode auto\n'`
Enter
Sleep 400ms
Type `printf '\033[32m✓ Auto mode active\033[0m\n'`
Enter
Sleep 300ms
Type `printf '  \033[32m✓ Approved:\033[0m npm test (safe — read-only)\n'`
Enter
Sleep 200ms
Type `printf '  \033[32m✓ Approved:\033[0m edit src/auth.ts (standard edit)\n'`
Enter
Sleep 200ms
Type `printf '  \033[31m✗ Blocked:\033[0m rm -rf /tmp/build (destructive)\n'`
Enter
Sleep 200ms
Type `printf '  \033[31m✗ Blocked:\033[0m git push --force (risky)\n'`
Enter
Sleep 2s
TAPE

# ── Module 7 lessons (37-40) ────────────────────────────
# Already have: plan-mode, worktrees, verification-loop, slash-commands, rewind

# Lesson 37: Planning a Real Feature — reuse plan-mode.gif (same topic)
# Lesson 38: Building in Parallel — reuse worktrees.gif
# Lesson 39: Verifying and Shipping — reuse verification-loop.gif
# Lesson 40: When Things Go Wrong — reuse rewind.gif

# ── Lesson 41: The Four Agent Patterns ────────────────────────────
write_tape "agent-patterns" <<'TAPE'
Output public/screenshots/agent-patterns.gif
Set FontSize 13
Set Width 900
Set Height 550
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1mThe Four Agent Patterns:\033[0m\n\n'`
Enter
Sleep 300ms
Type `printf '  \033[36m1. Subagent\033[0m      — Fire-and-forget worker\n'`
Enter
Sleep 200ms
Type `printf '     "Use a subagent to research the auth module"\n'`
Enter
Sleep 300ms
Type `printf '  \033[33m2. Agent Team\033[0m    — Coordinated specialists\n'`
Enter
Sleep 200ms
Type `printf '     "Create a team: security + perf + tests"\n'`
Enter
Sleep 300ms
Type `printf '  \033[32m3. /batch\033[0m        — Parallel independent tasks\n'`
Enter
Sleep 200ms
Type `printf '     "Migrate 50 components, 10 agents in parallel"\n'`
Enter
Sleep 300ms
Type `printf '  \033[35m4. Orchestrator\033[0m  — Main agent delegates dynamically\n'`
Enter
Sleep 200ms
Type `printf '     "Build the feature, spawn helpers as needed"\n'`
Enter
Sleep 800ms
Type `printf '\n\033[90mChoose based on: independence, communication, coordination needs\033[0m\n'`
Enter
Sleep 2s
TAPE

# ── Lesson 43: Prompt Caching ────────────────────────────
write_tape "prompt-caching" <<'TAPE'
Output public/screenshots/prompt-caching.gif
Set FontSize 13
Set Width 900
Set Height 500
Set Theme "Molokai"
Set TypingSpeed 35ms
Set Padding 16

Type `printf '\033[1;36m❯\033[0m /cost\n'`
Enter
Sleep 400ms
Type `printf '\n\033[1mSession cost breakdown:\033[0m\n'`
Enter
Type `printf '  Total:        $0.14\n'`
Enter
Type `printf '  Input tokens:  52,300\n'`
Enter
Type `printf '  Output tokens: 4,200\n'`
Enter
Sleep 300ms
Type `printf '  Cache hits:    \033[32m73%%\033[0m (38,179 tokens served from cache)\n'`
Enter
Type `printf '  Cache misses:  14,121 tokens\n'`
Enter
Type `printf '  \033[32mSaved: ~$0.11\033[0m vs no caching\n'`
Enter
Sleep 600ms
Type `printf '\n\033[90mTips to maximize cache hits:\033[0m\n'`
Enter
Type `printf '  • Keep CLAUDE.md stable (it caches across turns)\n'`
Enter
Type `printf '  • Use --continue to reuse the prior conversation\n'`
Enter
Type `printf '  • Avoid /clear unless context is truly polluted\n'`
Enter
Sleep 2s
TAPE

echo "✓ All tape files generated."
