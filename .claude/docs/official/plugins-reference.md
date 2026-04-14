# Plugins reference

> Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications.

<Tip>
  Looking to install plugins? See [Discover and install plugins](/en/discover-plugins). For creating plugins, see [Plugins](/en/plugins). For distributing plugins, see [Plugin marketplaces](/en/plugin-marketplaces).
</Tip>

This reference provides complete technical specifications for the Claude Code plugin system, including component schemas, CLI commands, and development tools.

A **plugin** is a self-contained directory of components that extends Claude Code with custom functionality. Plugin components include skills, agents, hooks, MCP servers, and LSP servers.

## Plugin components reference

### Skills

Plugins add skills to Claude Code, creating `/name` shortcuts that you or Claude can invoke.

**Location**: `skills/` or `commands/` directory in plugin root

**File format**: Skills are directories with `SKILL.md`; commands are simple markdown files

**Skill structure**:

```text  theme={null}
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

For complete details, see [Skills](/en/skills).

### Agents

Plugins can provide specialized subagents for specific tasks that Claude can invoke automatically when appropriate.

**Location**: `agents/` directory in plugin root

**File format**: Markdown files describing agent capabilities

**Agent structure**:

```markdown  theme={null}
---
name: agent-name
description: What this agent specializes in and when Claude should invoke it
model: sonnet
effort: medium
maxTurns: 20
disallowedTools: Write, Edit
---

Detailed system prompt for the agent describing its role, expertise, and behavior.
```

Plugin agents support `name`, `description`, `model`, `effort`, `maxTurns`, `tools`, `disallowedTools`, `skills`, `memory`, `background`, and `isolation` frontmatter fields. The only valid `isolation` value is `"worktree"`. For security reasons, `hooks`, `mcpServers`, and `permissionMode` are not supported for plugin-shipped agents.

For complete details, see [Subagents](/en/sub-agents).

### Hooks

Plugins can provide event handlers that respond to Claude Code events automatically.

**Location**: `hooks/hooks.json` in plugin root, or inline in plugin.json

**Format**: JSON configuration with event matchers and actions

**Hook configuration**:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

Plugin hooks respond to the same lifecycle events as user-defined hooks:

| Event                | When it fires                                                                                                                                          |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionStart`       | When a session begins or resumes                                                                                                                       |
| `UserPromptSubmit`   | When you submit a prompt, before Claude processes it                                                                                                   |
| `PreToolUse`         | Before a tool call executes. Can block it                                                                                                              |
| `PermissionRequest`  | When a permission dialog appears                                                                                                                       |
| `PermissionDenied`   | When a tool call is denied by the auto mode classifier                                                                                                 |
| `PostToolUse`        | After a tool call succeeds                                                                                                                             |
| `PostToolUseFailure` | After a tool call fails                                                                                                                                |
| `Notification`       | When Claude Code sends a notification                                                                                                                  |
| `SubagentStart`      | When a subagent is spawned                                                                                                                             |
| `SubagentStop`       | When a subagent finishes                                                                                                                               |
| `TaskCreated`        | When a task is being created via `TaskCreate`                                                                                                          |
| `TaskCompleted`      | When a task is being marked as completed                                                                                                               |
| `Stop`               | When Claude finishes responding                                                                                                                        |
| `StopFailure`        | When the turn ends due to an API error. Output and exit code are ignored                                                                               |
| `TeammateIdle`       | When an agent team teammate is about to go idle                                                                                                        |
| `InstructionsLoaded` | When a CLAUDE.md or `.claude/rules/*.md` file is loaded into context                                                                                  |
| `ConfigChange`       | When a configuration file changes during a session                                                                                                     |
| `CwdChanged`         | When the working directory changes                                                                                                                     |
| `FileChanged`        | When a watched file changes on disk                                                                                                                    |
| `WorktreeCreate`     | When a worktree is being created via `--worktree` or `isolation: "worktree"`                                                                           |
| `WorktreeRemove`     | When a worktree is being removed                                                                                                                       |
| `PreCompact`         | Before context compaction                                                                                                                              |
| `PostCompact`        | After context compaction completes                                                                                                                     |
| `Elicitation`        | When an MCP server requests user input during a tool call                                                                                              |
| `ElicitationResult`  | After a user responds to an MCP elicitation                                                                                                            |
| `SessionEnd`         | When a session terminates                                                                                                                              |

