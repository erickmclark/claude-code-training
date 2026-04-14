# Hooks reference (Part 2 of 2)

This continues from hooks-reference-part-1.md.

## Hook events (continued)

### Stop

Runs when Claude finishes responding and is about to stop the turn. Use this to validate that Claude's response meets your requirements, run post-processing, or inject final context.

Stop hooks do not support matchers and fire on every occurrence.

#### Stop input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "last_assistant_message": "I've completed the implementation..."
}
```

`stop_hook_active` is also included. If `true`, a previous Stop hook already triggered a continuation — check this to avoid infinite loops:

```bash  theme={null}
#!/bin/bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0  # Allow Claude to stop
fi
# ... rest of your hook logic
```

#### Stop decision control

Return `decision: "block"` to prevent Claude from stopping:

```json  theme={null}
{
  "decision": "block",
  "reason": "Test suite must pass before stopping",
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "additionalContext": "Run npm test to validate changes"
  }
}
```

### StopFailure

Runs when a turn ends due to an API error (rate limit, authentication failure, billing error, etc.). Matches on error type: `rate_limit`, `authentication_failed`, `billing_error`, `invalid_request`, `server_error`, `max_output_tokens`, `unknown`.

StopFailure hooks cannot block or modify the error. Exit codes and stdout are ignored. Use for observability and side effects only.

#### StopFailure input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "StopFailure",
  "error_type": "rate_limit"
}
```

### TeammateIdle

Runs when an [agent team](/en/agent-teams) teammate is about to go idle. Use this to check for incomplete work, enforce task requirements, or prevent the teammate from idling.

#### TeammateIdle input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "TeammateIdle",
  "teammate_name": "implementer",
  "team_name": "my-team"
}
```

#### TeammateIdle decision control

* **Exit code 2**: the teammate continues working and receives the stderr message as feedback
* **JSON `{"continue": false, "stopReason": "..."}`**: stops the teammate entirely

```bash  theme={null}
#!/bin/bash
INPUT=$(cat)
TEAM_NAME=$(echo "$INPUT" | jq -r '.team_name')

# Check for incomplete tasks
INCOMPLETE=$(curl -s "http://task-tracker/api/teams/$TEAM_NAME/tasks?status=open" | jq '.count')

if [ "$INCOMPLETE" -gt 0 ]; then
  echo "There are $INCOMPLETE incomplete tasks. Continue working." >&2
  exit 2
fi

exit 0
```

### Notification

Runs when Claude Code sends notifications. Matches on notification type: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`.

```json  theme={null}
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/permission-alert.sh"
          }
        ]
      },
      {
        "matcher": "idle_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/idle-notification.sh"
          }
        ]
      }
    ]
  }
}
```

#### Notification input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "Notification",
  "message": "Claude needs your permission to use Bash",
  "title": "Permission needed",
  "notification_type": "permission_prompt"
}
```

Notification hooks cannot block or modify notifications. Return `additionalContext` to add context to the conversation.

### CwdChanged

Runs when the working directory changes. Does not support matchers. Only `type: "command"` hooks are supported.

#### CwdChanged input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/my-project/subdir",
  "hook_event_name": "CwdChanged",
  "old_cwd": "/Users/my-project",
  "new_cwd": "/Users/my-project/subdir"
}
```

CwdChanged hooks have access to `CLAUDE_ENV_FILE` for setting environment variables for subsequent Bash commands. Example with direnv:

```bash  theme={null}
#!/bin/bash
direnv export bash >> "$CLAUDE_ENV_FILE"
```

CwdChanged hooks cannot block directory changes.

### FileChanged

Runs when a watched file changes on disk. The `matcher` field specifies which filenames to watch (by basename). Only `type: "command"` hooks are supported.

#### FileChanged input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/my-project",
  "hook_event_name": "FileChanged",
  "file_path": "/Users/my-project/.env",
  "change_type": "modified"
}
```

| Field         | Description                               |
| :------------ | :---------------------------------------- |
| `file_path`   | Absolute path to the changed file         |
| `change_type` | `"created"`, `"modified"`, or `"deleted"` |

FileChanged hooks have access to `CLAUDE_ENV_FILE`. Cannot block file changes.

Example watching `.env` for changes:

```json  theme={null}
{
  "hooks": {
    "FileChanged": [
      {
        "matcher": ".env",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/reload-env.sh"
          }
        ]
      }
    ]
  }
}
```

```bash  theme={null}
#!/bin/bash
# .claude/hooks/reload-env.sh

