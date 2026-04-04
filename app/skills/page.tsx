import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import SkillGenerator from '@/components/SkillGenerator';
import { skillExamples, skillFields } from '@/data/skills';

export default function SkillsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Create Claude Code Skills
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Turn multi-step workflows into one-liners. Boris&apos;s rule: &ldquo;If you do something more than once a day, turn it into a skill.&rdquo;
        </p>
      </div>

      {/* Section 1: What Are Skills */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What are Skills?
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Skills are custom slash commands stored as markdown files in your project. Type <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">/your-skill-name</code> and Claude executes a predefined workflow — no need to retype complex prompts.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Each skill lives in <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">.claude/skills/&lt;name&gt;/SKILL.md</code> and is checked into git so your whole team can use them.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The Claude Code team at Anthropic has skills for cleaning up tech debt, syncing Slack context, analyzing BigQuery metrics, and committing/pushing/opening PRs — all with a single command.
          </p>
        </div>
      </section>

      {/* Section 2: Create Your First Skill */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Create Your First Skill
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">1</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Create the directory</h3>
            </div>
            <CodeBlock code="mkdir -p .claude/skills/fix-lint" language="bash" />
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">2</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Create the SKILL.md file</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Save this exact content to <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.claude/skills/fix-lint/SKILL.md</code>:
            </p>
            <CodeBlock code={`---
name: fix-lint
description: Find and fix all linting errors in the project
disable-model-invocation: true
argument-hint: "[file-pattern]"
---

Fix lint errors in the codebase:

1. Run the linter: \`npm run lint\`
2. Parse the output to identify each violation
3. For each violation, read the file and fix it
4. After fixing each file, run lint again on that file to verify
5. Once all files pass, commit with message: "fix: resolve linting errors"

If an argument is provided, only fix files matching: $ARGUMENTS`} language="markdown" />
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">3</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">Test it</h3>
            </div>
            <CodeBlock code={`# Fix all lint errors\n/fix-lint\n\n# Fix only in a specific directory\n/fix-lint src/components/`} language="bash" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              <strong>Expected:</strong> Claude runs the linter, reads each error, fixes the file, re-runs lint to verify, then commits the fixes.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Skill Anatomy */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Skill Anatomy
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {skillFields.map((f) => (
              <div key={f.field} className="p-4 flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="sm:w-48 shrink-0">
                  <code className="text-sm font-mono text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                    {f.field}
                  </code>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{f.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{f.example}</code></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: 5 Real Skills */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          5 Production-Ready Skills
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Copy these into your project. Each is a complete, tested skill used in real teams.
        </p>

        <div className="space-y-6">
          {skillExamples.map((skill) => (
            <div key={skill.name} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  /{skill.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                  {skill.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {skill.description}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Save to: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.claude/skills/{skill.name}/SKILL.md</code>
              </p>
              <CodeBlock code={skill.content} language="markdown" />
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Directory Structure */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Organize Your Skills
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <CodeBlock code={`.claude/skills/
├── fix-lint/SKILL.md        # Code quality
├── commit-push-pr/SKILL.md  # Git workflow
├── techdebt/SKILL.md        # Code quality
├── test-this/SKILL.md       # Testing
├── explain/SKILL.md         # Learning
├── deploy/SKILL.md          # DevOps
└── database/
    ├── migrate/SKILL.md     # DB migrations
    └── seed/SKILL.md        # Seed test data`} language="text" />
        </div>
      </section>

      {/* Section 6: AI Skill Generator */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Generate a Skill with AI
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Describe what you want in plain English — AI generates the complete SKILL.md for you.
        </p>
        <SkillGenerator />
      </section>

      {/* Section 7: Share with Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Share Skills with Your Team
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">1.</span>
              <span>Skills in <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.claude/skills/</code> are checked into git — commit them with your project</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">2.</span>
              <span>Your whole team can now use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/techdebt</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/deploy</code>, etc. without any setup</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">3.</span>
              <span>Add to your CLAUDE.md: &ldquo;Run /techdebt at the end of every session&rdquo; to make it a team habit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">4.</span>
              <span>Boris&apos;s team checks slash commands into git and shares them across the entire Claude Code organization</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Ready to see skills in action within a complete workflow?
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/workflow"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            See the Complete Workflow
          </Link>
          <Link
            href="/lessons/9"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
          >
            Lesson 9: Slash Commands
          </Link>
        </div>
      </div>
    </div>
  );
}