**Hook types**: `command`, `http`, `prompt`, `agent`

### MCP servers

Plugins can bundle Model Context Protocol (MCP) servers to connect Claude Code with external tools and services.

**Location**: `.mcp.json` in plugin root, or inline in plugin.json

**Format**: Standard MCP server configuration

**MCP server configuration**:

```json  theme={null}
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

Plugin MCP servers start automatically when the plugin is enabled.

### LSP servers

<Tip>
  Looking to use LSP plugins? Install them from the official marketplace: search for "lsp" in the `/plugin` Discover tab.
</Tip>

Plugins can provide [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) (LSP) servers to give Claude real-time code intelligence.

LSP integration provides:

* **Instant diagnostics**: Claude sees errors and warnings immediately after each edit
* **Code navigation**: go to definition, find references, and hover information
* **Language awareness**: type information and documentation for code symbols

**Location**: `.lsp.json` in plugin root, or inline in `plugin.json`

**`.lsp.json` file format**:

```json  theme={null}
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

**Required fields:**

| Field                 | Description                                  |
| :-------------------- | :------------------------------------------- |
| `command`             | The LSP binary to execute (must be in PATH)  |
| `extensionToLanguage` | Maps file extensions to language identifiers |

**Optional fields:**

| Field                   | Description                                               |
| :---------------------- | :-------------------------------------------------------- |
| `args`                  | Command-line arguments for the LSP server                 |
| `transport`             | Communication transport: `stdio` (default) or `socket`    |
| `env`                   | Environment variables to set when starting the server     |
| `initializationOptions` | Options passed to the server during initialization        |
| `settings`              | Settings passed via `workspace/didChangeConfiguration`    |
| `workspaceFolder`       | Workspace folder path for the server                      |
| `startupTimeout`        | Max time to wait for server startup (milliseconds)        |
| `shutdownTimeout`       | Max time to wait for graceful shutdown (milliseconds)     |
| `restartOnCrash`        | Whether to automatically restart the server if it crashes |
| `maxRestarts`           | Maximum number of restart attempts before giving up       |

<Warning>
  **You must install the language server binary separately.** LSP plugins configure how Claude Code connects to a language server, but they don't include the server itself.
</Warning>

**Available LSP plugins:**

