# Extend Claude Code

> Understand when to use CLAUDE.md, Skills, subagents, hooks, MCP, and plugins.

Claude Code combines a model that reasons about your code with built-in tools for file operations, search, execution, and web access. The built-in tools cover most coding tasks. This guide covers the extension layer: features you add to customize what Claude knows, connect it to external services, and automate workflows.

**New to Claude Code?** Start with [CLAUDE.md](/en/memory) for project conventions. Add other extensions as you need them.

## Overview

Extensions plug into different parts of the agentic loop:

* **[CLAUDE.md](/en/memory)** adds persistent context Claude sees every session
* **[Skills](/en/skills)** add reusable knowledge and invocable workflows
* **[MCP](/en/mcp)** connects Claude to external services and tools
* **[Subagents](/en/sub-agents)** run their own loops in isolated context, returning summaries
* **[Agent teams](/en/agent-teams)** coordinate multiple independent sessions with shared tasks and peer-to-peer messaging
* **[Hooks](/en/hooks)** run outside the loop entirely as deterministic scripts
* **[Plugins](/en/plugins)** and **[marketplaces](/en/plugin-marketplaces)** package and distribute these features

[Skills](/en/skills) are the most flexible extension. A skill is a markdown file containing knowledge, workflows, or instructions. You can invoke skills with a command like `/deploy`, or Claude can load them automatically when relevant. Skills can run in your current conversation or in an isolated context via subagents.

## Match features to your goal

| Feature                            | What it does                                               | When to use it                                                                  | Example                                                                         |
| ---------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **CLAUDE.md**                      | Persistent context loaded every conversation               | Project conventions, "always do X" rules                                        | "Use pnpm, not npm. Run tests before committing."                               |
| **Skill**                          | Instructions, knowledge, and workflows Claude can use      | Reusable content, reference docs, repeatable tasks                              | `/deploy` runs your deployment checklist; API docs skill with endpoint patterns |
| **Subagent**                       | Isolated execution context that returns summarized results | Context isolation, parallel tasks, specialized workers                          | Research task that reads many files but returns only key findings               |
| **[Agent teams](/en/agent-teams)** | Coordinate multiple independent Claude Code sessions       | Parallel research, new feature development, debugging with competing hypotheses | Spawn reviewers to check security, performance, and tests simultaneously        |
| **MCP**                            | Connect to external services                               | External data or actions                                                        | Query your database, post to Slack, control a browser                           |
| **Hook**                           | Deterministic script that runs on events                   | Predictable automation, no LLM involved                                         | Run ESLint after every file edit                                                |

**[Plugins](/en/plugins)** are the packaging layer. A plugin bundles skills, hooks, subagents, and MCP servers into a single installable unit. Plugin skills are namespaced (like `/my-plugin:review`) so multiple plugins can coexist. Use plugins when you want to reuse the same setup across multiple repositories or distribute to others via a **[marketplace](/en/plugin-marketplaces)**.

## Compare similar features

### Skill vs Subagent

Skills and subagents solve different problems:

* **Skills** are reusable content you can load into any context
* **Subagents** are isolated workers that run separately from your main conversation

| Aspect          | Skill                                          | Subagent                                                         |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **What it is**  | Reusable instructions, knowledge, or workflows | Isolated worker with its own context                             |
| **Key benefit** | Share content across contexts                  | Context isolation. Work happens separately, only summary returns |
| **Best for**    | Reference material, invocable workflows        | Tasks that read many files, parallel work, specialized workers   |

**Skills can be reference or action.** Reference skills provide knowledge Claude uses throughout your session (like your API style guide). Action skills tell Claude to do something specific (like `/deploy` that runs your deployment workflow).

**Use a subagent** when you need context isolation or when your context window is getting full. The subagent might read dozens of files or run extensive searches, but your main conversation only receives a summary.

**They can combine.** A subagent can preload specific skills (`skills:` field). A skill can run in isolated context using `context: fork`.

### CLAUDE.md vs Skill

| Aspect                    | CLAUDE.md                    | Skill                                   |
| ------------------------- | ---------------------------- | --------------------------------------- |
| **Loads**                 | Every session, automatically | On demand                               |
| **Can include files**     | Yes, with `@path` imports    | Yes, with `@path` imports               |
| **Can trigger workflows** | No                           | Yes, with `/<name>`                     |
| **Best for**              | "Always do X" rules          | Reference material, invocable workflows |

**Put it in CLAUDE.md** if Claude should always know it: coding conventions, build commands, project structure, "never do X" rules.

**Put it in a skill** if it's reference material Claude needs sometimes (API docs, style guides) or a workflow you trigger with `/<name>` (deploy, review, release).

**Rule of thumb:** Keep CLAUDE.md under 200 lines. If it's growing, move reference content to skills or split into [`.claude/rules/`](/en/memory#organize-rules-with-claude/rules/) files.

### CLAUDE.md vs Rules vs Skills

| Aspect       | CLAUDE.md                           | `.claude/rules/`                                   | Skill                                    |
| ------------ | ----------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| **Loads**    | Every session                       | Every session, or when matching files are opened   | On demand, when invoked or relevant      |
| **Scope**    | Whole project                       | Can be scoped to file paths                        | Task-specific                            |
| **Best for** | Core conventions and build commands | Language-specific or directory-specific guidelines | Reference material, repeatable workflows |

**Use CLAUDE.md** for instructions every session needs: build commands, test conventions, project architecture.

**Use rules** to keep CLAUDE.md focused. Rules with `paths` frontmatter only load when Claude works with matching files, saving context.

