import { QuizQuestion } from '@/types/lesson';

export const lessonQuizzes: Record<number, QuizQuestion[]> = {
  // Lesson 1: Parallel Execution
  1: [
    {
      question: 'What command creates an isolated parallel Claude Code session?',
      options: ['claude --parallel', 'claude --worktree <name>', 'claude --session <name>', 'claude --fork'],
      correctIndex: 1,
      explanation: 'claude --worktree <name> creates a new git worktree at .claude/worktrees/<name>/ with its own branch, providing a fully isolated environment.',
    },
    {
      question: 'What happens when you run `claude --worktree` without specifying a name?',
      options: ['It fails with an error', 'It auto-generates a random name like "bright-running-fox"', 'It uses the current branch name', 'It prompts you to enter a name'],
      correctIndex: 1,
      explanation: 'Claude Code auto-generates a random worktree name (e.g., "bright-running-fox") when no name is provided.',
    },
    {
      question: 'Where are Claude Code worktrees stored by default?',
      options: ['/tmp/claude-worktrees/', '~/.claude/worktrees/', '.claude/worktrees/<name>/', 'node_modules/.claude/'],
      correctIndex: 2,
      explanation: 'Worktrees are created at .claude/worktrees/<name>/ within your project directory.',
    },
    {
      question: 'What branch does a new worktree branch from?',
      options: ['The current local branch', 'origin/HEAD', 'main', 'The most recent tag'],
      correctIndex: 1,
      explanation: 'Worktrees branch from origin/HEAD — the remote\'s current default branch. You can change this with git remote set-head.',
    },
    {
      question: 'What file do you create to copy .env files into new worktrees?',
      options: ['.worktreeconfig', '.worktreeinclude', '.envworktree', '.claude/worktree.json'],
      correctIndex: 1,
      explanation: '.worktreeinclude uses .gitignore syntax to specify which gitignored files should be copied into new worktrees.',
    },
    {
      question: 'What happens when you exit a worktree session with no changes?',
      options: ['The worktree persists until manually deleted', 'The worktree and branch are automatically deleted', 'Claude asks whether to keep it', 'The worktree moves to .claude/worktrees/.archived/'],
      correctIndex: 1,
      explanation: 'If no changes were made, the worktree and its branch are automatically cleaned up on exit.',
    },
    {
      question: 'What should you add to .gitignore for worktrees?',
      options: ['.claude/', '.claude/worktrees/', '.claude/agents/', '.worktrees/'],
      correctIndex: 1,
      explanation: 'Add .claude/worktrees/ to .gitignore to keep worktree directories out of version control.',
    },
    {
      question: 'How do parallel sessions affect API rate limits?',
      options: ['They share a single rate limit', 'Each session counts independently', 'Only the first 5 sessions count', 'Rate limits are paused during parallel work'],
      correctIndex: 1,
      explanation: 'Each parallel session counts toward your API rate limits independently, so monitor usage when running many sessions.',
    },
    {
      question: 'What does Boris Cherny call "the single biggest productivity unlock"?',
      options: ['Using Plan Mode', 'Running 3-5 git worktrees simultaneously', 'Writing detailed CLAUDE.md files', 'Voice dictation'],
      correctIndex: 1,
      explanation: 'Boris says running 3-5 worktrees simultaneously is "the single biggest productivity unlock" for parallel isolated work.',
    },
    {
      question: 'Why does merge order matter when combining parallel worktrees?',
      options: ['It doesn\'t matter', 'Alphabetical order prevents conflicts', 'Foundation first (DB, auth), then features, then UI last', 'Newest first, oldest last'],
      correctIndex: 2,
      explanation: 'Start with foundational work (database, auth), then middleware, then features that depend on them, and finally UI. This minimizes merge conflicts.',
    },
  ],

  // Lesson 2: Plan Mode
  2: [
    {
      question: 'What does plan mode prevent Claude from doing?',
      options: ['Reading files', 'Searching the codebase', 'Modifying files or running state-changing commands', 'Asking clarifying questions'],
      correctIndex: 2,
      explanation: 'Plan mode is read-only — Claude can read files and search the codebase, but cannot edit files, write new code, or run commands that modify state.',
    },
    {
      question: 'How do you start a Claude Code session directly in plan mode?',
      options: ['claude --plan', 'claude --permission-mode plan', 'claude --read-only', 'claude plan'],
      correctIndex: 1,
      explanation: 'Use claude --permission-mode plan to start a session in plan mode from the beginning.',
    },
    {
      question: 'What keyboard shortcut toggles between permission modes during a session?',
      options: ['Ctrl+P', 'Shift+Tab', 'Alt+M', 'Ctrl+Shift+P'],
      correctIndex: 1,
      explanation: 'Shift+Tab cycles through: Normal → Auto-Accept → Plan Mode → Normal.',
    },
    {
      question: 'What keyboard shortcut opens the plan in your text editor for editing?',
      options: ['Ctrl+E', 'Ctrl+G', 'Ctrl+O', 'Ctrl+P'],
      correctIndex: 1,
      explanation: 'Ctrl+G opens the current plan in your text editor. Edit, save, and quit — Claude reads your changes.',
    },
    {
      question: 'What happens when you approve a plan?',
      options: ['Claude creates a separate implementation branch', 'The session stays in plan mode for further refinement', 'Claude names the session and switches to Normal Mode to implement', 'The plan is saved as a markdown file'],
      correctIndex: 2,
      explanation: 'When approved, Claude auto-names the session based on plan content, switches to Normal Mode, and begins implementing the accepted plan.',
    },
    {
      question: 'Which scenario is BEST suited for plan mode?',
      options: ['Fixing a single typo in a README', 'Adding a console.log for debugging', 'Refactoring an authentication system across 14 files', 'Renaming a single variable'],
      correctIndex: 2,
      explanation: 'Plan mode excels at multi-file changes, uncertain approaches, and complex refactors where planning prevents wasted implementation cycles.',
    },
    {
      question: 'How do you run a one-off headless plan query?',
      options: ['claude plan "query"', 'claude --permission-mode plan -p "query"', 'claude -p --permission-mode bypass "query"', 'claude --bare -p "query"'],
      correctIndex: 1,
      explanation: 'Combine --permission-mode plan with -p for a headless (non-interactive) plan query that outputs the analysis and exits.',
    },
    {
      question: 'How can you make plan mode your default for all sessions?',
      options: ['Set CLAUDE_PERMISSION_MODE=plan in .env', 'Add defaultMode: "plan" in settings.json permissions', 'Add permissionMode: "plan" to CLAUDE.md', 'Run claude --permission-mode plan on every start'],
      correctIndex: 1,
      explanation: 'Set permissions.defaultMode to "plan" in .claude/settings.json to start every session in plan mode by default.',
    },
    {
      question: 'What is Boris\'s plan mode workflow?',
      options: [
        'Plan → code → hope it works',
        'Plan → iterate on plan → auto-accept → Claude 1-shots implementation',
        'Skip plan, go straight to coding',
        'Use /effort high before planning, then ask Claude to implement',
      ],
      correctIndex: 1,
      explanation: 'Boris\'s workflow: describe what you want → iterate on the plan → once solid, switch to auto-accept → Claude 1-shots the implementation.',
    },
    {
      question: 'What should you do when implementation goes sideways?',
      options: ['Run /effort max to improve quality', 'Delete everything and start over', 'Switch back to plan mode and re-plan', 'Run /compact to clear the distracted context and retry'],
      correctIndex: 2,
      explanation: 'Boris says: don\'t keep pushing — switch back to plan mode and re-plan. The moment something goes sideways, step back to planning.',
    },
  ],

  // Lesson 3: CLAUDE.md Files
  3: [
    {
      question: 'What is the correct loading order for CLAUDE.md files (first to last)?',
      options: [
        'Project → User → Managed policy',
        'Managed policy → User → Project → Subdirectory',
        'Subdirectory → Project → User → Managed policy',
        'User → Project → Subdirectory → Managed policy',
      ],
      correctIndex: 1,
      explanation: 'CLAUDE.md loads from broadest to most specific: managed policy → user (~/.claude/) → project root → subdirectory. More specific overrides broader.',
    },
    {
      question: 'What is the recommended maximum length for a CLAUDE.md file?',
      options: ['50 lines', '100 lines', '200 lines', '500 lines'],
      correctIndex: 2,
      explanation: 'Target under 200 lines. Longer files lose adherence because instructions get lost in noise. Split into .claude/rules/ if you need more.',
    },
    {
      question: 'What command auto-generates a CLAUDE.md for your project?',
      options: ['/generate', '/init', '/create-config', '/setup'],
      correctIndex: 1,
      explanation: '/init analyzes your codebase and creates a CLAUDE.md with build commands, code style patterns, project conventions, and architecture notes.',
    },
    {
      question: 'What syntax imports another file from CLAUDE.md?',
      options: ['!@path/to/file', '<<path/to/file>>', '@path/to/file', 'require("path/to/file")'],
      correctIndex: 2,
      explanation: 'Use @path/to/file syntax to import other files. Imports are expanded at startup, with max 5 levels of nesting.',
    },
    {
      question: 'Where do path-specific rules go?',
      options: ['CLAUDE.md with path comments', '.claude/rules/ with paths frontmatter', '.claude/paths.json', 'package.json claude section'],
      correctIndex: 1,
      explanation: 'Create files in .claude/rules/ with paths: frontmatter using glob patterns. These load only when Claude works with matching files.',
    },
    {
      question: 'Which of these should NOT be included in CLAUDE.md?',
      options: ['Build and test commands', 'Code style rules that differ from defaults', 'Standard language conventions Claude already knows', 'Common gotchas and non-obvious behaviors'],
      correctIndex: 2,
      explanation: 'Don\'t include things Claude can figure out from reading code or that are standard language conventions. Focus on project-specific information.',
    },
    {
      question: 'What command shows which CLAUDE.md files are currently loaded?',
      options: ['/hooks', '/memory', '/config', '/agents'],
      correctIndex: 1,
      explanation: '/memory shows which CLAUDE.md files are loaded, which rule files apply, and what auto memory has saved.',
    },
    {
      question: 'How do you exclude a parent CLAUDE.md in a monorepo?',
      options: [
        'Delete the parent CLAUDE.md',
        'Add claudeMdExcludes in settings.local.json',
        'Create an empty CLAUDE.md to override',
        'Set ignore: true in the parent file',
      ],
      correctIndex: 1,
      explanation: 'Use claudeMdExcludes in .claude/settings.local.json with glob patterns to exclude specific CLAUDE.md files. Managed policy files cannot be excluded.',
    },
    {
      question: 'What is the @.claude PR workflow that the Claude Code team uses?',
      options: [
        'A GitHub bot that reviews code',
        'Tag @.claude in PR comments to auto-update CLAUDE.md with new rules',
        'A CI/CD pipeline for deploying CLAUDE.md',
        'A linting rule for CLAUDE.md formatting',
      ],
      correctIndex: 1,
      explanation: 'The team tags @.claude in code reviews to add learnings to CLAUDE.md as part of the PR. Boris calls this "Compounding Engineering."',
    },
    {
      question: 'What should you say after correcting Claude to prevent future mistakes?',
      options: [
        '"Don\'t do that again"',
        '"Update your CLAUDE.md so you don\'t make that mistake again"',
        '"Remember this for next time"',
        '"Add a TODO comment"',
      ],
      correctIndex: 1,
      explanation: 'Boris says: "Update your CLAUDE.md so you don\'t make that mistake again." Claude is surprisingly good at writing rules for itself.',
    },
  ],

  // Lesson 4: Git Worktrees
  4: [
    {
      question: 'What do git worktrees share between instances?',
      options: ['Working directory files', 'The current branch', 'The .git object database (repository history)', 'Uncommitted changes'],
      correctIndex: 2,
      explanation: 'Worktrees share the same .git object database, meaning commits made in one are visible to all others. But each has its own files, branch, and working state.',
    },
    {
      question: 'What branch naming convention does `claude --worktree <name>` use?',
      options: ['feature/<name>', 'claude/<name>', 'worktree-<name>', '<name>'],
      correctIndex: 2,
      explanation: 'Claude creates a branch named worktree-<name> for worktrees created with --worktree.',
    },
    {
      question: 'What command lists all active git worktrees?',
      options: ['git branch --worktrees', 'git worktree list', 'git status --worktrees', 'git ls-worktrees'],
      correctIndex: 1,
      explanation: 'git worktree list shows all worktrees with their paths, HEAD commits, and branch names.',
    },
    {
      question: 'What happens to orphaned worktrees (from crashes)?',
      options: ['They persist forever', 'They auto-remove after cleanupPeriodDays if no modifications', 'They are deleted immediately on next start', 'They are converted to regular branches'],
      correctIndex: 1,
      explanation: 'Orphaned worktrees auto-remove after cleanupPeriodDays (default: 7 days) if they have no modifications or unpushed commits.',
    },
    {
      question: 'Which hook events allow custom worktree setup for non-git VCS?',
      options: ['PreWorktree / PostWorktree', 'WorktreeCreate / WorktreeRemove', 'SessionStart / SessionEnd', 'GitInit / GitCleanup'],
      correctIndex: 1,
      explanation: 'WorktreeCreate and WorktreeRemove hooks replace Claude\'s default git worktree logic entirely, supporting SVN, Perforce, etc.',
    },
    {
      question: 'How do you create a worktree from an existing branch?',
      options: ['git worktree add ../dir existing-branch', 'git worktree checkout existing-branch', 'git worktree clone existing-branch', 'git worktree switch existing-branch ../dir'],
      correctIndex: 0,
      explanation: 'git worktree add <path> <existing-branch> creates a worktree checking out an existing branch.',
    },
    {
      question: 'What does .worktreeinclude use for its syntax?',
      options: ['JSON format', 'YAML format', '.gitignore syntax', 'Regular expressions'],
      correctIndex: 2,
      explanation: '.worktreeinclude uses .gitignore syntax. Only files matching the pattern AND currently gitignored get copied to new worktrees.',
    },
    {
      question: 'How do you manually remove a git worktree?',
      options: ['rm -rf <worktree-dir>', 'git worktree remove <path>', 'git branch -D <worktree-branch>', 'git worktree delete <name>'],
      correctIndex: 1,
      explanation: 'git worktree remove <path> safely removes the worktree and cleans up git references. Avoid rm -rf which can leave dangling references.',
    },
    {
      question: 'When you exit a worktree session WITH uncommitted changes, what happens?',
      options: ['Changes are auto-committed', 'Claude asks whether to keep or discard the worktree', 'Changes are stashed', 'The worktree is force-deleted'],
      correctIndex: 1,
      explanation: 'If there are changes or commits, Claude asks "Keep this worktree?" — you choose to keep it for later or discard everything.',
    },
    {
      question: 'What is the primary advantage of worktrees over separate git clones?',
      options: ['Worktrees use no disk space', 'Worktrees share storage and history, making them fast and lightweight', 'Worktrees auto-sync changes between instances', 'Worktrees support more branches'],
      correctIndex: 1,
      explanation: 'Worktrees share the .git object database, making them fast to create and using minimal additional disk space compared to full clones.',
    },
  ],

  // Lesson 5: Voice Dictation
  5: [
    {
      question: 'What speech recognition engine does Claude Code use for voice dictation?',
      options: ['Google Speech-to-Text', 'Whisper', 'Apple Dictation', 'Azure Cognitive Services Speech SDK'],
      correctIndex: 1,
      explanation: 'Claude Code uses Whisper for built-in voice transcription. It supports 100 languages and requires no external tools.',
    },
    {
      question: 'What is the default push-to-talk key on macOS?',
      options: ['Cmd+Space', 'Option+Space', 'Ctrl+Space', 'Shift+Space'],
      correctIndex: 1,
      explanation: 'The default push-to-talk key is Option+Space on macOS and Alt+Space on Windows/Linux.',
    },
    {
      question: 'How do you enable voice dictation in Claude Code?',
      options: ['Install a separate plugin', 'Run /config and toggle Voice dictation', 'Set VOICE=true in .env', 'It is always enabled by default'],
      correctIndex: 1,
      explanation: 'Run /config, toggle "Voice dictation" to enabled, and grant microphone permission when your OS prompts.',
    },
    {
      question: 'Where do you customize the push-to-talk keybinding?',
      options: ['.claude/settings.json', '~/.claude/keybindings.json', '.claude/voice.json', 'System keyboard settings'],
      correctIndex: 1,
      explanation: 'Edit ~/.claude/keybindings.json to customize the push-to-talk key and other keybindings.',
    },
    {
      question: 'How many languages does the built-in voice dictation support?',
      options: ['English only', '10 languages', '50 languages', '100 languages'],
      correctIndex: 3,
      explanation: 'Whisper supports 100 languages for transcription.',
    },
    {
      question: 'What is the voice input workflow?',
      options: [
        'Click a button → speak → click stop',
        'Press and hold push-to-talk → speak → release to send',
        'Type /voice → speak → type /stop',
        'Toggle voice mode on → speak continuously → toggle off',
      ],
      correctIndex: 1,
      explanation: 'Press and hold the push-to-talk key, speak your prompt, then release the key. Claude transcribes and processes your input.',
    },
    {
      question: 'Do you need external tools like SuperWhisper for voice in Claude Code?',
      options: ['Yes, SuperWhisper is required', 'Yes, any external transcription tool', 'No, voice dictation is built in', 'Only on Linux'],
      correctIndex: 2,
      explanation: 'Voice dictation is built into Claude Code — no external tools or subscriptions needed.',
    },
    {
      question: 'What key format is used in keybindings.json for voice?',
      options: ['"voice:start-recording"', '"voice:toggle-recording"', '"voice:push-to-talk"', '"voice:record"'],
      correctIndex: 0,
      explanation: 'The action name is "voice:start-recording" in the keybindings.json bindings configuration.',
    },
    {
      question: 'What should you do if voice transcription is inaccurate?',
      options: ['Reinstall Claude Code', 'Speak clearly, reduce background noise, and set the dictation language', 'Switch to a different microphone brand', 'Disable and re-enable voice'],
      correctIndex: 1,
      explanation: 'Speak clearly, reduce background noise, and optionally set a specific dictation language via /config for better accuracy.',
    },
    {
      question: 'Voice dictation is especially useful for which type of input?',
      options: ['Single-word commands', 'Complex, multi-step prompts that are easier to explain verbally', 'File paths and URLs', 'Code syntax'],
      correctIndex: 1,
      explanation: 'Voice dictation excels at complex prompts — describing multi-step tasks, architectural decisions, and requirements is faster by speaking than typing.',
    },
  ],

  // Lesson 6: Verification Loops
  6: [
    {
      question: 'What is described as "the single highest-leverage thing you can do" with Claude Code?',
      options: ['Write detailed prompts', 'Use plan mode first', 'Give Claude a way to verify its own work', 'Use the most expensive model'],
      correctIndex: 2,
      explanation: 'The single highest-leverage thing is giving Claude a way to verify its own work — test, check, fix, repeat.',
    },
    {
      question: 'What hook event fires when Claude finishes responding?',
      options: ['PostToolUse', 'SessionEnd', 'Stop', 'PostCompact'],
      correctIndex: 2,
      explanation: 'The Stop event fires when Claude finishes responding, making it ideal for automatic post-change verification.',
    },
    {
      question: 'In a PreToolUse hook, what exit code blocks the action?',
      options: ['Exit code 0', 'Exit code 1', 'Exit code 2', 'Exit code 255'],
      correctIndex: 2,
      explanation: 'Exit code 2 blocks the action in PreToolUse hooks. Exit 0 allows it. Exit 1 is a general error.',
    },
    {
      question: 'What is the correct verification loop pattern?',
      options: [
        'Plan → implement → deploy',
        'Make change → run verification → fix failures → repeat until passing',
        'Write code → commit → review later',
        'Test first → write code → deploy',
      ],
      correctIndex: 1,
      explanation: 'The verification loop is: make the change → run verification (tests, build, lint) → see results → fix failures → repeat until passing.',
    },
    {
      question: 'What hook type should you use for complex verification requiring AI judgment?',
      options: ['command hook', 'agent hook', 'prompt hook', 'http hook'],
      correctIndex: 1,
      explanation: 'Agent hooks spawn an AI agent for complex verification — they can analyze test output, identify root causes, and make judgment calls.',
    },
    {
      question: 'Which prompt phrasing best enables verification loops?',
      options: [
        '"Write a validateEmail function"',
        '"Add email validation, make it good"',
        '"Add a validateEmail function. Run tests and fix any failures."',
        '"Create validation logic when you have time"',
      ],
      correctIndex: 2,
      explanation: 'Including "Run tests and fix any failures" in your prompt activates the verification loop — Claude will test and self-correct.',
    },
    {
      question: 'Why are unit tests preferred over integration tests for verification loops?',
      options: ['They are more accurate', 'They run faster, giving Claude quicker feedback', 'They catch more bugs', 'Integration tests are not supported'],
      correctIndex: 1,
      explanation: 'Fast verification means faster feedback loops. Unit tests run in seconds, while integration tests may take minutes, slowing Claude down.',
    },
    {
      question: 'What does this hook configuration do: matcher "Bash(git commit *)" with "npm run lint || exit 2"?',
      options: ['Runs lint after every commit', 'Blocks commits that fail linting', 'Formats code before commit', 'Logs commit messages'],
      correctIndex: 1,
      explanation: 'This PreToolUse hook runs lint before git commit commands. If lint fails, exit 2 blocks the commit entirely.',
    },
    {
      question: 'What does Boris Cherny say is "the most important thing" for great results with Claude Code?',
      options: ['Using the most expensive model', 'Writing detailed prompts', 'Giving Claude a way to verify its work', 'Using Plan Mode for everything'],
      correctIndex: 2,
      explanation: '"Give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result." — Boris Cherny',
    },
    {
      question: 'Which is NOT one of Boris\'s "push Claude on quality" patterns?',
      options: [
        '"Grill me on these changes and don\'t make a PR until I pass"',
        '"Just do your best and we\'ll fix it later"',
        '"Prove to me this works. Diff behavior between main and your branch"',
        '"Scrap this and implement the elegant solution"',
      ],
      correctIndex: 1,
      explanation: 'Boris\'s quality patterns challenge Claude: grill me, prove it works, and scrap-and-redo. "Just do your best" accepts mediocre output.',
    },
  ],

  // Lesson 7: Subagents
  7: [
    {
      question: 'What is the primary benefit of subagents?',
      options: ['They are faster than the main session', 'They provide context isolation — research in a separate window returns a summary', 'They are free to use', 'They can access the internet'],
      correctIndex: 1,
      explanation: 'Subagents run in isolated context windows. Research happens separately and returns a concise summary, keeping the main conversation clean.',
    },
    {
      question: 'Where do custom agent definition files live?',
      options: ['.claude/skills/', '.claude/agents/', '.claude/rules/', '~/.claude/agents/'],
      correctIndex: 1,
      explanation: 'Custom agent files live in .claude/agents/ as markdown files with YAML frontmatter.',
    },
    {
      question: 'What built-in subagent type is used for read-only codebase investigation?',
      options: ['Reader', 'Explore', 'Search', 'Analyze'],
      correctIndex: 1,
      explanation: 'The Explore agent is a built-in read-only investigation agent for researching and understanding the codebase.',
    },
    {
      question: 'What frontmatter field gives a subagent its own git worktree?',
      options: ['parallel: true', 'worktree: true', 'isolation: worktree', 'fork: worktree'],
      correctIndex: 2,
      explanation: 'Setting isolation: "worktree" in frontmatter gives the agent its own .claude/worktrees/subagent-<name>/ directory.',
    },
    {
      question: 'Which model is most cost-effective for writing unit tests?',
      options: ['Opus ($15/1M tokens)', 'Sonnet', 'Haiku ($0.80/1M tokens)', 'All cost the same'],
      correctIndex: 2,
      explanation: 'Haiku at $0.80/1M tokens is ~19x cheaper than Opus. For routine tasks like writing unit tests, it provides good quality at much lower cost.',
    },
    {
      question: 'How does Claude decide when to auto-delegate to a custom agent?',
      options: ['Based on the agent name', 'Based on the description field matching the user prompt', 'Random selection', 'Based on the model field'],
      correctIndex: 1,
      explanation: 'Claude matches the user\'s prompt against agent description fields to decide which agent to delegate to automatically.',
    },
    {
      question: 'What happens to subagent worktrees after the agent finishes?',
      options: ['They persist forever', 'They are auto-cleaned if no changes were made', 'They are always deleted', 'They are merged into main'],
      correctIndex: 1,
      explanation: 'Subagent worktrees are automatically cleaned up after completion if there are no changes. If changes exist, they persist.',
    },
    {
      question: 'What command lists all available subagents?',
      options: ['/list-agents', '/agents', '/subagents', '/show agents'],
      correctIndex: 1,
      explanation: '/agents shows all available subagents, lets you create new ones, and manage existing agents.',
    },
    {
      question: 'How can you restrict which agents Claude is allowed to spawn?',
      options: [
        'Delete unwanted agent files',
        'Set permissions.Agent in settings.json with allowed agent names',
        'Add disallowedTools: Agent to the agent frontmatter',
        'Set maxSubagents: 0 in settings.json',
      ],
      correctIndex: 1,
      explanation: 'Set permissions.Agent to a pipe-separated list of allowed agent names (e.g., "security-review|code-reviewer") in settings.json.',
    },
    {
      question: 'What is the multi-model strategy for cost optimization?',
      options: [
        'Use only Haiku for everything',
        'Opus for planning, Sonnet for implementation, Haiku for simple tasks',
        'Use the cheapest model always',
        'Alternate between models randomly',
      ],
      correctIndex: 1,
      explanation: 'Route tasks by complexity: Opus for architecture/planning, Sonnet for standard implementation, Haiku for simple tasks. ~40% cost savings.',
    },
  ],

  // Lesson 8: Custom Agents
  8: [
    {
      question: 'What does context: "inherit" mean for an agent?',
      options: [
        'The agent gets a fresh, empty context',
        'The agent shares context with the parent session',
        'The agent inherits settings from the global config',
        'The agent copies the parent branch',
      ],
      correctIndex: 1,
      explanation: '"inherit" means the agent shares context with the parent — it can see conversation history and its responses appear inline.',
    },
    {
      question: 'What does context: "fork" do for an agent?',
      options: [
        'Creates a git fork of the repo',
        'Gives the agent a completely isolated context window',
        'Forks the current conversation into two',
        'Creates a copy of the CLAUDE.md',
      ],
      correctIndex: 1,
      explanation: '"fork" gives the agent a completely isolated context — useful for independent tasks that should not pollute the main conversation.',
    },
    {
      question: 'How do you restrict an agent to read-only operations?',
      options: ['Set readonly: true', 'Set permission_mode: plan', 'Set tools: Read, Grep, Glob', 'Set isolation: readonly'],
      correctIndex: 2,
      explanation: 'The tools field acts as a whitelist. Setting tools: Read, Grep, Glob means only those tools are available — no Edit, Write, or Bash.',
    },
    {
      question: 'How do you start an agent teams session?',
      options: ['claude --spawn-team', 'claude --agent-teams', 'claude --parallel-agents', '/agents --team-mode'],
      correctIndex: 1,
      explanation: 'claude --agent-teams spawns a team with a lead agent (orchestrator) and specialist teammates that work in parallel.',
    },
    {
      question: 'What does disable-model-invocation: true do in agent frontmatter?',
      options: [
        'Disables the AI model for the agent',
        'Prevents Claude from auto-delegating to this agent',
        'Makes the agent run without a model',
        'Turns off model-based responses',
      ],
      correctIndex: 1,
      explanation: 'disable-model-invocation: true means only the user can invoke this agent explicitly — Claude will not auto-delegate to it.',
    },
    {
      question: 'Which frontmatter field controls what AI model the agent uses?',
      options: ['engine', 'model', 'llm', 'ai-model'],
      correctIndex: 1,
      explanation: 'The model field accepts opus, sonnet, or haiku to control which AI model the agent runs.',
    },
    {
      question: 'What tool pattern allows an agent to run only npm commands?',
      options: ['Bash(*npm*)', 'Bash(npm *)', 'Shell(npm)', 'Command(npm)'],
      correctIndex: 1,
      explanation: 'Use Bash(npm *) to allow only npm commands. The pattern matches Bash tool calls starting with "npm".',
    },
    {
      question: 'In an agent team, what does the "lead agent" do?',
      options: [
        'Writes all the code',
        'Orchestrates work, breaks tasks into subtasks, assigns to teammates',
        'Only runs tests',
        'Manages git branches',
      ],
      correctIndex: 1,
      explanation: 'The lead agent coordinates: it breaks the task into subtasks, assigns them to specialist teammates, and integrates results.',
    },
    {
      question: 'How do you invoke a custom agent explicitly?',
      options: ['Type its name', 'Use /<agent-name>', 'Run claude agent <name>', 'Prefix prompt with @agent'],
      correctIndex: 1,
      explanation: 'Custom agents are invocable as slash commands: /<agent-name> followed by optional arguments.',
    },
    {
      question: 'What is the best context mode for a code reviewer agent?',
      options: ['fork — it needs isolation', 'inherit — it needs to see the conversation context', 'Neither — use default', 'Both — set context: hybrid'],
      correctIndex: 1,
      explanation: 'Code reviewers benefit from inherit mode — they can see what was discussed and what changes were made in the conversation.',
    },
  ],

  // Lesson 9: Slash Commands
  9: [
    {
      question: 'What command summarizes your conversation to free up context space?',
      options: ['/clear', '/compact', '/reset', '/summarize'],
      correctIndex: 1,
      explanation: '/compact summarizes the conversation history to free up context space while preserving key information.',
    },
    {
      question: 'What is the difference between /compact and /clear?',
      options: [
        'They do the same thing',
        '/compact summarizes and preserves info; /clear resets context completely',
        '/compact is for files; /clear is for conversation',
        '/clear is faster than /compact',
      ],
      correctIndex: 1,
      explanation: '/compact compresses the conversation while keeping key info. /clear resets context completely — use it between unrelated tasks.',
    },
    {
      question: 'Where do custom slash command (skill) files live?',
      options: ['.claude/commands/', '.claude/skills/', '.claude/slash/', '.claude/custom/'],
      correctIndex: 1,
      explanation: 'Custom slash commands are skills defined in .claude/skills/<name>/SKILL.md files.',
    },
    {
      question: 'How do you pass arguments to a custom slash command?',
      options: ['/command key=value', 'Use $ARGUMENTS or $0 $1 $2 in SKILL.md', 'Add argument-hint: in frontmatter', 'Set args: [] in the skills config'],
      correctIndex: 1,
      explanation: '$ARGUMENTS captures all arguments. $0, $1, $2 capture positional arguments. Usage: /migrate-component Button React Vue.',
    },
    {
      question: 'What frontmatter field prevents Claude from auto-invoking a custom command?',
      options: ['manual-only: true', 'disable-model-invocation: true', 'user-only: true', 'no-auto: true'],
      correctIndex: 1,
      explanation: 'disable-model-invocation: true ensures only the user can trigger the command — Claude will not auto-invoke it.',
    },
    {
      question: 'What does /cost show?',
      options: ['Estimated monthly bill', 'Token usage and costs for the current session', 'Price list for all models', 'Cost comparison between models'],
      correctIndex: 1,
      explanation: '/cost shows token usage and costs for the current session.',
    },
    {
      question: 'How do you resume the most recent Claude Code session?',
      options: ['/resume', '/continue', '/last', '/restore'],
      correctIndex: 1,
      explanation: '/continue resumes the most recent session. /resume lets you switch to any previous session by name.',
    },
    {
      question: 'What frontmatter field provides a usage hint for command arguments?',
      options: ['usage', 'argument-hint', 'args-help', 'params'],
      correctIndex: 1,
      explanation: 'argument-hint shows users what parameters are expected, e.g., argument-hint: "<component> <from> <to>".',
    },
    {
      question: 'When should you run /compact?',
      options: ['After every message', 'Proactively before context gets full', 'Only when you get an error', 'At the end of every session'],
      correctIndex: 1,
      explanation: 'Run /compact proactively before context gets full. A compacted conversation performs better than one hitting the context limit.',
    },
    {
      question: 'How are custom skills organized for complex projects?',
      options: ['All in one SKILL.md file', 'In subdirectories under .claude/skills/', 'In package.json scripts', 'In a COMMANDS.md file'],
      correctIndex: 1,
      explanation: 'Organize skills in subdirectories: .claude/skills/deploy/SKILL.md, .claude/skills/testing/unit/SKILL.md, etc.',
    },
  ],

  // Lesson 10: Hooks & Automation
  10: [
    {
      question: 'What makes hooks different from CLAUDE.md instructions?',
      options: [
        'Hooks are faster',
        'Hooks are deterministic — they guarantee an action happens',
        'Hooks use AI; CLAUDE.md does not',
        'CLAUDE.md is deterministic; hooks are advisory',
      ],
      correctIndex: 1,
      explanation: 'Unlike CLAUDE.md (advisory — Claude may not always follow), hooks are deterministic — they guarantee the specified action happens at the lifecycle event.',
    },
    {
      question: 'Which hook event fires BEFORE Claude uses a tool?',
      options: ['PostToolUse', 'UserPromptSubmit', 'PreToolUse', 'SessionStart'],
      correctIndex: 2,
      explanation: 'PreToolUse fires before Claude uses a tool and can block the action with exit code 2.',
    },
    {
      question: 'What does a matcher of "Edit|Write" mean?',
      options: [
        'Run for Edit AND Write simultaneously',
        'Run when either the Edit OR Write tool is used',
        'Run for a tool named "Edit|Write"',
        'Run for all tools except Edit and Write',
      ],
      correctIndex: 1,
      explanation: 'Pipe (|) means OR — the hook runs when either the Edit or Write tool is being used.',
    },
    {
      question: 'How do you make a hook run only for specific Bash commands?',
      options: [
        'Use a regex matcher',
        'Use the "if" field with a pattern like Bash(git *)',
        'Parse stdin in the hook script',
        'Create separate hooks for each command',
      ],
      correctIndex: 1,
      explanation: 'The "if" field enables conditional execution — "if": "Bash(git *)" runs only for git commands, not all Bash calls.',
    },
    {
      question: 'What exit code should a PreToolUse hook return to ALLOW the action?',
      options: ['1', '2', '0', '255'],
      correctIndex: 2,
      explanation: 'Exit 0 allows the action. Exit 2 blocks it. This is how you create file protection and quality gates.',
    },
    {
      question: 'Where do you configure hooks that apply to ALL your projects?',
      options: ['.claude/settings.json', '~/.claude/settings.json', '.claude/settings.local.json', '/etc/claude/hooks.json'],
      correctIndex: 1,
      explanation: 'User-level hooks in ~/.claude/settings.json apply to all your projects. Project-level settings apply to one project.',
    },
    {
      question: 'What command shows all configured hooks and their sources?',
      options: ['/config hooks', '/hooks', '/settings hooks', '/show-hooks'],
      correctIndex: 1,
      explanation: '/hooks lists all events with hook counts. Select an event to see hook details and which settings file they come from.',
    },
    {
      question: 'How do you debug hook execution issues?',
      options: ['/hooks debug', 'claude --debug', 'Set debug: true in hooks config', '/config --verbose'],
      correctIndex: 1,
      explanation: 'Run claude --debug to see which hooks matched, their exit codes, and output in real-time.',
    },
    {
      question: 'What hook event is ideal for desktop notifications when Claude needs input?',
      options: ['Stop', 'UserPromptSubmit', 'Notification', 'PermissionRequest'],
      correctIndex: 2,
      explanation: 'The Notification event fires when Claude needs your attention — perfect for triggering desktop notifications.',
    },
    {
      question: 'Which hook configuration auto-formats files after Claude edits them?',
      options: [
        'PreToolUse on Edit with Prettier',
        'PostToolUse on Edit|Write with Prettier',
        'Stop with Prettier',
        'SessionEnd with Prettier',
      ],
      correctIndex: 1,
      explanation: 'A PostToolUse hook matching "Edit|Write" that runs Prettier will auto-format every file Claude modifies.',
    },
  ],

  // Lesson 11: Mobile/Remote Control
  11: [
    {
      question: 'Where does Claude actually run when using Remote Control?',
      options: ['On Anthropic\'s servers', 'On your local machine', 'On your phone', 'In the cloud'],
      correctIndex: 1,
      explanation: 'Claude runs entirely on your local machine. Remote Control is just a window into that session — nothing is uploaded.',
    },
    {
      question: 'What command starts a dedicated remote control server?',
      options: ['claude --remote', 'claude remote-control', 'claude --server', 'claude serve'],
      correctIndex: 1,
      explanation: 'claude remote-control starts a dedicated server that waits for remote connections, showing a session URL and QR code.',
    },
    {
      question: 'How do you add remote access to an already-running session?',
      options: ['Restart with --remote-control', '/remote-control', 'Run claude remote in another terminal', '/share-session'],
      correctIndex: 1,
      explanation: '/remote-control converts the current active session to a Remote Control session without restarting.',
    },
    {
      question: 'What authentication does Remote Control require?',
      options: ['API key only', 'A claude.ai subscription (not just API key)', 'No authentication', 'GitHub OAuth'],
      correctIndex: 1,
      explanation: 'Remote Control requires a claude.ai subscription. Use claude /login to authenticate — API keys alone are not sufficient.',
    },
    {
      question: 'How do you connect from your phone?',
      options: ['Enter the URL manually', 'Scan the QR code shown in terminal', 'Use Bluetooth pairing', 'Send a magic link via email'],
      correctIndex: 1,
      explanation: 'Scan the QR code shown in the terminal (press spacebar to toggle it), or find the session by name in the claude.ai/code session list.',
    },
    {
      question: 'What does the --spawn worktree flag do in server mode?',
      options: ['Creates one worktree for the server', 'Each remote connection gets its own worktree', 'Spawns a new process for each connection', 'Creates a worktree in the cloud'],
      correctIndex: 1,
      explanation: '--spawn worktree gives each incoming remote connection its own isolated worktree, enabling multiple users or tasks.',
    },
    {
      question: 'How is Remote Control traffic secured?',
      options: ['No encryption', 'SSH tunnel', 'Encrypted TLS through the Anthropic API', 'VPN required'],
      correctIndex: 2,
      explanation: 'All traffic is encrypted with TLS through the Anthropic API. Credentials are short-lived and scoped to a single purpose.',
    },
    {
      question: 'What command shows a QR code to download the Claude mobile app?',
      options: ['/download', '/mobile', '/app', '/install'],
      correctIndex: 1,
      explanation: '/mobile displays a download QR code for the Claude mobile app (iOS and Android).',
    },
    {
      question: 'What happens during an extended network outage (>10 min)?',
      options: ['Session continues normally', 'The session times out', 'Changes are lost', 'The server crashes'],
      correctIndex: 1,
      explanation: 'Short interruptions auto-reconnect, but extended outages (>10 min) time out the session.',
    },
    {
      question: 'How do you enable Remote Control for every session automatically?',
      options: ['Set REMOTE=true in .env', '/config → Enable Remote Control for all sessions', 'Add --remote-control to shell alias', 'Edit ~/.claude/remote.json'],
      correctIndex: 1,
      explanation: 'Run /config and enable "Remote Control for all sessions" — every interactive session automatically becomes accessible remotely.',
    },
  ],

  // Lesson 12: Advanced Mastery
  12: [
    {
      question: 'What is the Writer/Reviewer loop pattern?',
      options: [
        'Write code and review it yourself',
        'Use two separate sessions — one writes code, another reviews it',
        'Write documentation while coding',
        'Alternate between writing and testing',
      ],
      correctIndex: 1,
      explanation: 'Two sessions: Session A writes code, Session B reviews it. The reviewer catches more issues because it is not biased by having written the code.',
    },
    {
      question: 'What does /batch do?',
      options: [
        'Runs multiple commands in sequence',
        'Automatically parallelizes large-scale tasks across many files with isolated agents',
        'Batches API calls for lower cost',
        'Queues tasks for later execution',
      ],
      correctIndex: 1,
      explanation: '/batch researches the codebase, plans the work, decomposes into units, and executes in parallel with isolated agents in worktrees.',
    },
    {
      question: 'How much cost savings does the multi-model strategy typically achieve?',
      options: ['10%', '25%', '~40%', '80%'],
      correctIndex: 2,
      explanation: 'Using Opus for planning, Sonnet for implementation, and Haiku for simple tasks reduces costs by approximately 40% compared to all-Opus.',
    },
    {
      question: 'How do you name a session for later resumption?',
      options: ['claude --name "my-task"', 'claude -n "my-task"', '/name my-task', 'claude --session my-task'],
      correctIndex: 1,
      explanation: 'Use claude -n "name" to start a named session. Resume it later with claude --resume name.',
    },
    {
      question: 'How do you resume a named session?',
      options: ['claude -n "name"', 'claude --resume name', 'claude --continue name', '/open name'],
      correctIndex: 1,
      explanation: 'claude --resume <name> picks up where you left off with full context, file changes, and session state preserved.',
    },
    {
      question: 'What is the fan-out pattern used for?',
      options: [
        'Distributing load across servers',
        'Processing many files in parallel with independent Claude invocations',
        'Fanning out search results',
        'Creating multiple branches',
      ],
      correctIndex: 1,
      explanation: 'Fan-out loops through files in parallel, each getting its own Claude invocation with limited tool access for safety.',
    },
    {
      question: 'In a staged validation pipeline, what prevents bad code from being committed?',
      options: [
        'Code review',
        'PreToolUse lint hooks + Stop test hooks at every stage',
        'Manual QA',
        'Branch protection rules',
      ],
      correctIndex: 1,
      explanation: 'Combining PreToolUse hooks (lint before commit) with Stop hooks (tests after every response) creates an unbreakable quality pipeline.',
    },
    {
      question: 'What is the human-in-the-loop pattern for high-stakes changes?',
      options: [
        'Always work in normal mode',
        'Plan in plan mode first, review, then implement in normal mode',
        'Use only Haiku for low risk',
        'Require two approvals',
      ],
      correctIndex: 1,
      explanation: 'Start in plan mode (read-only), review the plan, then switch to normal mode for implementation. Human stays in the loop for critical decisions.',
    },
    {
      question: 'Which combination represents the recommended multi-model workflow order?',
      options: [
        'Haiku plans → Opus implements → Sonnet reviews',
        'Opus plans → Sonnet implements → Haiku tests → Opus reviews',
        'Sonnet for everything',
        'Haiku for everything, Opus only for emergencies',
      ],
      correctIndex: 1,
      explanation: 'Opus (best) for architecture planning, Sonnet for standard implementation, Haiku (cheapest) for routine tests, Opus for critical final review.',
    },
    {
      question: 'What is the key insight behind combining all Claude Code techniques?',
      options: [
        'Each technique works best alone',
        'Techniques compound — parallel agents + verification hooks + custom commands + smart routing = 10x',
        'Only advanced users should combine techniques',
        'Combining techniques is risky',
      ],
      correctIndex: 1,
      explanation: 'The real power comes from combining techniques. Parallel agents, verification hooks, custom commands, and smart model routing create workflows that are genuinely 10x faster.',
    },
  ],
};