| Plugin           | Language server            | Install command                                                                            |
| :--------------- | :------------------------- | :----------------------------------------------------------------------------------------- |
| `pyright-lsp`    | Pyright (Python)           | `pip install pyright` or `npm install -g pyright`                                          |
| `typescript-lsp` | TypeScript Language Server | `npm install -g typescript-language-server typescript`                                     |
| `rust-lsp`       | rust-analyzer              | [See rust-analyzer installation](https://rust-analyzer.github.io/manual.html#installation) |

---

## Plugin installation scopes

When you install a plugin, you choose a **scope** that determines where the plugin is available:

| Scope     | Settings file                                   | Use case                                                 |
| :-------- | :---------------------------------------------- | :------------------------------------------------------- |
| `user`    | `~/.claude/settings.json`                       | Personal plugins available across all projects (default) |
| `project` | `.claude/settings.json`                         | Team plugins shared via version control                  |
| `local`   | `.claude/settings.local.json`                   | Project-specific plugins, gitignored                     |
| `managed` | [Managed settings](/en/settings#settings-files) | Managed plugins (read-only, update only)                 |

---

## Plugin manifest schema

The `.claude-plugin/plugin.json` file defines your plugin's metadata and configuration. The manifest is optional. If omitted, Claude Code auto-discovers components in default locations.

### Complete schema

```json  theme={null}
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

### Required fields

If you include a manifest, `name` is the only required field.

| Field  | Type   | Description                               | Example              |
| :----- | :----- | :---------------------------------------- | :------------------- |
| `name` | string | Unique identifier (kebab-case, no spaces) | `"deployment-tools"` |

### Metadata fields

| Field         | Type   | Description                         | Example                                            |
| :------------ | :----- | :---------------------------------- | :------------------------------------------------- |
| `version`     | string | Semantic version                    | `"2.1.0"`                                          |
| `description` | string | Brief explanation of plugin purpose | `"Deployment automation tools"`                    |
| `author`      | object | Author information                  | `{"name": "Dev Team", "email": "dev@company.com"}` |
| `homepage`    | string | Documentation URL                   | `"https://docs.example.com"`                       |
| `repository`  | string | Source code URL                     | `"https://github.com/user/plugin"`                 |
| `license`     | string | License identifier                  | `"MIT"`, `"Apache-2.0"`                            |
| `keywords`    | array  | Discovery tags                      | `["deployment", "ci-cd"]`                          |

### Component path fields

| Field          | Type                  | Description                                                 | Example                                |
| :------------- | :-------------------- | :---------------------------------------------------------- | :------------------------------------- |
| `commands`     | string\|array         | Custom command files/directories (replaces default `commands/`) | `"./custom/cmd.md"` or `["./cmd1.md"]` |
| `agents`       | string\|array         | Custom agent files (replaces default `agents/`)             | `"./custom/agents/reviewer.md"`        |
| `skills`       | string\|array         | Custom skill directories (replaces default `skills/`)       | `"./custom/skills/"`                   |
| `hooks`        | string\|array\|object | Hook config paths or inline config                          | `"./my-extra-hooks.json"`              |
| `mcpServers`   | string\|array\|object | MCP config paths or inline config                           | `"./my-extra-mcp-config.json"`         |
| `outputStyles` | string\|array         | Custom output style files/directories                       | `"./styles/"`                          |
| `lspServers`   | string\|array\|object | Language Server Protocol configs                            | `"./.lsp.json"`                        |
| `userConfig`   | object                | User-configurable values prompted at enable time            | See below                              |
| `channels`     | array                 | Channel declarations for message injection                  | See below                              |

### User configuration

The `userConfig` field declares values that Claude Code prompts the user for when the plugin is enabled:

```json  theme={null}
{
  "userConfig": {
    "api_endpoint": {
      "description": "Your team's API endpoint",
      "sensitive": false
    },
    "api_token": {
      "description": "API authentication token",
      "sensitive": true
    }
  }
}
```

Keys must be valid identifiers. Each value is available as `${user_config.KEY}` in MCP and LSP server configs, hook commands, and (for non-sensitive values only) skill and agent content. Values are also exported as `CLAUDE_PLUGIN_OPTION_<KEY>` environment variables.

### Channels

The `channels` field lets a plugin declare message channels that inject content into the conversation:

```json  theme={null}
{
  "channels": [
    {
      "server": "telegram",
      "userConfig": {
        "bot_token": { "description": "Telegram bot token", "sensitive": true },
        "owner_id": { "description": "Your Telegram user ID", "sensitive": false }
      }
    }
  ]
}
```

The `server` field must match a key in the plugin's `mcpServers`.

### Environment variables

**`${CLAUDE_PLUGIN_ROOT}`**: the absolute path to your plugin's installation directory. Use this to reference scripts, binaries, and config files bundled with the plugin.

**`${CLAUDE_PLUGIN_DATA}`**: a persistent directory for plugin state that survives updates. Resolves to `~/.claude/plugins/data/{id}/`. Use for installed dependencies, caches, and files that should persist across plugin versions.

#### Persistent data directory example

This `SessionStart` hook installs `node_modules` on the first run and again whenever a plugin update includes a changed `package.json`:

```json  theme={null}
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "diff -q \"${CLAUDE_PLUGIN_ROOT}/package.json\" \"${CLAUDE_PLUGIN_DATA}/package.json\" >/dev/null 2>&1 || (cd \"${CLAUDE_PLUGIN_DATA}\" && cp \"${CLAUDE_PLUGIN_ROOT}/package.json\" . && npm install) || rm -f \"${CLAUDE_PLUGIN_DATA}/package.json\""
          }
        ]
      }
    ]
  }
}
```

---

## Plugin caching and file resolution

For security and verification purposes, Claude Code copies marketplace plugins to the user's local plugin cache (`~/.claude/plugins/cache`) rather than using them in-place.

### Path traversal limitations

Installed plugins cannot reference files outside their directory. Paths that traverse outside the plugin root (such as `../shared-utils`) will not work after installation.

### Working with external dependencies

Create symbolic links to external files within your plugin directory — symlinks are honored during the copy process:

```bash  theme={null}
# Inside your plugin directory
ln -s /path/to/shared-utils ./shared-utils
```

---

## Plugin directory structure

### Standard plugin layout

```text  theme={null}
enterprise-plugin/
├── .claude-plugin/           # Metadata directory (optional)
│   └── plugin.json             # plugin manifest
├── commands/                 # Default command location
│   ├── status.md
│   └── logs.md
├── agents/                   # Default agent location
│   ├── security-reviewer.md
│   ├── performance-tester.md
│   └── compliance-checker.md
├── skills/                   # Agent Skills
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── pdf-processor/
│       ├── SKILL.md
│       └── scripts/
├── output-styles/            # Output style definitions
│   └── terse.md
├── hooks/                    # Hook configurations
│   ├── hooks.json           # Main hook config
│   └── security-hooks.json  # Additional hooks
├── bin/                      # Plugin executables added to PATH
│   └── my-tool
├── settings.json            # Default settings for the plugin
├── .mcp.json                # MCP server definitions
├── .lsp.json                # LSP server configurations
├── scripts/                 # Hook and utility scripts
│   ├── security-scan.sh
│   ├── format-code.py
│   └── deploy.js
├── LICENSE
└── CHANGELOG.md
```

<Warning>
  The `.claude-plugin/` directory contains the `plugin.json` file. All other directories (commands/, agents/, skills/, output-styles/, hooks/) must be at the plugin root, not inside `.claude-plugin/`.
</Warning>

### File locations reference

| Component         | Default Location             | Purpose                                                                                                                                  |
| :---------------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Manifest**      | `.claude-plugin/plugin.json` | Plugin metadata and configuration (optional)                                                                                             |
| **Commands**      | `commands/`                  | Skill Markdown files (legacy; use `skills/` for new skills)                                                                              |
| **Agents**        | `agents/`                    | Subagent Markdown files                                                                                                                  |
| **Skills**        | `skills/`                    | Skills with `<name>/SKILL.md` structure                                                                                                  |
| **Output styles** | `output-styles/`             | Output style definitions                                                                                                                 |
| **Hooks**         | `hooks/hooks.json`           | Hook configuration                                                                                                                       |
| **MCP servers**   | `.mcp.json`                  | MCP server definitions                                                                                                                   |
| **LSP servers**   | `.lsp.json`                  | Language server configurations                                                                                                           |
| **Executables**   | `bin/`                       | Executables added to the Bash tool's `PATH`                                                                                              |
| **Settings**      | `settings.json`              | Default configuration applied when the plugin is enabled. Only `agent` settings are currently supported                                  |

---

## CLI commands reference

### plugin install

Install a plugin from available marketplaces.

```bash  theme={null}
claude plugin install <plugin> [options]
```

**Options:**

| Option                | Description                                       | Default |
| :-------------------- | :------------------------------------------------ | :------ |
| `-s, --scope <scope>` | Installation scope: `user`, `project`, or `local` | `user`  |

**Examples:**

```bash  theme={null}
# Install to user scope (default)
claude plugin install formatter@my-marketplace

