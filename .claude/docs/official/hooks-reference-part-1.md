# Hooks reference (Part 1 of 2)

> Reference for Claude Code hook events, configuration schema, JSON input/output formats, exit codes, async hooks, HTTP hooks, prompt hooks, and MCP tool hooks.

<Tip>
  For a quickstart guide with examples, see [Automate workflows with hooks](/en/hooks-guide).
</Tip>

Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. Use this reference to look up event schemas, configuration options, JSON input/output formats, and advanced features like async hooks, HTTP hooks, and MCP tool hooks. If you're setting up hooks for the first time, start with the [guide](/en/hooks-guide) instead.

## Hook lifecycle

Hooks fire at specific points during a Claude Code session. When an event fires and a matcher matches, Claude Code passes JSON context about the event to your hook handler.

| Event                | When it fires                                                                                                                                          |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionStart`       | When a session begins or resumes                                                                                                                       |
| `UserPromptSubmit`   | When you submit a prompt, before Claude processes it                                                                                                   |
| `PreToolUse`         | Before a tool call executes. Can block it                                                                                                              |
| `PermissionRequest`  | When a permission dialog appears                                                                                                                       |
| `PermissionDenied`   | When a tool call is denied by the auto mode classifier. Return `{retry: true}` to tell the model it may retry the denied tool call                     |
| `PostToolUse`        | After a tool call succeeds                                                                                                                             |
| `PostToolUseFailure` | After a tool call fails                                                                                                                                |
| `Notification`       | When Claude Code sends a notification                                                                                                                  |
| `SubagentStart`      | When a subagent is spawned                                                                                                                             |
| `SubagentStop`       | When a subagent finishes                                                                                                                               |
| `TaskCreated`        | When a task is being created via `TaskCreate`                                                                                                          |
| `TaskCompleted`      | When a task is being marked as completed                                                                                                               |
| `Stop`               | When Claude finishes responding                                                                                                                        |
| `StopFailure`        | When the turn ends due to an API error. Output and exit code are ignored                                                                               |
| `TeammateIdle`       | When an [agent team](/en/agent-teams) teammate is about to go idle                                                                                     |
| `InstructionsLoaded` | When a CLAUDE.md or `.claude/rules/*.md` file is loaded into context. Fires at session start and when files are lazily loaded during a session         |
| `ConfigChange`       | When a configuration file changes during a session                                                                                                     |
| `CwdChanged`         | When the working directory changes, for example when Claude executes a `cd` command. Useful for reactive environment management with tools like direnv |
| `FileChanged`        | When a watched file changes on disk. The `matcher` field specifies which filenames to watch                                                            |
| `WorktreeCreate`     | When a worktree is being created via `--worktree` or `isolation: "worktree"`. Replaces default git behavior                                            |
| `WorktreeRemove`     | When a worktree is being removed, either at session exit or when a subagent finishes                                                                   |
| `PreCompact`         | Before context compaction                                                                                                                              |
| `PostCompact`        | After context compaction completes                                                                                                                     |
| `Elicitation`        | When an MCP server requests user input during a tool call                                                                                              |
| `ElicitationResult`  | After a user responds to an MCP elicitation, before the response is sent back to the server                                                            |
| `SessionEnd`         | When a session terminates                                                                                                                              |

### How a hook resolves

Example `PreToolUse` hook that blocks destructive shell commands:

```json  theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm *)",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-rm.sh"
          }
        ]
      }
    ]
  }
}
```

```bash  theme={null}
#!/bin/bash
# .claude/hooks/block-rm.sh
COMMAND=$(jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q 'rm -rf'; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Destructive command blocked by hook"
    }
  }'
else
  exit 0  # allow the command
fi
```

When Claude Code decides to run `Bash "rm -rf /tmp/build"`:

1. The `PreToolUse` event fires. Claude Code sends JSON on stdin: `{ "tool_name": "Bash", "tool_input": { "command": "rm -rf /tmp/build" }, ... }`
2. The matcher `"Bash"` matches the tool name, so this hook group activates.
3. The `if` condition `"Bash(rm *)"` matches because the command starts with `rm`, so this handler spawns.
4. The script inspects the full command, finds `rm -rf`, and prints a deny decision to stdout.
5. Claude Code reads the JSON decision, blocks the tool call, and shows Claude the reason.

## Configuration

Hooks are defined in JSON settings files with three levels of nesting:

1. Choose a hook event to respond to, like `PreToolUse` or `Stop`
2. Add a matcher group to filter when it fires, like "only for the Bash tool"
3. Define one or more hook handlers to run when matched

### Hook locations

| Location                                                   | Scope                         | Shareable                          |
| :--------------------------------------------------------- | :---------------------------- | :--------------------------------- |
| `~/.claude/settings.json`                                  | All your projects             | No, local to your machine          |
| `.claude/settings.json`                                    | Single project                | Yes, can be committed to the repo  |
| `.claude/settings.local.json`                              | Single project                | No, gitignored                     |
| Managed policy settings                                    | Organization-wide             | Yes, admin-controlled              |
| [Plugin](/en/plugins) `hooks/hooks.json`                   | When plugin is enabled        | Yes, bundled with the plugin       |
| [Skill](/en/skills) or [agent](/en/sub-agents) frontmatter | While the component is active | Yes, defined in the component file |

### Matcher patterns

The `matcher` field is a regex string that filters when hooks fire. Use `"*"`, `""`, or omit `matcher` entirely to match all occurrences.

| Event                                                                                                          | What the matcher filters                | Example matcher values                                                                                                    |
| :------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`                     | tool name                               | `Bash`, `Edit\|Write`, `mcp__.*`                                                                                          |
| `SessionStart`                                                                                                 | how the session started                 | `startup`, `resume`, `clear`, `compact`                                                                                   |
| `SessionEnd`                                                                                                   | why the session ended                   | `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other`                                  |
| `Notification`                                                                                                 | notification type                       | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`                                                  |
| `SubagentStart`, `SubagentStop`                                                                                | agent type                              | `Bash`, `Explore`, `Plan`, or custom agent names                                                                          |
| `PreCompact`, `PostCompact`                                                                                    | what triggered compaction               | `manual`, `auto`                                                                                                          |
| `ConfigChange`                                                                                                 | configuration source                    | `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`                                        |
| `FileChanged`                                                                                                  | filename (basename of the changed file) | `.envrc`, `.env`, any filename you want to watch                                                                          |
| `StopFailure`                                                                                                  | error type                              | `rate_limit`, `authentication_failed`, `billing_error`, `invalid_request`, `server_error`, `max_output_tokens`, `unknown` |
| `InstructionsLoaded`                                                                                           | load reason                             | `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`                                              |
| `Elicitation`, `ElicitationResult`                                                                             | MCP server name                         | your configured MCP server names                                                                                          |
| `UserPromptSubmit`, `Stop`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `WorktreeCreate`, `WorktreeRemove`, `CwdChanged` | no matcher support            | always fires on every occurrence                                                                                          |

#### Match MCP tools

MCP tools follow the naming pattern `mcp__<server>__<tool>`:

* `mcp__memory__create_entities`: Memory server's create entities tool
* `mcp__filesystem__read_file`: Filesystem server's read file tool
* `mcp__github__search_repositories`: GitHub server's search tool

Use regex patterns to target specific MCP tools or groups:

* `mcp__memory__.*` matches all tools from the `memory` server
* `mcp__.*__write.*` matches any tool containing "write" from any server

```json  theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      }
    ]
  }
}
```

### Hook handler fields

Four types of hook handlers:

* **Command hooks** (`type: "command"`): run a shell command
* **HTTP hooks** (`type: "http"`): send the event's JSON as an HTTP POST request
* **Prompt hooks** (`type: "prompt"`): send a prompt to a Claude model for single-turn evaluation
* **Agent hooks** (`type: "agent"`): spawn a subagent that can use tools to verify conditions

#### Common fields

| Field           | Required | Description                                                                                                                                             |
| :-------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`          | yes      | `"command"`, `"http"`, `"prompt"`, or `"agent"`                                                                                                         |
| `if`            | no       | Permission rule syntax to filter when this hook runs, such as `"Bash(git *)"` or `"Edit(*.ts)"`. Only evaluated on tool events.                        |
| `timeout`       | no       | Seconds before canceling. Defaults: 600 for command, 30 for prompt, 60 for agent                                                                        |
| `statusMessage` | no       | Custom spinner message displayed while the hook runs                                                                                                    |
| `once`          | no       | If `true`, runs only once per session then is removed. Skills only, not agents.                                                                         |

#### Command hook fields

| Field     | Required | Description                                                                    |
| :-------- | :------- | :----------------------------------------------------------------------------- |
| `command` | yes      | Shell command to execute                                                       |
| `async`   | no       | If `true`, runs in the background without blocking                             |
| `shell`   | no       | Shell to use: `"bash"` (default) or `"powershell"`                             |

#### HTTP hook fields

| Field            | Required | Description                                                                               |
| :--------------- | :------- | :---------------------------------------------------------------------------------------- |
| `url`            | yes      | URL to send the POST request to                                                           |
| `headers`        | no       | Additional HTTP headers. Values support `$VAR_NAME` interpolation                         |
| `allowedEnvVars` | no       | List of environment variable names that may be interpolated into header values            |

Claude Code sends the hook's JSON input as the POST request body with `Content-Type: application/json`. Error handling: non-2xx responses, connection failures, and timeouts produce non-blocking errors.

#### Prompt and agent hook fields

| Field    | Required | Description                                                                                 |
| :------- | :------- | :------------------------------------------------------------------------------------------ |
| `prompt` | yes      | Prompt text to send to the model. Use `$ARGUMENTS` as a placeholder for the hook input JSON |
| `model`  | no       | Model to use for evaluation. Defaults to a fast model                                       |

### Reference scripts by path

* `$CLAUDE_PROJECT_DIR`: the project root. Wrap in quotes to handle paths with spaces.
* `${CLAUDE_PLUGIN_ROOT}`: the plugin's installation directory (for plugin-bundled scripts)
* `${CLAUDE_PLUGIN_DATA}`: the plugin's persistent data directory

Example using `$CLAUDE_PROJECT_DIR`:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

### Hooks in skills and agents

Hooks can be defined directly in skills and subagents using frontmatter. These hooks are scoped to the component's lifecycle and only run when that component is active.

```yaml  theme={null}
---
name: secure-operations
description: Perform operations with security checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

For subagents, `Stop` hooks are automatically converted to `SubagentStop`.

### The `/hooks` menu

Type `/hooks` in Claude Code to open a read-only browser for your configured hooks. The menu shows every hook event with a count of configured hooks and the source file. The menu is read-only: to add, modify, or remove hooks, edit the settings JSON directly or ask Claude to make the change.

To remove a hook, delete its entry from the settings JSON file. To temporarily disable all hooks, set `"disableAllHooks": true` in your settings file.

## Hook input and output

### Common input fields

| Field             | Description                                                                                                                                             |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `session_id`      | Current session identifier                                                                                                                              |
| `transcript_path` | Path to conversation JSON                                                                                                                               |
| `cwd`             | Current working directory when the hook is invoked                                                                                                      |
| `permission_mode` | Current permission mode: `"default"`, `"plan"`, `"acceptEdits"`, `"auto"`, `"dontAsk"`, or `"bypassPermissions"`                                       |
| `hook_event_name` | Name of the event that fired                                                                                                                            |

When running with `--agent` or inside a subagent, two additional fields are included:

| Field        | Description                                                                 |
| :----------- | :-------------------------------------------------------------------------- |
| `agent_id`   | Unique identifier for the subagent                                          |
| `agent_type` | Agent name (for example, `"Explore"` or `"security-reviewer"`)              |

Example `PreToolUse` hook input for a Bash command:

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/home/user/.claude/projects/.../transcript.jsonl",
  "cwd": "/home/user/my-project",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

### Exit code output

| Exit code | Behavior                                                                                                    |
| :-------- | :---------------------------------------------------------------------------------------------------------- |
| `0`       | The action proceeds. For `UserPromptSubmit` and `SessionStart` hooks, stdout is added to Claude's context  |
| `2`       | The action is blocked. Write a reason to stderr; Claude receives it as feedback                             |
| Other     | The action proceeds. Stderr is logged but not shown to Claude                                              |

### JSON output

For more control than exit codes allow, exit 0 and print a JSON object to stdout:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

`permissionDecision` values for `PreToolUse`:

* `"allow"`: skip the interactive permission prompt
* `"deny"`: cancel the tool call and send the reason to Claude
* `"ask"`: show the permission prompt to the user as normal
* `"defer"`: in non-interactive mode (`-p`), exits the process with the tool call preserved

### Decision control summary

| Event               | How to block/deny                                                          |
| :------------------ | :------------------------------------------------------------------------- |
| `PreToolUse`        | Exit 2, or `hookSpecificOutput.permissionDecision: "deny"`                 |
| `PostToolUse`       | `decision: "block"` at top level                                           |
| `Stop`              | `decision: "block"` at top level                                           |
| `PermissionRequest` | `hookSpecificOutput.decision.behavior: "allow"` or `"deny"`                |
| `UserPromptSubmit`  | Use `additionalContext` to inject text; cannot block                       |
| `ConfigChange`      | `decision: "block"` at top level                                           |
| `TeammateIdle`      | Exit 2 to continue, or `{"continue": false, "stopReason": "..."}` to stop |

## Hook events

### SessionStart

Runs when a session begins or resumes. Matches on how the session started: `startup`, `resume`, `clear`, `compact`.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

Use stdout to inject text into Claude's context. Access `CLAUDE_ENV_FILE` to set environment variables for subsequent Bash commands:

```bash  theme={null}
#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export PROJECT_ENV=production' >> "$CLAUDE_ENV_FILE"
fi
```

### UserPromptSubmit

Runs when you submit a prompt, before Claude processes it. Does not support matchers.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "implement a user authentication system"
}
```

Use `additionalContext` in your JSON output to inject text into Claude's context before it processes the prompt. Cannot block or modify the prompt itself.

### PreToolUse

Runs before a tool call executes. Matches on tool name.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

Common tool input fields:

| Tool    | Key input fields                                 |
| :------ | :----------------------------------------------- |
| `Bash`  | `command` (string)                               |
| `Read`  | `file_path` (string)                             |
| `Write` | `file_path` (string), `content` (string)         |
| `Edit`  | `file_path` (string), `old_string`, `new_string` |
| `Glob`  | `pattern` (string), `path` (optional string)     |
| `Grep`  | `pattern` (string), `path` (optional string)     |

Exit 2 to block with a stderr message, or return JSON with `permissionDecision`:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Command not allowed in production"
  }
}
```

You can also rewrite the tool input using `updatedInput`:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "updatedInput": {
      "command": "npm test -- --coverage"
    }
  }
}
```

### PermissionRequest

Runs when a permission dialog appears. Matches on tool name.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PermissionRequest",
  "tool_name": "Bash",
  "tool_input": { "command": "rm -rf /tmp/build" },
  "request_type": "tool_use"
}
```

Return a JSON decision in `hookSpecificOutput`:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow"
    }
  }
}
```

| `behavior` value | Effect                                |
| :--------------- | :------------------------------------ |
| `"allow"`        | Auto-approve this permission request  |
| `"deny"`         | Auto-deny this permission request     |

To set a specific permission mode after approval:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedPermissions": [
        { "type": "setMode", "mode": "acceptEdits", "destination": "session" }
      ]
    }
  }
}
```

### PermissionDenied

Runs when a tool call is denied by the auto mode classifier. Matches on tool name. Return `{"retry": true}` to tell the model it may retry the denied tool call.

### PostToolUse

Runs after a tool call succeeds. Matches on tool name.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" },
  "tool_response": {
    "output": "All tests passed",
    "exit_code": 0
  }
}
```

Use `decision: "block"` to inject feedback into Claude's context:

```json  theme={null}
{
  "decision": "block",
  "reason": "Lint errors detected, please fix them"
}
```

Use `additionalContext` to add context without blocking:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Test coverage is at 87%"
  }
}
```

### PostToolUseFailure

Runs after a tool call fails. Matches on tool name. Same input schema as `PostToolUse` but `tool_response` includes error information. Cannot block or retry the failed tool call.

### SubagentStart and SubagentStop

Runs when a subagent is spawned or finishes. Matches on agent type.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "SubagentStart",
  "agent_type": "code-reviewer",
  "agent_id": "agent-xyz789"
}
```

### TaskCreated and TaskCompleted

Runs when a task is being created via `TaskCreate` or marked as completed. Do not support matchers.

### InstructionsLoaded

Runs when a CLAUDE.md or `.claude/rules/*.md` file is loaded into context. Matches on load reason: `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`.

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../transcript.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "InstructionsLoaded",
  "file_path": "/Users/my-project/CLAUDE.md",
  "load_reason": "session_start"
}
```

> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