if [ -f "$CLAUDE_PROJECT_DIR/.env" ]; then
  if [ -n "$CLAUDE_ENV_FILE" ]; then
    set -a
    source "$CLAUDE_PROJECT_DIR/.env"
    set +a
    export -p >> "$CLAUDE_ENV_FILE"
  fi
fi
exit 0
```

### ConfigChange

Runs when a configuration file changes during a session. Matches on configuration source: `user_settings`, `project_settings`, `local_settings`, `policy_settings`, or `skills`.

#### ConfigChange input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "ConfigChange",
  "config_source": "project_settings"
}
```

#### ConfigChange decision control

Return `decision: "block"` to prevent the configuration change from taking effect (except `policy_settings`):

```json  theme={null}
{
  "decision": "block",
  "reason": "Configuration validation failed"
}
```

### PreCompact and PostCompact

`PreCompact` runs before context compaction; `PostCompact` runs after. Matches on what triggered compaction: `manual` or `auto`.

These hooks cannot block compaction. Exit codes are ignored; only side effects like logging matter.

#### PreCompact/PostCompact input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "PreCompact",
  "trigger": "auto"
}
```

### WorktreeCreate

Runs when a worktree is being created via `--worktree` or `isolation: "worktree"`. This hook **replaces** the default git behavior for worktree creation. Does not support matchers. Only `type: "command"` hooks are supported.

#### WorktreeCreate input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/my-project",
  "hook_event_name": "WorktreeCreate",
  "worktree_path": "/Users/my-project/.claude/worktrees/worktree-abc123"
}
```

#### WorktreeCreate decision control

The hook **must** print the path to the created worktree on stdout. Any non-zero exit code causes worktree creation to fail. For HTTP hooks, return the path in `hookSpecificOutput.worktreePath`.

```bash  theme={null}
#!/bin/bash
INPUT=$(cat)
WORKTREE_PATH=$(echo "$INPUT" | jq -r '.worktree_path')
PROJECT_DIR=$(echo "$INPUT" | jq -r '.cwd')

cd "$PROJECT_DIR"

if git worktree add "$WORKTREE_PATH"; then
  echo "$WORKTREE_PATH"
  exit 0
else
  exit 1
fi
```

### WorktreeRemove

Runs when a worktree is being removed. Does not support matchers. Only `type: "command"` hooks are supported. Failures are logged in debug mode only and do not prevent cleanup.

The hook is responsible for removing the worktree using git or your own mechanism.

#### WorktreeRemove input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/my-project",
  "hook_event_name": "WorktreeRemove",
  "worktree_path": "/Users/my-project/.claude/worktrees/worktree-abc123"
}
```

```bash  theme={null}
#!/bin/bash
INPUT=$(cat)
WORKTREE_PATH=$(echo "$INPUT" | jq -r '.worktree_path')
PROJECT_DIR=$(echo "$INPUT" | jq -r '.cwd')

cd "$PROJECT_DIR"
git worktree remove "$WORKTREE_PATH"
```

### Elicitation

Runs when an MCP server requests user input during a tool call. Matches on MCP server name.

#### Elicitation input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Elicitation",
  "server_name": "memory",
  "tool_use_id": "toolu_01ABC123...",
  "fields": [
    {
      "id": "query",
      "label": "Search query",
      "type": "text",
      "description": "What would you like to remember?"
    }
  ]
}
```

#### Elicitation decision control

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "Elicitation",
    "action": "accept",
    "content": {
      "query": "recent changes"
    }
  }
}
```

| `action` value | Effect                                         |
| :------------- | :--------------------------------------------- |
| `"accept"`     | Provides the response (include `content` map)  |
| `"decline"`    | Rejects the input                              |
| `"cancel"`     | Cancels the elicitation                        |

### ElicitationResult

Runs after a user responds to an MCP elicitation, before the response is sent back to the server. Matches on MCP server name.

#### ElicitationResult input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "ElicitationResult",
  "server_name": "memory",
  "tool_use_id": "toolu_01ABC123...",
  "fields": [...],
  "user_response": {
    "action": "accept",
    "content": {
      "query": "recent changes"
    }
  }
}
```