# Install to project scope (shared with team)
claude plugin install formatter@my-marketplace --scope project

# Install to local scope (gitignored)
claude plugin install formatter@my-marketplace --scope local
```

### plugin uninstall

Remove an installed plugin.

```bash  theme={null}
claude plugin uninstall <plugin> [options]
```

**Options:**

| Option                | Description                                                                   | Default |
| :-------------------- | :---------------------------------------------------------------------------- | :------ |
| `-s, --scope <scope>` | Uninstall from scope: `user`, `project`, or `local`                           | `user`  |
| `--keep-data`         | Preserve the plugin's persistent data directory                               |         |

**Aliases:** `remove`, `rm`

### plugin enable

Enable a disabled plugin.

```bash  theme={null}
claude plugin enable <plugin> [options]
```

### plugin disable

Disable a plugin without uninstalling it.

```bash  theme={null}
claude plugin disable <plugin> [options]
```

### plugin update

Update a plugin to the latest version.

```bash  theme={null}
claude plugin update <plugin> [options]
```

---

## Debugging and development tools

### Debugging commands

Use `claude --debug` to see plugin loading details:

* Which plugins are being loaded
* Any errors in plugin manifests
* Command, agent, and hook registration
* MCP server initialization

### Common issues

| Issue                               | Cause                           | Solution                                                                                                                                                        |
| :---------------------------------- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plugin not loading                  | Invalid `plugin.json`           | Run `claude plugin validate` or `/plugin validate` to check for syntax and schema errors                                                                        |
| Commands not appearing              | Wrong directory structure       | Ensure `commands/` at root, not in `.claude-plugin/`                                                                                                            |
| Hooks not firing                    | Script not executable           | Run `chmod +x script.sh`                                                                                                                                        |
| MCP server fails                    | Missing `${CLAUDE_PLUGIN_ROOT}` | Use variable for all plugin paths                                                                                                                               |
| Path errors                         | Absolute paths used             | All paths must be relative and start with `./`                                                                                                                  |
| LSP `Executable not found in $PATH` | Language server not installed   | Install the binary (e.g., `npm install -g typescript-language-server typescript`)                                                                               |

### Hook troubleshooting

**Hook script not executing:**

1. Check the script is executable: `chmod +x ./scripts/your-script.sh`
2. Verify the shebang line: `#!/bin/bash`
3. Check the path uses `${CLAUDE_PLUGIN_ROOT}`
4. Test the script manually