**Use skills** for content Claude only needs sometimes, like API documentation or a deployment checklist you trigger with `/<name>`.

### Subagent vs Agent team

| Aspect            | Subagent                                         | Agent team                                          |
| ----------------- | ------------------------------------------------ | --------------------------------------------------- |
| **Context**       | Own context window; results return to the caller | Own context window; fully independent               |
| **Communication** | Reports results back to the main agent only      | Teammates message each other directly               |
| **Coordination**  | Main agent manages all work                      | Shared task list with self-coordination             |
| **Best for**      | Focused tasks where only the result matters      | Complex work requiring discussion and collaboration |
| **Token cost**    | Lower: results summarized back to main context   | Higher: each teammate is a separate Claude instance |

**Use a subagent** when you need a quick, focused worker: research a question, verify a claim, review a file.

**Use an agent team** when teammates need to share findings, challenge each other, and coordinate independently. Agent teams are best for research with competing hypotheses, parallel code review, and new feature development where each teammate owns a separate piece.

**Transition point:** If you're running parallel subagents but hitting context limits, or if your subagents need to communicate with each other, agent teams are the natural next step.

<Note>
  Agent teams are experimental and disabled by default. See [agent teams](/en/agent-teams) for setup and current limitations.
</Note>

### MCP vs Skill

| Aspect         | MCP                                                  | Skill                                                   |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| **What it is** | Protocol for connecting to external services         | Knowledge, workflows, and reference material            |
| **Provides**   | Tools and data access                                | Knowledge, workflows, reference material                |
| **Examples**   | Slack integration, database queries, browser control | Code review checklist, deploy workflow, API style guide |

**MCP** gives Claude the ability to interact with external systems. Without MCP, Claude can't query your database or post to Slack.

**Skills** give Claude knowledge about how to use those tools effectively, plus workflows you can trigger with `/<name>`.

Example: An MCP server connects Claude to your database. A skill teaches Claude your data model, common query patterns, and which tables to use for different tasks.

## Understand how features layer

* **CLAUDE.md files** are additive: all levels contribute content to Claude's context simultaneously. When instructions conflict, Claude uses judgment to reconcile them.
* **Skills and subagents** override by name: when the same name exists at multiple levels, one definition wins based on priority (managed > user > project for skills). Plugin skills are namespaced to avoid conflicts.
* **MCP servers** override by name: local > project > user.
* **Hooks** merge: all registered hooks fire for their matching events regardless of source.

### Combine features

Real setups combine extensions based on your workflow.

| Pattern                | How it works                                                                     | Example                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Skill + MCP**        | MCP provides the connection; a skill teaches Claude how to use it well           | MCP connects to your database, a skill documents your schema and query patterns                   |
| **Skill + Subagent**   | A skill spawns subagents for parallel work                                       | `/audit` skill kicks off security, performance, and style subagents that work in isolated context |
| **CLAUDE.md + Skills** | CLAUDE.md holds always-on rules; skills hold reference material loaded on demand | CLAUDE.md says "follow our API conventions," a skill contains the full API style guide            |
| **Hook + MCP**         | A hook triggers external actions through MCP                                     | Post-edit hook sends a Slack notification when Claude modifies critical files                     |

## Understand context costs

Every feature you add consumes some of Claude's context. Too much can fill up your context window, or add noise that makes Claude less effective.

### Context cost by feature

| Feature         | When it loads             | What loads                                    | Context cost                                 |
| --------------- | ------------------------- | --------------------------------------------- | -------------------------------------------- |
| **CLAUDE.md**   | Session start             | Full content                                  | Every request                                |
| **Skills**      | Session start + when used | Descriptions at start, full content when used | Low (descriptions every request)*            |
| **MCP servers** | Session start             | Tool names; full schemas on demand            | Low until a tool is used                     |
| **Subagents**   | When spawned              | Fresh context with specified skills           | Isolated from main session                   |
| **Hooks**       | On trigger                | Nothing (runs externally)                     | Zero, unless hook returns additional context |

*By default, skill descriptions load at session start so Claude can decide when to use them. Set `disable-model-invocation: true` in a skill's frontmatter to hide it from Claude entirely until you invoke it manually.

### How features load

**CLAUDE.md:** Loads at session start. Full content of all CLAUDE.md files (managed, user, and project levels).

**Skills:** By default, descriptions load at session start and full content loads when used. For user-only skills (`disable-model-invocation: true`), nothing loads until you invoke them.

In subagents: skills work differently. Instead of on-demand loading, skills passed to a subagent are fully preloaded into its context at launch. Subagents don't inherit skills from the main session.

**MCP servers:** Loads at session start. Tool names from connected servers. Full JSON schemas stay deferred until Claude needs a specific tool.

**Subagents:** On demand. Fresh, isolated context containing: system prompt, full content of skills listed in the agent's `skills:` field, CLAUDE.md, and whatever context the lead agent passes.

**Hooks:** On trigger. Runs as external scripts. Zero context cost, unless the hook returns output that gets added as messages.

## Learn more

* [CLAUDE.md](/en/memory) — Store project context, conventions, and instructions
* [Skills](/en/skills) — Give Claude domain expertise and reusable workflows
* [Subagents](/en/sub-agents) — Offload work to isolated context
* [Agent teams](/en/agent-teams) — Coordinate multiple sessions working in parallel
* [MCP](/en/mcp) — Connect Claude to external services
* [Hooks](/en/hooks-guide) — Automate workflows with hooks
* [Plugins](/en/plugins) — Bundle and share feature sets
* [Marketplaces](/en/plugin-marketplaces) — Host and distribute plugin collections
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
