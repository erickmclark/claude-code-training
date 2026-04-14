import { Module } from '@/types/lesson';

export const modules: Module[] = [
  {
    id: 0,
    title: 'Module 1: What is Claude Code',
    description: 'Understand what Claude Code is, how the agentic loop works, built-in tools, and where it runs — before diving into techniques.',
    icon: '📖',
    lessons: [34, 35],
    estimatedTime: '12 min',
    difficulty: 'Beginner',
    tip: 'Start here if you\'ve never used Claude Code. This module gives you the mental model for everything that follows.',
    outcomes: [
      'Understand what Claude Code is and how it differs from chatbots',
      'Learn the agentic loop: gather context, take action, verify results',
      'Know all the built-in tools and what Claude can access',
      'Discover every platform where Claude Code runs',
    ],
  },
  {
    id: 1,
    title: 'Module 2: Foundations',
    description: 'Master the three pillars: parallel execution, plan mode, and project configuration with CLAUDE.md.',
    icon: '🏗️',
    lessons: [1, 2, 3, 13],
    estimatedTime: '42 min',
    difficulty: 'Beginner',
    tip: "Open a terminal and have Claude Code running before starting. You'll learn faster by trying each technique as you go.",
    outcomes: ['Run parallel sessions', 'Use plan mode effectively', 'Create and maintain CLAUDE.md', 'Use CLAUDE.local.md for personal notes'],
  },
  {
    id: 2,
    title: 'Module 3: Core Workflows',
    description: 'Build real features using worktrees, voice dictation, and verification loops.',
    icon: '⚙️',
    lessons: [4, 5, 6, 14, 20],
    estimatedTime: '63 min',
    difficulty: 'Beginner',
    tip: 'Have Claude Code open while going through this module. These techniques click much faster when you try them as you learn them.',
    outcomes: ['Use git worktrees for isolation', 'Voice-dictate prompts', 'Set up verification loops with a reviewer subagent', 'Rewind to any checkpoint', 'Manage costs with model selection'],
  },
  {
    id: 3,
    title: 'Module 4: Automation',
    description: 'Create custom commands, automate with hooks, control Claude from anywhere, and integrate with CI/CD and Slack.',
    icon: '🔗',
    lessons: [9, 10, 11, 19, 27, 28, 29, 30],
    estimatedTime: '129 min',
    difficulty: 'Intermediate',
    tip: 'Have a real project ready to practice with. The hooks and commands you build here work best when applied to your actual workflow.',
    outcomes: ['Build custom slash commands', 'Configure lifecycle hooks', 'Use mobile and remote control', 'Connect external tools via MCP', 'Test web UIs with Chrome integration', 'Set up CI/CD with GitHub Actions and GitLab', 'Install and create plugins', 'Schedule tasks with /loop and delegate from Slack'],
  },
  {
    id: 4,
    title: 'Module 5: Agent Architecture',
    description: 'Design multi-agent systems, custom agents, and combine all techniques for 10x productivity.',
    icon: '🤖',
    lessons: [7, 8, 12, 15, 16, 41, 17, 18],
    estimatedTime: '122 min',
    difficulty: 'Advanced',
    tip: 'This module is most powerful if you have a real task to parallelize. Think about a project where multiple agents could work simultaneously.',
    outcomes: ['Create specialized agents', 'Use /batch for parallel work', 'Combine all techniques', 'Use Ultraplan for cloud planning', 'Set up event-driven channels', 'Apply the four canonical agent patterns'],
  },
  {
    id: 5,
    title: 'Module 6: Daily Workflow Mastery',
    description: 'Essential daily-use patterns: extended thinking, context management, session control, the Skills system, IDE integration, headless scripting, cloud sessions, Desktop app, and security.',
    icon: '🧠',
    lessons: [21, 22, 43, 23, 24, 25, 26, 31, 32, 33],
    estimatedTime: '146 min',
    difficulty: 'Advanced',
    tip: 'Try each technique in your actual Claude Code setup. The muscle memory you build here will make you dramatically faster in daily use.',
    outcomes: [
      'Control thinking depth with /effort and ultrathink',
      'Manage context window with /compact and auto-memory',
      'Maximize prompt cache hits for cheaper sessions',
      'Navigate sessions with --continue, --resume, and /branch',
      'Build and share skills using SKILL.md, bundled scripts, and assets',
      'Use VS Code and JetBrains IDE plugins effectively',
      'Run Claude headlessly in scripts and CI/CD pipelines',
      'Run tasks on cloud infrastructure with --remote and /teleport',
      'Use the Desktop app for visual diff review and parallel sessions',
      'Configure permission modes, allowlists, and sandboxing',
    ],
  },
  {
    id: 6,
    title: 'Module 7: 10x in Practice',
    description: 'See how every technique connects in one end-to-end workflow. Build a real feature from plan to ship using everything you learned.',
    icon: '⚡',
    lessons: [36, 37, 38, 39, 40],
    estimatedTime: '~90 min',
    difficulty: 'Advanced',
    tip: 'Have a real feature in mind before you start. The lessons compound — each one assumes you carry the same project forward.',
    outcomes: [
      'See how planning, parallel execution, verification, and shipping connect',
      'Plan a real feature using Plan Mode + CLAUDE.md',
      'Run parallel work across worktrees without conflicts',
      'Build verification loops that catch regressions',
      'Recover gracefully when things go wrong',
    ],
  },
];

// Module unlock order: 0 (always) → 1 (always) → 2 → 3 → 4 → 5 → 6
// Kept for reference; referenced by the commented-out gated logic in isModuleUnlocked below.
const _UNLOCK_ORDER = [null, null, null, 1, 2, 3, 4, 5];
void _UNLOCK_ORDER;

export function getModuleById(id: number): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function isModuleUnlocked(
  moduleId: number,
  completedLessonIds: number[]
): boolean {
  // BUILD MODE: everything unlocked. Restore the gated logic below before shipping.
  void moduleId;
  void completedLessonIds;
  return true;
  // const unlockAfter = _UNLOCK_ORDER[moduleId];
  // if (unlockAfter === null || unlockAfter === undefined) return true;
  // const prevMod = getModuleById(unlockAfter);
  // if (!prevMod) return true;
  // return prevMod.lessons.every((id) => completedLessonIds.includes(id));
}
