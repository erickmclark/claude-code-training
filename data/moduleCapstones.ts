import type { ModuleCapstoneScenario } from '@/types/lesson';

export const moduleCapstones: Record<number, ModuleCapstoneScenario> = {
  0: {
    moduleId: 0,
    title: 'Your First Day with Claude Code',
    estimatedMinutes: 15,
    situation:
      "You just joined a startup as their first engineering hire. The CTO hands you a half-built Next.js app and says: 'Figure out what we have and add a contact form.' You have Claude Code installed but have never used it on a real codebase. Your goal: use Claude Code to understand the project and ship the form by end of day.",
    techniques: ['Agentic loop', 'Built-in tools (Read, Grep, Bash)', 'Verification'],
    tasks: [
      {
        id: 't1',
        description:
          'Ask Claude Code to explore the repo and summarize the project structure, tech stack, and existing pages.',
        successCriteria:
          'Claude produced a summary that mentions the framework, the main routes/pages, and where components live.',
      },
      {
        id: 't2',
        description:
          "Ask Claude to add a /contact page with a form (name, email, message). Watch how it reads files before writing, then runs the build to check its work.",
        successCriteria:
          'The new page exists, the form renders, and Claude verified its own work (ran a build, a type check, or read the file back).',
      },
      {
        id: 't3',
        description:
          "In the conversation transcript, identify each phase of the agentic loop: tool call → tool result → next action. Count how many tool calls Claude made.",
        successCriteria:
          'You can point to specific tool calls (Read, Grep, Write, Bash) and explain why Claude chose each one.',
      },
    ],
    deliverable: 'A working /contact page in your Next.js app, plus a short reflection on the agentic loop in action.',
    selfCheckQuestions: [
      'Did Claude read files before editing them?',
      'Did Claude verify its changes without being asked?',
      'Can you name at least 3 built-in tools Claude used?',
    ],
  },

  1: {
    moduleId: 1,
    title: 'The Monday Morning Sprint',
    estimatedMinutes: 20,
    situation:
      "It's Monday morning. Your team committed to shipping 3 independent features this week: a search bar, a notification badge, and a settings page. Standup is in 45 minutes, and you want all three features planned and in-progress before it starts. You'll use Plan Mode to architect each one, write a CLAUDE.md so parallel sessions stay consistent, then launch parallel work.",
    techniques: ['Plan Mode', 'Parallel execution', 'CLAUDE.md'],
    tasks: [
      {
        id: 't1',
        description:
          'Press Shift+Tab twice to enter Plan Mode. Ask Claude to create implementation plans for all 3 features without writing any code. Iterate until each plan is solid.',
        successCriteria:
          'You have 3 written plans covering: files to change, component structure, and edge cases. No code was written yet.',
      },
      {
        id: 't2',
        description:
          "Create (or update) a CLAUDE.md in your project root with: tech stack, naming conventions, where components live, and any 'never do X' rules. Keep it under 50 lines.",
        successCriteria:
          'CLAUDE.md exists, is concise, and contains rules a new teammate would actually need.',
      },
      {
        id: 't3',
        description:
          'Launch 3 parallel Claude sessions (separate terminal tabs or git worktrees) and assign one feature to each. Let them work simultaneously.',
        successCriteria:
          'All 3 sessions are running in parallel. Each has its own plan. None are stepping on each other.',
      },
    ],
    deliverable: '3 features in-progress across parallel sessions, guided by a shared CLAUDE.md and pre-approved plans.',
    selfCheckQuestions: [
      'Did you plan before coding?',
      'Does your CLAUDE.md contain rules Claude would otherwise get wrong?',
      'Are the 3 sessions genuinely independent (no file conflicts)?',
    ],
  },

  2: {
    moduleId: 2,
    title: 'The Broken Deploy',
    estimatedMinutes: 25,
    situation:
      "Production is down. A colleague pushed a bad commit to main 20 minutes ago and the checkout page throws a TypeError for every user. You need to: isolate a hotfix in a git worktree (so your current work isn't disturbed), find and fix the bug, and set up a verification loop so this class of bug gets caught automatically next time.",
    techniques: ['Git worktrees', 'Verification loops', 'Checkpoints / rewind'],
    tasks: [
      {
        id: 't1',
        description:
          'Create a git worktree for a hotfix branch so you can work on the fix without touching your current working directory.',
        successCriteria:
          'You have a worktree at a separate path, on a new branch, with its own Claude Code session.',
      },
      {
        id: 't2',
        description:
          'Ask Claude to identify the breaking change (diff against the last known good commit), explain the root cause, and implement a fix. Use checkpoints so you can rewind if the first attempt is wrong.',
        successCriteria:
          'The bug is fixed. Claude explained the root cause (not just the symptom). You know how to rewind if needed.',
      },
      {
        id: 't3',
        description:
          'Set up a verification loop: a test, lint rule, or CI check that catches this bug class automatically. Run it to confirm it now passes.',
        successCriteria:
          'The verification loop reproduces the bug on the broken commit and passes on the fixed commit.',
      },
    ],
    deliverable: 'A hotfix PR from an isolated worktree, with a verification loop that prevents regression.',
    selfCheckQuestions: [
      'Did you work in an isolated worktree, not main?',
      'Does your verification loop catch the original bug?',
      'Could you rewind to the starting state if the fix was wrong?',
    ],
  },

  3: {
    moduleId: 3,
    title: "Automating Your Team's Workflow",
    estimatedMinutes: 30,
    situation:
      "Your team keeps doing the same 3 things manually: (1) running lint before every commit, (2) regenerating API docs after schema changes, and (3) posting to Slack when a deploy finishes. Your tech lead asks you to automate all three using Claude Code's automation features. You have the rest of the afternoon.",
    techniques: ['Custom slash commands', 'Hooks (PreToolUse / PostToolUse)', 'CI/CD integration'],
    tasks: [
      {
        id: 't1',
        description:
          'Create a custom slash command /docs that regenerates API documentation from your schema or OpenAPI spec. Store it in .claude/commands/.',
        successCriteria:
          'Running /docs in Claude Code produces updated documentation. The command file is checked into the repo.',
      },
      {
        id: 't2',
        description:
          'Configure a PostToolUse hook in .claude/settings.json that runs your linter automatically after every Write or Edit. Verify it actually fires.',
        successCriteria:
          'The hook is registered in settings.json with the right matcher, and lint runs automatically when Claude edits a file.',
      },
      {
        id: 't3',
        description:
          "Write a GitHub Actions workflow (.github/workflows/deploy.yml) that posts to Slack on successful deploy. Use gh actions lint or a YAML validator to confirm it's syntactically valid.",
        successCriteria:
          'The workflow file exists, is valid YAML, and includes a Slack notification step gated on deploy success.',
      },
    ],
    deliverable: 'A /docs command, a lint-on-edit hook, and a Slack-notifying CI workflow — all checked into the repo.',
    selfCheckQuestions: [
      'Does /docs produce real output when run?',
      'Does the hook fire automatically after an edit?',
      'Is the CI/CD YAML syntactically valid?',
    ],
  },

  4: {
    moduleId: 4,
    title: 'The Architecture Review',
    estimatedMinutes: 30,
    situation:
      "Your company is migrating a monolith to microservices. The VP of Engineering wants a proof-of-concept by Friday: plan the decomposition, scaffold 3 services in parallel using specialized agents, and use /batch to update all import paths across 50+ files. You've been given a sandbox fork of the monolith.",
    techniques: ['Multi-agent orchestration', '/batch parallelization', 'Custom agents'],
    tasks: [
      {
        id: 't1',
        description:
          'Create 2 specialized agents in .claude/agents/: a "service-scaffolder" (writes boilerplate for a new microservice) and a "import-migrator" (updates import paths). Give each a focused system prompt and restricted tools.',
        successCriteria:
          'Both agent files exist with name, description, tools, and a focused system prompt. Each agent does ONE thing well.',
      },
      {
        id: 't2',
        description:
          'Use /batch (or parallel subagent spawning) to scaffold 3 microservice directories at once. Each service should have its own package.json, entry point, and tests.',
        successCriteria:
          '3 service directories exist. They were created in parallel, not sequentially. Each is independently runnable.',
      },
      {
        id: 't3',
        description:
          'Use batch processing to find-and-replace import paths across the codebase (e.g., @monolith/users → @services/users). Verify with a grep that no old paths remain.',
        successCriteria:
          'grep finds zero references to the old import path. The code still compiles/runs.',
      },
    ],
    deliverable: '3 scaffolded microservices, 2 custom agents, and a codebase-wide import migration — all done in parallel.',
    selfCheckQuestions: [
      'Do your agents have focused, non-overlapping responsibilities?',
      'Did batch mode genuinely run in parallel (check timestamps)?',
      'Are the 3 services each independently runnable?',
    ],
  },

  5: {
    moduleId: 5,
    title: "The Power User's Morning Routine",
    estimatedMinutes: 25,
    situation:
      "You're mentoring a junior developer who just said: 'Claude Code is just a chatbot.' You have 25 minutes before your next meeting to demonstrate a complete power-user workflow: controlling thinking depth for a hard problem, managing context across a long session, resuming yesterday's work, and kicking off a headless overnight task. They're watching your screen.",
    techniques: ['Extended thinking (/effort)', 'Context management (/compact)', 'Sessions (--continue / --resume)', 'Headless mode'],
    tasks: [
      {
        id: 't1',
        description:
          'Start a fresh session and use /effort max on a complex refactor (or the keyword "ultrathink"). Compare the response quality to a normal-effort run on the same task.',
        successCriteria:
          'You used two different effort levels on the same task and can point to a concrete quality difference.',
      },
      {
        id: 't2',
        description:
          'Let the conversation grow until context is 50%+ full (or force it by reading many files). Run /compact with a focus instruction (e.g., /compact focus on the API changes). Confirm important state survived.',
        successCriteria:
          'Context is reduced. The key decisions and file state from before /compact are still intact.',
      },
      {
        id: 't3',
        description:
          'Demonstrate session resume: exit the session, then run claude --continue (or --resume with the session ID) and keep working as if nothing happened.',
        successCriteria:
          'You successfully resumed the exact conversation after "closing your terminal." No state was lost.',
      },
      {
        id: 't4',
        description:
          "Set up a headless Claude command (claude -p '...' with --allowedTools) that runs a code quality check and writes a report to disk. No interactive input allowed.",
        successCriteria:
          'The headless command runs end-to-end without prompting. A report file is written.',
      },
    ],
    deliverable: 'A live demo covering effort levels, /compact, session resume, and headless execution — all in one sitting.',
    selfCheckQuestions: [
      'Did you use at least 2 different effort levels?',
      'Did /compact preserve the important state?',
      'Did session resume restore the exact prior state?',
      'Does your headless command run without any prompts?',
    ],
  },
};

export function getModuleCapstone(moduleId: number): ModuleCapstoneScenario | undefined {
  return moduleCapstones[moduleId];
}