#### ElicitationResult decision control

Return `hookSpecificOutput` with `action` and optionally `content` to override the user's response:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "ElicitationResult",
    "action": "accept",
    "content": {
      "query": "recent changes to main"
    }
  }
}
```

### SessionEnd

Runs when a session terminates. Matches on why the session ended: `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other`. Only `type: "command"` hooks are supported.

#### SessionEnd input

```json  theme={null}
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "hook_event_name": "SessionEnd",
  "reason": "prompt_input_exit"
}
```

SessionEnd hooks cannot block session termination. Exit codes are ignored; only side effects like cleanup or logging matter.

## Advanced features

### Run hooks in the background

Set `async: true` on a command hook to run it without blocking:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/async-logger.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Async hooks:
* Do not block tool execution or the conversation
* Cannot return JSON output or make decisions
* Respect the `timeout` field
* Useful for observability: logging, metrics, alerts

### Prompt-based hooks

Prompt hooks (`type: "prompt"`) send a prompt to a Claude model for single-turn evaluation. The model returns `{"decision": "yes"}` or `{"decision": "no"}`:

```json  theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Is this command safe to run? Command: $ARGUMENTS",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

For events that support blocking (like `PreToolUse`), a `"no"` response blocks the action.

### Agent-based hooks

Agent hooks (`type: "agent"`) spawn a subagent that can use tools like Read, Grep, and Glob to verify conditions:

```json  theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify this command is safe: $ARGUMENTS. Check project files for sensitive paths.",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

The agent must respond with `{"decision": "yes"}` or `{"decision": "no"}`. Agent hooks default to 60 second timeout and up to 50 tool-use turns.

### Defer a tool call for later

In non-interactive mode (`-p`), a `PreToolUse` hook can return `permissionDecision: "defer"` to exit the process with the tool call preserved so an Agent SDK wrapper can collect input and resume:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "defer"
  }
}
```

### Persist environment variables

For `SessionStart`, `CwdChanged`, and `FileChanged` hooks, the `CLAUDE_ENV_FILE` environment variable provides a file path where you can write `export` statements that become available to subsequent Bash commands:

```bash  theme={null}
#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export MY_VAR=value' >> "$CLAUDE_ENV_FILE"
fi
```

## Environment variables

| Variable              | Description                                                                                     |
| :-------------------- | :---------------------------------------------------------------------------------------------- |
| `CLAUDE_PROJECT_DIR`  | Project root directory. Wrap in quotes to handle paths with spaces                             |
| `CLAUDE_PLUGIN_ROOT`  | Plugin installation directory (plugins only). Changes on plugin updates                        |
| `CLAUDE_PLUGIN_DATA`  | Plugin persistent data directory (plugins only). Survives plugin updates                       |
| `CLAUDE_ENV_FILE`     | File path for persisting environment variables (SessionStart, CwdChanged, FileChanged only)    |
| `CLAUDE_CODE_REMOTE`  | Set to `"true"` in remote web environments, not set in local CLI                              |

## Security considerations

* Hooks run with the same privileges as Claude Code and should be reviewed carefully before deployment
* Hooks that auto-approve permission prompts (`PermissionRequest`) should be scoped as narrowly as possible
* Use the `if` field to limit hooks to specific tool calls rather than using broad matchers
* Secrets should not be hardcoded in hook commands; use `allowedEnvVars` for HTTP hooks
* Enterprise administrators can use `allowManagedHooksOnly` to block user, project, and plugin hooks

## Related resources

* [Automate workflows with hooks](/en/hooks-guide) — practical examples and quickstart guide
* [Permissions](/en/permissions) — permission rule syntax used by the `if` field
* [Plugins](/en/plugins) — bundling hooks in plugins
* [Subagents](/en/sub-agents) — hooks in subagent frontmatter
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