**Hook not triggering on expected events:**

1. Verify the event name is correct (case-sensitive): `PostToolUse`, not `postToolUse`
2. Check the matcher pattern: `"matcher": "Write|Edit"` for file operations
3. Confirm the hook type is valid: `command`, `http`, `prompt`, or `agent`

### MCP server troubleshooting

1. Check the command exists and is executable
2. Verify all paths use `${CLAUDE_PLUGIN_ROOT}` variable
3. Check MCP server logs: `claude --debug` shows initialization errors
4. Test the server manually outside of Claude Code

### Directory structure mistakes

**Correct structure**: Components must be at the plugin root, not inside `.claude-plugin/`.

```text  theme={null}
my-plugin/
├── .claude-plugin/
│   └── plugin.json      ← Only manifest here
├── commands/            ← At root level
├── agents/              ← At root level
└── hooks/               ← At root level
```

---

## Distribution and versioning reference

### Version management

Follow semantic versioning for plugin releases:

```json  theme={null}
{
  "name": "my-plugin",
  "version": "2.1.0"
}
```

**Version format**: `MAJOR.MINOR.PATCH`

* **MAJOR**: Breaking changes
* **MINOR**: New features (backward-compatible)
* **PATCH**: Bug fixes

<Warning>
  Claude Code uses the version to determine whether to update your plugin. If you change your plugin's code but don't bump the version in `plugin.json`, existing users won't see your changes due to caching.
</Warning>

---

## See also

* [Plugins](/en/plugins) - Tutorials and practical usage
* [Plugin marketplaces](/en/plugin-marketplaces) - Creating and managing marketplaces
* [Skills](/en/skills) - Skill development details
* [Subagents](/en/sub-agents) - Agent configuration and capabilities
* [Hooks](/en/hooks) - Event handling and automation
* [MCP](/en/mcp) - External tool integration
* [Settings](/en/settings) - Configuration options for plugins
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
