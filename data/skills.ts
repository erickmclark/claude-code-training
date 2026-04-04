export interface SkillExample {
  name: string;
  description: string;
  category: string;
  content: string;
}

export interface SkillField {
  field: string;
  description: string;
  example: string;
}

export const skillFields: SkillField[] = [
  { field: 'name', description: 'What you type after / to invoke the skill', example: 'fix-lint' },
  { field: 'description', description: 'When Claude can auto-delegate to this skill (if enabled)', example: 'Find and fix all linting errors' },
  { field: 'disable-model-invocation', description: 'Set to true so only YOU can trigger it — Claude won\'t auto-invoke', example: 'true' },
  { field: 'argument-hint', description: 'Shows users what parameters are expected after the command', example: '"<file-pattern>"' },
  { field: '$ARGUMENTS', description: 'In the body: captures everything typed after the command', example: '/fix-lint src/ → $ARGUMENTS = "src/"' },
  { field: '$0, $1, $2', description: 'Positional arguments split by space', example: '/migrate Button React Vue → $0="Button" $1="React" $2="Vue"' },
];

export const skillExamples: SkillExample[] = [
  {
    name: 'commit-push-pr',
    description: 'Stage changes, commit with a smart message, push, and open a PR — all in one command.',
    category: 'Git Workflow',
    content: `---
name: commit-push-pr
description: Stage changes, commit with a good message, push, and open a PR
disable-model-invocation: true
---

1. Run \`git status\` and \`git diff --staged\` to understand changes
2. Write a concise commit message summarizing the changes
3. Stage relevant files (not .env or node_modules)
4. Commit with the message
5. Push to the current branch
6. Open a PR with \`gh pr create\` using a clear title and description`,
  },
  {
    name: 'techdebt',
    description: 'Find and eliminate duplicated code, dead code, and stale TODOs. From Boris\'s team at Anthropic.',
    category: 'Code Quality',
    content: `---
name: techdebt
description: Find and eliminate duplicated code and dead code
disable-model-invocation: true
---

Scan the codebase for technical debt:

1. Find duplicated code: look for functions/blocks that appear 2+ times
2. Find dead code: functions, variables, and imports that are never used
3. Find TODO/FIXME comments older than 30 days
4. For each issue found:
   - Describe the problem
   - Suggest a fix
   - If the fix is safe, implement it
5. Run tests after each change to verify nothing breaks
6. Summarize what you found and fixed`,
  },
  {
    name: 'test-this',
    description: 'Write comprehensive tests for any file — covers happy path, edge cases, and error cases.',
    category: 'Testing',
    content: `---
name: test-this
description: Write comprehensive tests for a specific file or function
disable-model-invocation: true
argument-hint: "<file-path>"
---

Write thorough tests for: $0

1. Read the file and understand what it does
2. Identify all public functions and their edge cases
3. Write tests covering:
   - Happy path (normal inputs)
   - Edge cases (empty, null, boundary values)
   - Error cases (invalid inputs, failures)
4. Run the tests and fix any failures
5. Report coverage for the tested file`,
  },
  {
    name: 'explain',
    description: 'Explain how any file or function works in simple terms with ASCII diagrams.',
    category: 'Learning',
    content: `---
name: explain
description: Explain how a file or function works in simple terms
disable-model-invocation: true
argument-hint: "<file-path>"
---

Explain $0 in simple terms:

1. Read the file thoroughly
2. Explain what it does at a high level (1-2 sentences)
3. Walk through the code section by section:
   - What each function does
   - Why it's structured this way
   - Any patterns or techniques used
4. Draw an ASCII diagram showing data flow if helpful
5. List any gotchas or non-obvious behavior`,
  },
  {
    name: 'deploy',
    description: 'Full pre-deployment checklist: lint, test, build, push, release — abort on any failure.',
    category: 'DevOps',
    content: `---
name: deploy
description: Run full pre-deployment checks and deploy
disable-model-invocation: true
---

Deploy to production:

1. Run \`npm run lint\` — abort if any errors
2. Run \`npm test\` — abort if any failures
3. Run \`npm run build\` — abort if build fails
4. Check \`git status\` — abort if there are uncommitted changes
5. Push current branch: \`git push\`
6. Create release: \`gh release create v$(date +%Y%m%d) --generate-notes\`
7. Report: "Deployed successfully" with the release URL`,
  },
];

// Keep proficiency helpers for dashboard use
import { SkillCategory } from '@/types/lesson';

export const skillCategories: SkillCategory[] = [
  {
    id: 'parallel-workflows',
    title: 'Parallel Workflows',
    description: 'Run multiple sessions, worktrees, and subagents simultaneously.',
    skills: [
      { title: 'Parallel Execution', description: 'Run 5+ sessions', lessons: [1] },
      { title: 'Git Worktrees', description: 'Isolated parallel work', lessons: [4] },
      { title: 'Subagents', description: 'Spawn parallel agents', lessons: [7] },
    ],
  },
  {
    id: 'planning-strategy',
    title: 'Planning & Strategy',
    description: 'Design implementation plans and combine techniques.',
    skills: [
      { title: 'Plan Mode', description: 'Read-only analysis first', lessons: [2] },
      { title: 'Advanced Mastery', description: 'Combine all techniques', lessons: [12] },
    ],
  },
  {
    id: 'project-configuration',
    title: 'Project Configuration',
    description: 'Configure CLAUDE.md, custom commands, and hooks.',
    skills: [
      { title: 'CLAUDE.md', description: 'Project instructions', lessons: [3] },
      { title: 'Slash Commands', description: 'Custom workflows', lessons: [9] },
      { title: 'Hooks', description: 'Lifecycle automation', lessons: [10] },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity & Tools',
    description: 'Voice, verification, custom agents, and remote access.',
    skills: [
      { title: 'Voice Dictation', description: '3x faster input', lessons: [5] },
      { title: 'Verification Loops', description: 'Self-correcting code', lessons: [6] },
      { title: 'Custom Agents', description: 'Specialized assistants', lessons: [8] },
      { title: 'Mobile Control', description: 'Code from anywhere', lessons: [11] },
    ],
  },
];

export function getSkillProficiency(
  completedLessonIds: number[],
  category: SkillCategory
): 'Novice' | 'Practitioner' | 'Expert' {
  const allLessons = category.skills.flatMap((s) => s.lessons || []);
  const completed = allLessons.filter((id) => completedLessonIds.includes(id)).length;
  const ratio = allLessons.length > 0 ? completed / allLessons.length : 0;
  if (ratio >= 1) return 'Expert';
  if (ratio >= 0.5) return 'Practitioner';
  return 'Novice';
}
