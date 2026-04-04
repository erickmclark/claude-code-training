export interface RoadmapWeek {
  week: number;
  title: string;
  description: string;
  deliverable: string;
  days: RoadmapDay[];
}

export interface RoadmapDay {
  id: string;
  day: string;
  task: string;
  detail: string;
}

export const roadmap: RoadmapWeek[] = [
  {
    week: 1,
    title: 'Fundamentals',
    description: 'Learn the three core skills that compound into 10x productivity.',
    deliverable: 'A small project built with Plan Mode + CLAUDE.md',
    days: [
      { id: 'w1d1', day: 'Day 1-2', task: 'Read the guide, understand Plan Mode', detail: 'Enter Plan Mode (Shift+Tab twice). Practice iterating on plans before building.' },
      { id: 'w1d3', day: 'Day 3-4', task: 'Try Plan Mode on a real project', detail: 'Plan a feature, iterate 2-3 times, then let Claude 1-shot the implementation.' },
      { id: 'w1d5', day: 'Day 5-6', task: 'Create your first CLAUDE.md', detail: 'Run /init. Add 5 project-specific rules. End every correction with "Update your CLAUDE.md."' },
      { id: 'w1d7', day: 'Day 7', task: 'Build something with Plan Mode + CLAUDE.md', detail: 'Combine both skills. Plan first, build second, update CLAUDE.md with learnings.' },
    ],
  },
  {
    week: 2,
    title: 'Speed',
    description: 'Multiply throughput with parallel execution and git worktrees.',
    deliverable: 'A feature built 3x faster with parallel work',
    days: [
      { id: 'w2d1', day: 'Day 8-9', task: 'Set up git worktrees, run 2 Claudes', detail: 'git worktree add .claude/wt1 origin/main. Start Claude in each.' },
      { id: 'w2d3', day: 'Day 10-11', task: 'Run 5 Claudes in parallel', detail: '5 worktrees, 5 terminal tabs. Number them. Use /color to distinguish.' },
      { id: 'w2d5', day: 'Day 12-13', task: 'Learn git merge ordering', detail: 'Merge in dependency order: foundation → API → UI → tests.' },
      { id: 'w2d7', day: 'Day 14', task: 'Build a full feature with 5 parallel Claudes', detail: 'Split a real feature into 5 parts. Build all in parallel. Merge and ship.' },
    ],
  },
  {
    week: 3,
    title: 'Quality',
    description: 'Add verification, agents, and automation for production-grade output.',
    deliverable: 'A production-ready feature with full verification pipeline',
    days: [
      { id: 'w3d1', day: 'Day 15-16', task: 'Set up verification loops', detail: 'Add "run tests and fix failures" to every prompt. Set up Stop hooks for auto-testing.' },
      { id: 'w3d3', day: 'Day 17-18', task: 'Create custom agents', detail: 'Build a CodeReviewer agent (tools: Read, Grep). Build a SecurityAuditor agent.' },
      { id: 'w3d5', day: 'Day 19-20', task: 'Set up hooks pipeline', detail: 'PostToolUse for auto-format. PreToolUse for pre-commit lint. Stop for auto-test.' },
      { id: 'w3d7', day: 'Day 21', task: 'Build a feature with full verification', detail: 'Plan → build → hooks auto-verify → agent reviews → ship. Zero manual testing.' },
    ],
  },
  {
    week: 4,
    title: 'Mastery',
    description: 'Combine all techniques. Build an entire app using the 10x workflow.',
    deliverable: 'A complete app built with all techniques combined',
    days: [
      { id: 'w4d1', day: 'Day 22-23', task: 'Learn /batch for parallel subagents', detail: '/batch to fan out work to 10+ agents in isolated worktrees.' },
      { id: 'w4d3', day: 'Day 24-25', task: 'Create 5 custom slash commands', detail: '/commit-push-pr, /techdebt, /test-this, /deploy, /cleanup.' },
      { id: 'w4d5', day: 'Day 26-27', task: 'Use voice dictation for all prompts', detail: '/voice + spacebar. Speak naturally. Compare typed vs spoken detail levels.' },
      { id: 'w4d7', day: 'Day 28', task: 'Build an entire app with all techniques', detail: 'Voice → Plan → Parallel worktrees → Hooks verify → Agents review → /ship.' },
    ],
  },
];

export interface ChecklistItem {
  id: string;
  tier: 'immediate' | 'this-week' | 'this-month' | 'long-term';
  task: string;
  detail: string;
}

export const actionableChecklist: ChecklistItem[] = [
  // Immediate (This Session)
  { id: 'imm-1', tier: 'immediate', task: 'Start in Plan Mode (Shift+Tab twice)', detail: 'Before building anything' },
  { id: 'imm-2', tier: 'immediate', task: 'Turn on auto mode', detail: 'claude --enable-auto-mode' },
  { id: 'imm-3', tier: 'immediate', task: 'Enable Chrome extension for web verification', detail: 'Claude can see and test your UI' },
  { id: 'imm-4', tier: 'immediate', task: 'Create CLAUDE.md with 3-5 rules', detail: 'Run /init, then add rules you know Claude breaks' },

  // This Week
  { id: 'week-1', tier: 'this-week', task: 'Set up 3-5 git worktrees', detail: 'Run Claude in parallel sessions' },
  { id: 'week-2', tier: 'this-week', task: 'Create your first slash command', detail: 'e.g., /commit-push-pr' },
  { id: 'week-3', tier: 'this-week', task: 'Configure PostToolUse hook for auto-formatting', detail: 'Auto-format every file Claude edits' },
  { id: 'week-4', tier: 'this-week', task: 'Set up voice dictation', detail: '/voice then hold spacebar' },

  // This Month
  { id: 'month-1', tier: 'this-month', task: 'Build a subagent team', detail: 'CodeReviewer, SecurityAuditor, TestWriter' },
  { id: 'month-2', tier: 'this-month', task: 'Create 5-10 custom skills', detail: '/techdebt, /deploy, /test-this, /explain, /cleanup' },
  { id: 'month-3', tier: 'this-month', task: 'Set up /loop for recurring tasks', detail: '/loop 5m /babysit for CI monitoring' },
  { id: 'month-4', tier: 'this-month', task: 'Review and optimize /permissions', detail: 'Pre-allow safe commands with wildcards' },

  // Long-Term
  { id: 'long-1', tier: 'long-term', task: 'Make CLAUDE.md your team source of truth', detail: 'Whole team contributes multiple times a week' },
  { id: 'long-2', tier: 'long-term', task: 'Tag @.claude in PRs to build knowledge', detail: 'Compounding Engineering in action' },
  { id: 'long-3', tier: 'long-term', task: 'Use Cowork Dispatch for non-coding tasks', detail: 'Delegate from anywhere' },
  { id: 'long-4', tier: 'long-term', task: 'Set up cloud-based /schedule jobs', detail: 'Autonomous work even when laptop is closed' },
];
