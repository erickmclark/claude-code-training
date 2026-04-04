import { Module } from '@/types/lesson';

export const modules: Module[] = [
  {
    id: 1,
    title: 'Foundations',
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
    title: 'Core Workflows',
    description: 'Build real features using worktrees, voice dictation, and verification loops.',
    icon: '⚙️',
    lessons: [4, 5, 6, 14, 20],
    estimatedTime: '58 min',
    difficulty: 'Beginner',
    tip: 'Have Claude Code open while going through this module. These techniques click much faster when you try them as you learn them.',
    outcomes: ['Use git worktrees for isolation', 'Voice-dictate prompts', 'Set up verification loops', 'Rewind to any checkpoint', 'Manage costs with model selection'],
  },
  {
    id: 3,
    title: 'Automation',
    description: 'Create custom commands, automate with hooks, and control Claude from anywhere.',
    icon: '🔗',
    lessons: [9, 10, 11, 19],
    estimatedTime: '54 min',
    difficulty: 'Intermediate',
    tip: 'Have a real project ready to practice with. The hooks and commands you build here work best when applied to your actual workflow.',
    outcomes: ['Build custom slash commands', 'Configure lifecycle hooks', 'Use mobile and remote control', 'Connect external tools via MCP'],
  },
  {
    id: 4,
    title: 'Agent Architecture',
    description: 'Design multi-agent systems, custom agents, and combine all techniques for 10x productivity.',
    icon: '🤖',
    lessons: [7, 8, 12, 15, 16, 17, 18],
    estimatedTime: '102 min',
    difficulty: 'Advanced',
    tip: 'This module is most powerful if you have a real task to parallelize. Think about a project where multiple agents could work simultaneously.',
    outcomes: ['Create specialized agents', 'Use /batch for parallel work', 'Combine all techniques', 'Use Ultraplan for cloud planning', 'Set up event-driven channels'],
  },
  {
    id: 5,
    title: 'Daily Workflow Mastery',
    description: 'Essential daily-use patterns: extended thinking, context management, session control, the Skills system, IDE integration, and headless scripting.',
    icon: '🧠',
    lessons: [21, 22, 23, 24, 25, 26],
    estimatedTime: '86 min',
    difficulty: 'Intermediate',
    tip: 'Try each technique in your actual Claude Code setup. The muscle memory you build here will make you dramatically faster in daily use.',
    outcomes: [
      'Control thinking depth with /effort and ultrathink',
      'Manage context window with /compact and auto-memory',
      'Navigate sessions with --continue, --resume, and /branch',
      'Build and share skills using SKILL.md format',
      'Use VS Code and JetBrains IDE plugins effectively',
      'Run Claude headlessly in scripts and CI/CD pipelines',
    ],
  },
];

// Module unlock order: 1 → 2 → 3 → 4 → 5
const UNLOCK_ORDER = [null, null, 1, 2, 3, 4];

export function getModuleById(id: number): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function isModuleUnlocked(
  moduleId: number,
  completedLessonIds: number[]
): boolean {
  const unlockAfter = UNLOCK_ORDER[moduleId];
  if (unlockAfter === null || unlockAfter === undefined) return true;
  const prevMod = getModuleById(unlockAfter);
  if (!prevMod) return true;
  return prevMod.lessons.every((id) => completedLessonIds.includes(id));
}