export const finalTest: QuizQuestion[] = [
  // 20 situational questions — harder, higher-stakes escalations spanning all 20 lessons
  {
    question: 'A production outage at 6 PM requires simultaneous fixes to the auth service, payment gateway, and notification system. All three share a PostgreSQL connection pool. You have 45 minutes before the SLA breach. How do you parallelize without the shared connection pool creating race conditions?',
    options: ['Run all 3 fixes in one session sequentially', 'Create 3 worktrees but coordinate through a shared CLAUDE.md that documents the connection pool constraint — each worktree tests independently before merge', 'Just fix the most critical one first', 'Use Agent Teams with all 3 in one worktree'],
    correctIndex: 1,
    explanation: '3 worktrees give isolation, but the shared connection pool requires coordination. Document the constraint in CLAUDE.md so each worktree knows the limit. Each tests independently before merge to avoid runtime conflicts.',
  },
  {
    question: 'Your CTO asks you to plan a migration from a monolith to 4 microservices. The plan will take 3 weeks to execute. A flawed plan wastes 60 engineering-days. Which model and effort level for the planning phase?',
    options: ['Haiku + /effort low — save money on planning', 'Sonnet + /effort medium — balanced', 'Opus + /effort max — architecture is the highest-leverage phase where mistakes are costliest', 'Any model — planning doesn\'t affect execution quality'],
    correctIndex: 2,
    explanation: 'Planning is where model quality matters most. A flawed 3-week plan wastes 60 engineering-days of downstream work. Opus + max effort gives the deepest reasoning for complex architectural trade-offs.',
  },
  { question: 'Three developers have conflicting CLAUDE.md preferences: semicolons vs no-semicolons vs tabs. The team agreed on semicolons + spaces. The tabs developer insists their setup is broken. What architecture keeps everyone productive?', options: ['Everyone uses the same CLAUDE.md', 'Team rules in ./CLAUDE.md (semicolons + spaces). Personal preferences in ./CLAUDE.local.md (gitignored). The tabs dev puts their preference in their .local file — Claude follows team rules but acknowledges their preference for personal-only contexts.', 'Three separate CLAUDE.md files', 'Let each developer override the team file'], correctIndex: 1, explanation: 'CLAUDE.md holds team rules (checked into git). CLAUDE.local.md holds personal preferences (gitignored). Both are loaded — team rules apply to shared code, personal preferences apply to individual workflows.' },
  { question: 'You voice-dictated a 2-minute architecture description for a real-time dashboard. Claude built it, all 47 tests pass, but the WebSocket connection drops after exactly 30 seconds of inactivity. No test covers this. What failed in your verification approach?', options: ['Voice dictation was too detailed', 'The test suite only covers happy paths — no test for idle timeout behavior. You need a test that holds a connection idle for 31+ seconds.', 'Claude doesn\'t understand WebSockets', 'You should have typed instead of speaking'], correctIndex: 1, explanation: 'Passing tests doesn\'t mean the feature works. The 30-second idle timeout is an edge case not covered by happy-path tests. Verification needs to include realistic usage patterns, not just function calls.' },
  { question: 'Your team is using /batch to rewrite 500 test files from Jest to Vitest. Estimated cost: $800 with Opus. Budget: $200. Design the multi-model batch strategy.', options: ['Cancel the migration — too expensive', 'Use Haiku for all 500 migration agents (routine transforms) + one Opus agent for a final quality review pass. Haiku at ~$40 + Opus review at ~$15 ≈ $55 total.', 'Use Sonnet for everything — middle option', 'Do 100 files manually, /batch the rest'], correctIndex: 1, explanation: 'Jest-to-Vitest migration is routine pattern replacement — Haiku handles it at 1/19th the cost. One Opus review pass catches anything Haiku missed. Total: ~$55 vs $800.' },
  { question: 'You need a security audit, performance profiling, and accessibility check on a PR. The agents need to share findings — a security fix might hurt performance. Subagents can\'t talk to each other. What architecture gives you cross-concern collaboration?', options: ['Three subagents reporting independently to you', 'Agent Teams — teammates can message each other directly about cross-cutting concerns like security-performance tradeoffs', 'One agent doing all three checks', '/batch with 3 agents'], correctIndex: 1, explanation: 'Agent Teams provide inter-agent messaging. The security teammate can tell the performance teammate "this fix adds latency" and they can negotiate a solution — impossible with subagents or /batch.' },
  { question: 'Your /deploy skill passed lint, tests, and build. But it deployed to staging instead of production — someone changed an env var. A PreToolUse hook didn\'t catch it. What safety system would prevent this?', options: ['Add a confirmation prompt to the skill', 'The /deploy SKILL.md should read and verify the DEPLOY_TARGET env var before deploying. Add a PreToolUse hook on Bash(deploy*) that checks the target matches "production" explicitly — exit code 2 to block if wrong.', 'Remove the env var approach entirely', 'Only deploy manually from now on'], correctIndex: 1, explanation: 'Defense in depth: the skill verifies the target, AND a hook independently validates it. Two layers catch what one misses. The skill reads the env var; the hook blocks the deploy command if the target is wrong.' },
  { question: 'Saturday. 500 errors spike on /api/checkout. The on-call engineer is on a flight with only a phone. Design the end-to-end system that handles this.', options: ['Wait until the engineer lands', 'Monitoring channel pushes the Sentry alert → Claude\'s running session receives it → Claude investigates and creates a fix → Remote Control lets the engineer review and approve from the Claude mobile app → /deploy ships the fix', 'Send an email and hope for the best', 'Auto-deploy without review'], correctIndex: 1, explanation: 'Channels push the alert. Claude investigates autonomously. Remote Control + mobile app lets the on-call engineer review from their phone. /deploy ships it. No laptop needed.' },
  { question: 'You need to refactor authentication across 3 repos (frontend, backend, shared lib). Each has different maintainers who need to approve. Local plan mode can\'t see all 3. What combination of features?', options: ['Ultraplan + --add-dir for multi-repo visibility, then Agent Teams with one teammate per repo, each creating a PR for their repo\'s maintainer to approve', 'Plan in each repo separately', 'One giant PR across all repos', 'Manual coordination via Slack'], correctIndex: 0, explanation: 'Ultraplan gives cloud-based planning with bigger context. --add-dir loads all 3 repos. Agent Teams let each teammate own one repo. Each creates a separate PR for that repo\'s maintainers.' },
  { question: 'You\'ve been debugging a performance issue for 40 minutes. Context is at 85%. Claude keeps recycling ideas. You have 2 good changes from 20 minutes ago. What\'s your exact sequence?', options: ['/clear and start over (loses the good changes)', '/rewind to the checkpoint from 20 minutes ago (preserves the 2 good changes, discards the failed debugging), then start a fresh debugging approach with a more specific prompt', 'Keep pushing — Claude will figure it out', '"Undo everything since 20 minutes ago" (imprecise)'], correctIndex: 1, explanation: '/rewind to before the failed debugging preserves your 2 good changes. Starting fresh from that checkpoint with a better prompt avoids the cluttered context that caused recycled suggestions.' },
  { question: 'Your macOS app looks perfect in dev but the onboarding wizard crashes with VoiceOver enabled (accessibility). The crash only happens with specific system settings. How do you use Computer Use to reproduce this?', options: ['You can\'t test accessibility with Computer Use', 'Enable Computer Use via /mcp → open System Settings → enable VoiceOver and larger text → launch your app → Claude sees the crash on screen and can debug the accessibility-specific code path', 'Just read the crash logs', 'Use the Chrome extension'], correctIndex: 1, explanation: 'Computer Use can interact with System Settings to change accessibility options, then launch your app and see the crash. It tests the actual user experience, not just code paths.' },
  { question: 'Your infrastructure has 4 systems: Slack, Sentry, Datadog, Jira. Which should be MCP tools (Claude pulls) and which should be channels (system pushes)?', options: ['All MCP tools', 'Slack and Jira as MCP tools (on-demand read/write). Sentry and Datadog as channels (push alerts automatically when errors or metrics cross thresholds).', 'All channels', 'Doesn\'t matter — they\'re the same'], correctIndex: 1, explanation: 'Slack and Jira are interactive — Claude reads and writes on demand. Sentry and Datadog are monitoring — alerts should push automatically without waiting for Claude to poll.' },
  { question: 'Claude deleted your production migration file. CLAUDE.md said "never modify migrations." Claude explained: "it had a syntax error so I regenerated it." Data is gone. What safety system prevents this?', options: ['A stronger CLAUDE.md rule', 'CLAUDE.md rule ("never modify migrations") + a PreToolUse hook on Edit|Write that checks if the file path matches */migrations/* — exit code 2 to block. CLAUDE.md is advisory; hooks are deterministic.', 'Better backups', 'Don\'t use Claude for database work'], correctIndex: 1, explanation: 'CLAUDE.md is advisory — Claude can rationalize breaking it. A PreToolUse hook with exit code 2 is deterministic — it physically prevents the edit. Defense in depth: rule + hook.' },
  { question: 'You\'re building a payment system with 5 parallel worktrees. The webhook agent discovers it needs a Stripe config that the Stripe agent just changed. Cross-worktree dependency discovered mid-run. Resolution?', options: ['Restart both worktrees from scratch', 'The Stripe agent commits its config changes. The webhook agent pulls that specific commit into its worktree (git cherry-pick). Both continue independently without losing work.', 'Merge everything immediately', 'Abandon parallel work'], correctIndex: 1, explanation: 'Cherry-pick the specific config commit from the Stripe worktree into the webhook worktree. Both agents keep their existing work. No restart needed — just a targeted dependency resolution.' },
  { question: 'You have 15 independent file format conversions. Your teammate says "use Agent Teams." You disagree. Why is /batch better, and when WOULD Agent Teams be right?', options: ['/batch is always better', '/batch is better because these are independent tasks — no cross-talk needed. Agent Teams add coordination overhead for zero benefit. Agent Teams would be right if the tasks SHARED dependencies or needed to discuss findings.', 'Agent Teams are always better for parallel work', 'Neither — do them sequentially'], correctIndex: 1, explanation: '/batch runs independent tasks in isolated worktrees with no coordination overhead. Agent Teams add messaging and task management that\'s wasted on truly independent work. Teams shine when agents need to communicate.' },
  { question: 'Monthly Claude bill: code-reviewer $300 (Opus), test-writer $250 (Opus), linter $150 (Opus), docs $100 (Opus). Total $800. Target: $300. Assign models.', options: ['Everything on Haiku', 'Code-reviewer stays on Opus ($300) — security-critical. Test-writer to Haiku ($13) — routine. Linter to Haiku ($8) — mechanical. Docs to Haiku ($5) — templated. Total ≈ $326.', 'Everything on Sonnet', 'Cut code-reviewer to save the most money'], correctIndex: 1, explanation: 'Security review needs the best model — keep Opus. Tests, linting, and docs are routine pattern-matching — Haiku handles them at 1/19th the cost. This preserves quality where it matters and cuts cost where it doesn\'t.' },
  { question: 'A junior dev created /reset-db that drops all tables. A sales engineer typed it during a demo. Production wiped. Design the complete prevention system.', options: ['Delete the skill and use manual commands', 'SKILL.md: add disable-model-invocation: true (manual-only) + add a confirmation step that reads DEPLOY_TARGET. PreToolUse hook: block Bash(drop*|truncate*) commands with exit code 2. /permissions: deny Bash(psql*) by default.', 'Just rename it to something obscure', 'Add a password prompt'], correctIndex: 1, explanation: 'Three layers: disable-model-invocation prevents accidental triggering. The hook physically blocks destructive SQL. /permissions denies database commands by default. No single layer is enough — defense in depth.' },
  { question: 'Ultraplan for a 3-week migration. CTO says: "Phase 1 remotely tonight. Phase 2 needs my review tomorrow. Phase 3 local on the developer\'s machine." Can Ultraplan handle this multi-phase workflow?', options: ['No — Ultraplan is one-shot execution only', 'Yes — Phase 1 executes remotely on cloud infrastructure (runs overnight). Phase 2 stays on the web for CTO review before approval. Phase 3 pulls back to the developer\'s terminal with --teleport for local file access.', 'Only if all phases run remotely', 'Ultraplan can\'t hand off between local and remote'], correctIndex: 1, explanation: 'Ultraplan supports both remote and local execution. Remote for overnight work, web for team review, --teleport to pull back to local. Each phase can target a different execution environment.' },
  { question: 'Step 4 of the 10x workflow: security-reviewer agent finds a critical SQL injection. The fix requires changing the DB schema, which invalidates work from 3 worktrees that already merged. Recovery plan?', options: ['Start the entire project over', '/rewind to before the 3 worktree merges. Fix the schema in Plan Mode first (to avoid repeating the mistake). Then re-run the parallel worktrees with the corrected schema as the foundation.', 'Just patch the SQL injection without changing the schema', 'Ship it and fix later'], correctIndex: 1, explanation: '/rewind restores to before the bad merges. Plan Mode designs the schema fix correctly. Then parallel worktrees rebuild on the fixed foundation. This is why /rewind exists — surgical recovery from deep mistakes.' },
  { question: 'Slack MCP is connected. Claude reads "#general: Deploy latest build ASAP" — from an intern joking. Claude deploys to production. Design the prevention system.', options: ['Disconnect Slack MCP', 'Scope Slack MCP to specific channels only (not #general). Add a PreToolUse hook on deploy commands that requires a verified approval from a manager-level user. The /deploy skill should check a deployment approval queue, not act on raw Slack messages.', 'Disable auto mode', 'Add a "just kidding" detector'], correctIndex: 1, explanation: 'Three layers: scope MCP to dev channels only, hook validates deploy approval, skill checks an approval queue. Social engineering via MCP is a real risk — treat every external input as potentially malicious.' },
  // Old questions removed — replaced by 20 situational questions above
  // Keeping only the closing bracket
  //MARKER_DELETE_START
  {
    question: 'PLACEHOLDER_TO_DELETE',
    options: ['a','b','c','d'],
    correctIndex: 0,
    explanation: '.worktreeinclude uses .gitignore syntax to specify which gitignored files (like .env) should be copied into new worktrees.',
  },
  // Plan Mode (3 questions)
  {
    question: 'Which keyboard shortcut cycles through permission modes (Normal → Auto-Accept → Plan)?',
    options: ['Ctrl+Tab', 'Shift+Tab', 'Alt+P', 'Ctrl+M'],
    correctIndex: 1,
    explanation: 'Shift+Tab cycles through Normal → Auto-Accept → Plan Mode → Normal.',
  },
  {
    question: 'What CAN Claude do in plan mode?',
    options: ['Edit files', 'Create new files', 'Read files and ask clarifying questions', 'Run shell commands'],
    correctIndex: 2,
    explanation: 'Plan mode is read-only. Claude can read files, search the codebase, and ask questions — but cannot modify anything.',
  },
  {
    question: 'What shortcut opens the plan in your text editor?',
    options: ['Ctrl+E', 'Ctrl+G', 'Ctrl+P', 'Ctrl+O'],
    correctIndex: 1,
    explanation: 'Ctrl+G opens the current plan in your text editor for direct editing.',
  },
  // CLAUDE.md (3 questions)
  {
    question: 'What is the recommended maximum length for CLAUDE.md?',
    options: ['50 lines', '100 lines', '200 lines', 'No limit'],
    correctIndex: 2,
    explanation: 'Target under 200 lines. Longer files lose adherence because instructions get lost in noise.',
  },
  {
    question: 'What syntax imports another file from CLAUDE.md?',
    options: ['!@path/to/file', '@path/to/file', '<<path/to/file>>', '#import path/to/file'],
    correctIndex: 1,
    explanation: '@path/to/file imports are expanded at startup, with max 5 levels of nesting.',
  },
  {
    question: 'Which command auto-generates a CLAUDE.md for your project?',
    options: ['/setup', '/init', '/generate', '/create'],
    correctIndex: 1,
    explanation: '/init analyzes your codebase and creates a CLAUDE.md with detected conventions and build commands.',
  },
  // Git Worktrees (2 questions)
  {
    question: 'What do all git worktrees in a repository share?',
    options: ['The same branch', 'The same working files', 'The .git object database', 'The same uncommitted changes'],
    correctIndex: 2,
    explanation: 'Worktrees share the .git object database (repository history) but each has its own files, branch, and working state.',
  },
  {
    question: 'What happens when you exit a worktree session with no changes?',
    options: ['The worktree persists', 'It is automatically deleted', 'It is converted to a branch', 'It moves to .claude/worktrees/.archived/'],
    correctIndex: 1,
    explanation: 'If no changes were made, the worktree and its branch are automatically cleaned up on exit.',
  },
  // Voice Dictation (2 questions)
  {
    question: 'What is the default push-to-talk key on macOS?',
    options: ['Cmd+Space', 'Option+Space', 'Ctrl+V', 'Shift+V'],
    correctIndex: 1,
    explanation: 'Option+Space on macOS (Alt+Space on Windows/Linux) is the default push-to-talk key.',
  },
  {
    question: 'Does Claude Code voice dictation require external tools?',
    options: ['Yes, SuperWhisper is required', 'Yes, any speech tool', 'No, it is built in using Whisper', 'Only on certain operating systems'],
    correctIndex: 2,
    explanation: 'Voice dictation is built in using Whisper — no external tools or subscriptions needed.',
  },
  // Verification Loops (3 questions)
  {
    question: 'What is "the single highest-leverage thing" you can do with Claude Code?',
    options: ['Use the most expensive model', 'Write detailed CLAUDE.md files', 'Give Claude a way to verify its own work', 'Use plan mode for everything'],
    correctIndex: 2,
    explanation: 'Giving Claude a way to verify its own work (test → fix → retest) is the highest-leverage technique.',
  },
  {
    question: 'What exit code blocks an action in a PreToolUse hook?',
    options: ['0', '1', '2', '127'],
    correctIndex: 2,
    explanation: 'Exit code 2 blocks the action. Exit 0 allows it.',
  },
  {
    question: 'What hook event runs when Claude finishes responding?',
    options: ['PostToolUse', 'SessionEnd', 'Stop', 'PostCompact'],
    correctIndex: 2,
    explanation: 'The Stop event fires when Claude finishes responding — ideal for running automatic test verification.',
  },
  // Subagents (2 questions)
  {
    question: 'What frontmatter field gives a subagent its own isolated worktree?',
    options: ['worktree: true', 'isolation: worktree', 'parallel: true', 'fork: worktree'],
    correctIndex: 1,
    explanation: 'isolation: "worktree" in agent frontmatter gives each agent its own .claude/worktrees/subagent-<name>/ directory.',
  },
  {
    question: 'Which built-in subagent is used for read-only codebase investigation?',
    options: ['Search', 'Explore', 'Reader', 'Investigate'],
    correctIndex: 1,
    explanation: 'The Explore agent is a built-in read-only investigation agent for researching and understanding the codebase.',
  },
  // Custom Agents (2 questions)
  {
    question: 'What does context: "fork" do for a custom agent?',
    options: ['Creates a git fork', 'Gives the agent a completely isolated context window', 'Forks the conversation', 'Creates a copy of settings'],
    correctIndex: 1,
    explanation: '"fork" gives the agent a completely isolated context — independent from the parent conversation.',
  },
  {
    question: 'How do you start an agent teams session?',
    options: ['claude --spawn-team', 'claude --agent-teams', '/agents --team-mode', 'claude --parallel-agents'],
    correctIndex: 1,
    explanation: 'claude --agent-teams spawns a coordinated team with a lead agent and specialist teammates.',
  },
  // Slash Commands (2 questions)
  {
    question: 'What is the difference between /compact and /clear?',
    options: [
      'They are identical',
      '/compact summarizes while preserving info; /clear resets completely',
      '/compact clears files; /clear clears conversation',
      '/clear is /compact with extra cleanup',
    ],
    correctIndex: 1,
    explanation: '/compact compresses conversation while keeping key info. /clear resets context completely for unrelated tasks.',
  },
  {
    question: 'How do custom skills accept arguments?',
    options: ['Function parameters', '$ARGUMENTS and $0 $1 $2 in SKILL.md', 'JSON input', 'Environment variables'],
    correctIndex: 1,
    explanation: '$ARGUMENTS captures all args, $0/$1/$2 capture positional args. Usage: /migrate-component Button React Vue.',
  },
  // Hooks (2 questions)
  {
    question: 'What makes hooks fundamentally different from CLAUDE.md instructions?',
    options: ['Hooks are faster', 'Hooks are deterministic — they guarantee execution', 'Hooks use AI', 'CLAUDE.md is more reliable'],
    correctIndex: 1,
    explanation: 'CLAUDE.md is advisory (Claude may not always follow). Hooks are deterministic — they guarantee the action happens.',
  },
  {
    question: 'What does a hook matcher of "Edit|Write" mean?',
    options: ['Run for Edit AND Write together', 'Run for either Edit OR Write', 'A tool named "Edit|Write"', 'Edit first, then Write'],
    correctIndex: 1,
    explanation: 'Pipe (|) means OR. The hook runs when either the Edit or Write tool is used.',
  },
  // Mobile/Remote (2 questions)
  {
    question: 'Where does code execution happen with Remote Control?',
    options: ['On Anthropic servers', 'On your local machine', 'On your phone', 'Split between local and cloud'],
    correctIndex: 1,
    explanation: 'Claude runs entirely on your local machine. Remote Control is just a remote window into that local session.',
  },
  {
    question: 'What does Remote Control require for authentication?',
    options: ['Just an API key', 'A claude.ai subscription', 'GitHub account', 'No authentication'],
    correctIndex: 1,
    explanation: 'Remote Control requires a claude.ai subscription (not just an API key). Use claude /login to authenticate.',
  },
  // Advanced (3 questions)
  {
    question: 'What cost savings does the multi-model strategy typically achieve?',
    options: ['10%', '25%', '~40%', '75%'],
    correctIndex: 2,
    explanation: 'Opus for planning + Sonnet for implementation + Haiku for tests ≈ 40% cheaper than all-Opus with maintained quality.',
  },
  {
    question: 'How do you resume a named Claude Code session?',
    options: ['claude -n "name"', 'claude --resume name', '/continue name', 'claude --open name'],
    correctIndex: 1,
    explanation: 'claude --resume <name> picks up where you left off with full context and state preserved.',
  },
  {
    question: 'What does --enable-auto-mode do?',
    options: ['Enables automatic code formatting', 'Eliminates permission prompts using safety classifiers', 'Automatically commits code', 'Enables auto-complete'],
    correctIndex: 1,
    explanation: 'Auto mode uses Anthropic-built classifiers to auto-approve safe operations and flag risky ones, eliminating most permission prompts.',
  },
  {
    question: 'What company ships 1,300 AI-generated PRs per week via Slack emoji?',
    options: ['Spotify', 'Stripe', 'Doctolib', 'NYSE'],
    correctIndex: 1,
    explanation: 'Stripe\'s "minions" — AI coding agents triggered by Slack emoji reactions — ship approximately 1,300 PRs per week.',
  },
  {
    question: 'What does /loop do in Claude Code?',
    options: ['Creates an infinite loop in code', 'Runs Claude on a local recurring interval up to 3 days', 'Loops through files in a directory', 'Repeats the last command'],
    correctIndex: 1,
    explanation: '/loop runs Claude on a local interval (e.g., /loop 5m /babysit). Great for CI monitoring, Slack feedback, and PR pruning.',
  },
];

export function getQuizForLesson(lessonId: number): QuizQuestion[] {
  return lessonQuizzes[lessonId] || [];
}
