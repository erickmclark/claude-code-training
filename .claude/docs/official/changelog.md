# Changelog

> Release notes for Claude Code, including new features, improvements, and bug fixes by version.

This page is generated from the [CHANGELOG.md on GitHub](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

Run `claude --version` to check your installed version.

## 2.1.92 (April 4, 2026)

* Added `forceRemoteSettingsRefresh` policy setting: when set, the CLI blocks startup until remote managed settings are freshly fetched, and exits if the fetch fails (fail-closed)
* Added interactive Bedrock setup wizard accessible from the login screen when selecting "3rd-party platform" — guides you through AWS authentication, region configuration, credential verification, and model pinning
* Added per-model and cache-hit breakdown to `/cost` for subscription users
* `/release-notes` is now an interactive version picker
* Remote Control session names now use your hostname as the default prefix (e.g. `myhost-graceful-unicorn`), overridable with `--remote-control-session-name-prefix`
* Pro users now see a footer hint when returning to a session after the prompt cache has expired, showing roughly how many tokens the next turn will send uncached
* Fixed subagent spawning permanently failing with "Could not determine pane count" after tmux windows are killed or renumbered during a long-running session
* Fixed prompt-type Stop hooks incorrectly failing when the small fast model returns `ok:false`, and restored `preventContinuation:true` semantics for non-Stop prompt-type hooks
* Fixed tool input validation failures when streaming emits array/object fields as JSON-encoded strings
* Fixed an API 400 error that could occur when extended thinking produced a whitespace-only text block alongside real content
* Fixed accidental feedback survey submissions from auto-pilot keypresses and consecutive-prompt digit collisions
* Fixed misleading "esc to interrupt" hint appearing alongside "esc to clear" when a text selection exists in fullscreen mode during processing
* Fixed Homebrew install update prompts to use the cask's release channel (`claude-code` → stable, `claude-code@latest` → latest)
* Fixed `ctrl+e` jumping to the end of the next line when already at end of line in multiline prompts
* Fixed an issue where the same message could appear at two positions when scrolling up in fullscreen mode (iTerm2, Ghostty, and other terminals with DEC 2026 support)
* Fixed idle-return "/clear to save X tokens" hint showing cumulative session tokens instead of current context size
* Fixed plugin MCP servers stuck "connecting" on session start when they duplicate a claude.ai connector that is unauthenticated
* Improved Write tool diff computation speed for large files (60% faster on files with tabs/`&`/`$`)
* Removed `/tag` command
* Removed `/vim` command (toggle vim mode via `/config` → Editor mode)
* Linux sandbox now ships the `apply-seccomp` helper in both npm and native builds, restoring unix-socket blocking for sandboxed commands

## 2.1.91 (April 2, 2026)

* Added MCP tool result persistence override via `_meta["anthropic/maxResultSizeChars"]` annotation (up to 500K), allowing larger results like DB schemas to pass through without truncation
* Added `disableSkillShellExecution` setting to disable inline shell execution in skills, custom slash commands, and plugin commands
* Added support for multi-line prompts in `claude-cli://open?q=` deep links (encoded newlines `%0A` no longer rejected)
* Plugins can now ship executables under `bin/` and invoke them as bare commands from the Bash tool
* Fixed transcript chain breaks on `--resume` that could lose conversation history when async transcript writes fail silently
* Fixed `cmd+delete` not deleting to start of line on iTerm2, kitty, WezTerm, Ghostty, and Windows Terminal
* Fixed plan mode in remote sessions losing track of the plan file after a container restart, which caused permission prompts on plan edits and an empty plan-approval modal
* Fixed JSON schema validation for `permissions.defaultMode: "auto"` in settings.json
* Fixed Windows version cleanup not protecting the active version's rollback copy
* `/feedback` now explains why it's unavailable instead of disappearing from the slash menu
* Improved `/claude-api` skill guidance for agent design patterns including tool surface decisions, context management, and caching strategy
* Improved performance: faster `stripAnsi` on Bun by routing through `Bun.stripANSI`
* Edit tool now uses shorter `old_string` anchors, reducing output tokens

## 2.1.90 (April 1, 2026)

* Added `/powerup` — interactive lessons teaching Claude Code features with animated demos
* Added `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` env var to keep the existing marketplace cache when `git pull` fails, useful in offline environments
* Added `.husky` to protected directories (acceptEdits mode)
* Fixed an infinite loop where the rate-limit options dialog would repeatedly auto-open after hitting your usage limit, eventually crashing the session
* Fixed `--resume` causing a full prompt-cache miss on the first request for users with deferred tools, MCP servers, or custom agents (regression since v2.1.69)
* Fixed `Edit`/`Write` failing with "File content has changed" when a PostToolUse format-on-save hook rewrites the file between consecutive edits
* Fixed `PreToolUse` hooks that emit JSON to stdout and exit with code 2 not correctly blocking the tool call
* Fixed collapsed search/read summary badge appearing multiple times in fullscreen scrollback when a CLAUDE.md file auto-loads during a tool call
* Fixed auto mode not respecting explicit user boundaries ("don't push", "wait for X before Y") even when the action would otherwise be allowed
* Fixed click-to-expand hover text being nearly invisible on light terminal themes
* Fixed UI crash when malformed tool input reached the permission dialog
* Fixed headers disappearing when scrolling `/model`, `/config`, and other selection screens
* Hardened PowerShell tool permission checks: fixed trailing `&` background job bypass, `-ErrorAction Break` debugger hang, archive-extraction TOCTOU, and parse-fail fallback deny-rule degradation
* Improved performance: eliminated per-turn JSON.stringify of MCP tool schemas on cache-key lookup
* Improved performance: SSE transport now handles large streamed frames in linear time (was quadratic)
* Improved performance: SDK sessions with long conversations no longer slow down quadratically on transcript writes
* Improved `/resume` all-projects view to load project sessions in parallel, improving load times for users with many projects
* Changed `--resume` picker to no longer show sessions created by `claude -p` or SDK invocations
* Removed `Get-DnsClientCache` and `ipconfig /displaydns` from auto-allow (DNS cache privacy)

## 2.1.89 (April 1, 2026)

* Added `"defer"` permission decision to `PreToolUse` hooks — headless sessions can pause at a tool call and resume with `-p --resume` to have the hook re-evaluate
* Added `CLAUDE_CODE_NO_FLICKER=1` environment variable to opt into flicker-free alt-screen rendering with virtualized scrollback
* Added `PermissionDenied` hook that fires after auto mode classifier denials — return `{retry: true}` to tell the model it can retry
* Added named subagents to `@` mention typeahead suggestions
* Added `MCP_CONNECTION_NONBLOCKING=true` for `-p` mode to skip the MCP connection wait entirely, and bounded `--mcp-config` server connections at 5s instead of blocking on the slowest server
* Auto mode: denied commands now show a notification and appear in `/permissions` → Recent tab where you can retry with `r`
* Fixed `Edit(//path/**)` and `Read(//path/**)` allow rules to check the resolved symlink target, not just the requested path
* Fixed voice push-to-talk not activating for some modifier-combo bindings, and voice mode on Windows failing with "WebSocket upgrade rejected with HTTP 101"
* Fixed Edit/Write tools doubling CRLF on Windows and stripping Markdown hard line breaks (two trailing spaces)
* Fixed `StructuredOutput` schema cache bug causing ~50% failure rate when using multiple schemas
* Fixed memory leak where large JSON inputs were retained as LRU cache keys in long-running sessions
* Fixed a crash when removing a message from very large session files (over 50MB)
* Fixed LSP server zombie state after crash — server now restarts on next request instead of failing until session restart
* Fixed prompt history entries containing CJK or emoji being silently dropped when they fall on a 4KB boundary in `~/.claude/history.jsonl`
* Fixed `/stats` undercounting tokens by excluding subagent usage, and losing historical data beyond 30 days when the stats cache format changes
* Fixed `-p --resume` hangs when the deferred tool input exceeds 64KB or no deferred marker exists, and `-p --continue` not resuming deferred tools
* Fixed `claude-cli://` deep links not opening on macOS
* Fixed MCP tool errors truncating to only the first content block when the server returns multi-element error content
* Fixed skill reminders and other system context being dropped when sending messages with images via the SDK
* Fixed PreToolUse/PostToolUse hooks to receive `file_path` as an absolute path for Write/Edit/Read tools, matching the documented behavior
* Fixed autocompact thrash loop — now detects when context refills to the limit immediately after compacting three times in a row and stops with an actionable error instead of burning API calls
* Fixed prompt cache misses in long sessions caused by tool schema bytes changing mid-session
* Fixed nested CLAUDE.md files being re-injected dozens of times in long sessions that read many files
* Fixed `--resume` crash when transcript contains a tool result from an older CLI version or interrupted write
* Fixed misleading "Rate limit reached" message when the API returned an entitlement error — now shows the actual error with actionable hints
* Fixed hooks `if` condition filtering not matching compound commands (`ls && git push`) or commands with env-var prefixes (`FOO=bar git push`)
* Fixed collapsed search/read group badges duplicating in terminal scrollback during heavy parallel tool use
* Fixed notification `invalidates` not clearing the currently-displayed notification immediately
* Fixed prompt briefly disappearing after submit when background messages arrived during processing
* Fixed Devanagari and other combining-mark text being truncated in assistant output
* Fixed rendering artifacts on main-screen terminals after layout shifts
* Fixed voice mode failing to request microphone permission on macOS Apple Silicon
* Fixed Shift+Enter submitting instead of inserting a newline on Windows Terminal Preview 1.25
* Fixed periodic UI jitter during streaming in iTerm2 when running inside tmux
* Fixed PowerShell tool incorrectly reporting failures when commands like `git push` wrote progress to stderr on Windows PowerShell 5.1
* Fixed a potential out-of-memory crash when the Edit tool was used on very large files (>1 GiB)
* Improved collapsed tool summary to show "Listed N directories" for `ls`/`tree`/`du` instead of "Read N files"
* Improved Bash tool to warn when a formatter/linter command modifies files you have previously read, preventing stale-edit errors
* Improved `@`-mention typeahead to rank source files above MCP resources with similar names
* Improved PowerShell tool prompt with version-appropriate syntax guidance (5.1 vs 7+)
* Changed `Edit` to work on files viewed via `Bash` with `sed -n` or `cat`, without requiring a separate `Read` call first
* Changed hook output over 50K characters to be saved to disk with a file path + preview instead of being injected directly into context
* Changed `cleanupPeriodDays: 0` in settings.json to be rejected with a validation error — it previously silently disabled transcript persistence
* Changed thinking summaries to no longer be generated by default in interactive sessions — set `showThinkingSummaries: true` in settings.json to restore
* Documented `TaskCreated` hook event and its blocking behavior
* Preserved task notifications when backgrounding a running command with Ctrl+B
* PowerShell tool on Windows: external-command arguments containing both a double-quote and whitespace now prompt instead of auto-allowing (PS 5.1 argument-splitting hardening)
* `/env` now applies to PowerShell tool commands (previously only affected Bash)
* `/usage` now hides redundant "Current week (Sonnet only)" bar for Pro and Enterprise plans
* Image paste no longer inserts a trailing space
* Pasting `!command` into an empty prompt now enters bash mode, matching typed `!` behavior

## 2.1.87 (March 29, 2026)

* Fixed messages in Cowork Dispatch not getting delivered

## 2.1.86 (March 27, 2026)

* Added `X-Claude-Code-Session-Id` header to API requests so proxies can aggregate requests by session without parsing the body
* Added `.jj` and `.sl` to VCS directory exclusion lists so Grep and file autocomplete don't descend into Jujutsu or Sapling metadata
* Fixed `--resume` failing with "tool_use ids were found without tool_result blocks" on sessions created before v2.1.85
* Fixed Write/Edit/Read failing on files outside the project root (e.g., `~/.claude/CLAUDE.md`) when conditional skills or rules are configured
* Fixed unnecessary config disk writes on every skill invocation that could cause performance issues and config corruption on Windows
* Fixed potential out-of-memory crash when using `/feedback` on very long sessions with large transcript files
* Fixed `--bare` mode dropping MCP tools in interactive sessions and silently discarding messages enqueued mid-turn
* Fixed the `c` shortcut copying only ~20 characters of the OAuth login URL instead of the full URL
* Fixed masked input (e.g., OAuth code paste) leaking the start of the token when wrapping across multiple lines on narrow terminals
* Fixed official marketplace plugin scripts failing with "Permission denied" on macOS/Linux since v2.1.83
* Fixed statusline showing another session's model when running multiple Claude Code instances and using `/model` in one of them
* Fixed scroll not following new messages after wheel scroll or click-to-select at the bottom of a long conversation
* Fixed `/plugin` uninstall dialog: pressing `n` now correctly uninstalls the plugin while preserving its data directory
* Fixed a regression where pressing Enter after clicking could leave the transcript blank until the response arrived
* Fixed `ultrathink` hint lingering after deleting the keyword
* Fixed memory growth in long sessions from markdown/highlight render caches retaining full content strings
* Reduced startup event-loop stalls when many claude.ai MCP connectors are configured (macOS keychain cache extended from 5s to 30s)
* Reduced token overhead when mentioning files with `@` — raw string content no longer JSON-escaped
* Improved prompt cache hit rate for Bedrock, Vertex, and Foundry users by removing dynamic content from tool descriptions
* Memory filenames in the "Saved N memories" notice now highlight on hover and open on click
* Skill descriptions in the `/skills` listing are now capped at 250 characters to reduce context usage
* Changed `/skills` menu to sort alphabetically for easier scanning
* Auto mode now shows "unavailable for your plan" when disabled by plan restrictions (was "temporarily unavailable")
* [VSCode] Fixed extension incorrectly showing "Not responding" during long-running operations
* [VSCode] Fixed extension defaulting Max plan users to Sonnet after the OAuth token refreshes (8 hours after login)
* Read tool now uses compact line-number format and deduplicates unchanged re-reads, reducing token usage

## 2.1.85 (March 26, 2026)

* Added `CLAUDE_CODE_MCP_SERVER_NAME` and `CLAUDE_CODE_MCP_SERVER_URL` environment variables to MCP `headersHelper` scripts, allowing one helper to serve multiple servers
* Added conditional `if` field for hooks using permission rule syntax (e.g., `Bash(git *)`) to filter when they run, reducing process spawning overhead
* Added timestamp markers in transcripts when scheduled tasks (`/loop`, `CronCreate`) fire
* Added trailing space after `[Image #N]` placeholder when pasting images
* Deep link queries (`claude-cli://open?q=…`) now support up to 5,000 characters, with a "scroll to review" warning for long pre-filled prompts
* MCP OAuth now follows RFC 9728 Protected Resource Metadata discovery to find the authorization server
* Plugins blocked by organization policy (`managed-settings.json`) can no longer be installed or enabled, and are hidden from marketplace views
* PreToolUse hooks can now satisfy `AskUserQuestion` by returning `updatedInput` alongside `permissionDecision: "allow"`, enabling headless integrations that collect answers via their own UI
* `tool_parameters` in OpenTelemetry tool_result events are now gated behind `OTEL_LOG_TOOL_DETAILS=1`
* Fixed `/compact` failing with "context exceeded" when the conversation has grown too large for the compact request itself to fit
* Fixed `/plugin enable` and `/plugin disable` failing when a plugin's install location differs from where it's declared in settings
* Fixed `--worktree` exiting with an error in non-git repositories before the `WorktreeCreate` hook could run
* Fixed `deniedMcpServers` setting not blocking claude.ai MCP servers
* Fixed `switch_display` in the computer-use tool returning "not available in this session" on multi-monitor setups
* Fixed crash when `OTEL_LOGS_EXPORTER`, `OTEL_METRICS_EXPORTER`, or `OTEL_TRACES_EXPORTER` is set to `none`
* Fixed diff syntax highlighting not working in non-native builds
* Fixed MCP step-up authorization failing when a refresh token exists — servers requesting elevated scopes via `403 insufficient_scope` now correctly trigger the re-authorization flow
* Fixed memory leak in remote sessions when a streaming response is interrupted
* Fixed persistent ECONNRESET errors during edge connection churn by using a fresh TCP connection on retry
* Fixed prompts getting stuck in the queue after running certain slash commands, with up-arrow unable to retrieve them
* Fixed Python Agent SDK: `type:'sdk'` MCP servers passed via `--mcp-config` are no longer dropped during startup
* Fixed raw key sequences appearing in the prompt when running over SSH or in the VS Code integrated terminal
* Fixed Remote Control session status staying stuck on "Requires Action" after a permission is resolved
* Fixed shift+enter and meta+enter being intercepted by typeahead suggestions instead of inserting newlines
* Fixed stale content bleeding through when scrolling up during streaming
* Fixed terminal left in enhanced keyboard mode after exit in Ghostty, Kitty, WezTerm, and other terminals supporting the Kitty keyboard protocol — Ctrl+C and Ctrl+D now work correctly after quitting
* Improved @-mention file autocomplete performance on large repositories
* Improved PowerShell dangerous command detection
* Improved scroll performance with large transcripts by replacing WASM yoga-layout with a pure TypeScript implementation
* Reduced UI stutter when compaction triggers on large sessions

## 2.1.84 (March 26, 2026)

* Added PowerShell tool for Windows as an opt-in preview
* Added `ANTHROPIC_DEFAULT_{OPUS,SONNET,HAIKU}_MODEL_SUPPORTS` env vars to override effort/thinking capability detection for pinned default models for 3p (Bedrock, Vertex, Foundry), and `_MODEL_NAME`/`_DESCRIPTION` to customize the `/model` picker label
* Added `CLAUDE_STREAM_IDLE_TIMEOUT_MS` env var to configure the streaming idle watchdog threshold (default 90s)
* Added `TaskCreated` hook that fires when a task is created via `TaskCreate`
* Added `WorktreeCreate` hook support for `type: "http"` — return the created worktree path via `hookSpecificOutput.worktreePath` in the response JSON
* Added `allowedChannelPlugins` managed setting for team/enterprise admins to define a channel plugin allowlist
* Added `x-client-request-id` header to API requests for debugging timeouts
* Added idle-return prompt that nudges users returning after 75+ minutes to `/clear`, reducing unnecessary token re-caching on stale sessions
* Deep links (`claude-cli://`) now open in your preferred terminal instead of whichever terminal happens to be first in the detection list
* Rules and skills `paths:` frontmatter now accepts a YAML list of globs
* MCP tool descriptions and server instructions are now capped at 2KB to prevent OpenAPI-generated servers from bloating context
* MCP servers configured both locally and via claude.ai connectors are now deduplicated — the local config wins
* Background bash tasks that appear stuck on an interactive prompt now surface a notification after ~45 seconds
* Token counts >=1M now display as "1.5m" instead of "1512.6k"
* Global system-prompt caching now works when `ToolSearch` is enabled, including for users with MCP tools configured
* Fixed voice push-to-talk: holding the voice key no longer leaks characters into the text input, and transcripts now insert at the correct position
* Fixed up/down arrow keys being unresponsive when a footer item is focused
* Fixed `Ctrl+U` (kill-to-line-start) being a no-op at line boundaries in multiline input, so repeated `Ctrl+U` now clears across lines
* Fixed null-unbinding a default chord binding (e.g. `"ctrl+x ctrl+k": null`) still entering chord-wait mode instead of freeing the prefix key
* Fixed mouse events inserting literal "mouse" text into transcript search input
* Fixed workflow subagents failing with API 400 when the outer session uses `--json-schema` and the subagent also specifies a schema
* Fixed missing background color behind certain emoji in user message bubbles on some terminals
* Fixed the "allow Claude to edit its own settings for this session" permission option not sticking for users with `Edit(.claude)` allow rules
* Fixed a hang when generating attachment snippets for large edited files
* Fixed MCP tool/resource cache leak on server reconnect
* Fixed a startup performance issue where partial clone repositories (Scalar/GVFS) triggered mass blob downloads
* Fixed native terminal cursor not tracking the text input caret, so IME composition (CJK input) now renders inline and screen readers can follow the input position
* Fixed spurious "Not logged in" errors on macOS caused by transient keychain read failures
* Fixed cold-start race where core tools could be deferred without their bypass active, causing Edit/Write to fail with InputValidationError on typed parameters
* Improved detection for dangerous removals of Windows drive roots (`C:\`, `C:\Windows`, etc.)
* Improved interactive startup by ~30ms by running `setup()` in parallel with slash command and agent loading
* Improved startup for `claude "prompt"` with MCP servers — the REPL now renders immediately instead of blocking until all servers connect
* Improved Remote Control to show a specific reason when blocked instead of a generic "not yet enabled" message
* Improved p90 prompt cache rate
* Reduced scroll-to-top resets in long sessions by making the message window immune to compaction and grouping changes
* Reduced terminal flickering when animated tool progress scrolls above the viewport
* Changed issue/PR references to only become clickable links when written as `owner/repo#123` — bare `#123` is no longer auto-linked
* Slash commands unavailable for the current auth setup (`/voice`, `/mobile`, `/chrome`, `/upgrade`, etc.) are now hidden instead of shown
* [VSCode] Added rate limit warning banner with usage percentage and reset time
* Stats screenshot (Ctrl+S in /stats) now works in all builds and is 16x faster

## 2.1.83 (March 25, 2026)

* Added `managed-settings.d/` drop-in directory alongside `managed-settings.json`, letting separate teams deploy independent policy fragments that merge alphabetically
* Added `CwdChanged` and `FileChanged` hook events for reactive environment management (e.g., direnv)
* Added `sandbox.failIfUnavailable` setting to exit with an error when sandbox is enabled but cannot start, instead of running unsandboxed
* Added `disableDeepLinkRegistration` setting to prevent `claude-cli://` protocol handler registration
* Added `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` to strip Anthropic and cloud provider credentials from subprocess environments (Bash tool, hooks, MCP stdio servers)
* Added transcript search — press `/` in transcript mode (`Ctrl+O`) to search, `n`/`N` to step through matches
* Added `Ctrl+X Ctrl+E` as an alias for opening the external editor (readline-native binding; `Ctrl+G` still works)
* Pasted images now insert an `[Image #N]` chip at the cursor so you can reference them positionally in your prompt
* Agents can now declare `initialPrompt` in frontmatter to auto-submit a first turn
* `chat:killAgents` and `chat:fastMode` are now rebindable via `~/.claude/keybindings.json`
* Fixed mouse tracking escape sequences leaking to shell prompt after exit
* Fixed Claude Code hanging on exit on macOS
* Fixed screen flashing blank after being idle for a few seconds
* Fixed a hang when diffing very large files with few common lines — diffs now time out after 5 seconds and fall back gracefully
* Fixed a 1-8 second UI freeze on startup when voice input was enabled, caused by eagerly loading the native audio module
* Fixed a startup regression where Claude Code would wait ~3s for claude.ai MCP config fetch before proceeding
* Fixed `--mcp-config` CLI flag bypassing `allowedMcpServers`/`deniedMcpServers` managed policy enforcement
* Fixed claude.ai MCP connectors (Slack, Gmail, etc.) not being available in single-turn `--print` mode
* Fixed `caffeinate` process not properly terminating when Claude Code exits, preventing Mac from sleeping
* Fixed bash mode not activating when tab-accepting `!`-prefixed command suggestions
* Fixed stale slash command selection showing wrong highlighted command after navigating suggestions
* Fixed `/config` menu showing both the search cursor and list selection at the same time
* Fixed background subagents becoming invisible after context compaction, which could cause duplicate agents to be spawned
* Fixed background agent tasks staying stuck in "running" state when git or API calls hang during cleanup
* Fixed `--channels` showing "Channels are not currently available" on first launch after upgrade
* Fixed uninstalled plugin hooks continuing to fire until the next session
* Fixed queued commands flickering during streaming responses
* Fixed slash commands being sent to the model as text when submitted while a message is processing
* Fixed scrollback jumping when collapsed read/search groups finish after scrolling offscreen
* Fixed scrollback jumping to top when the model starts or stops thinking
* Fixed SDK session history loss on resume caused by hook progress/attachment messages forking the parentUuid chain
* Fixed copy-on-select not firing when you release the mouse outside the terminal window
* Fixed ghost characters appearing in height-constrained lists when items overflow
* Fixed `Ctrl+B` interfering with readline backward-char at an idle prompt — it now only fires when a foreground task can be backgrounded
* Fixed tool result files never being cleaned up, ignoring the `cleanupPeriodDays` setting
* Fixed space key being swallowed for up to 3 seconds after releasing voice hold-to-talk
* Fixed ALSA library errors corrupting the terminal UI when using voice mode on Linux without audio hardware (Docker, headless, WSL1)
* Fixed voice mode SoX detection on Termux/Android where spawning `which` is kernel-restricted
* Fixed Remote Control sessions showing as Idle in the web session list while actively running
* Fixed footer navigation selecting an invisible Remote Control pill in config-driven mode
* Fixed memory leak in remote sessions where tool use IDs accumulate indefinitely
* Improved Bedrock SDK cold-start latency by overlapping profile fetch with other boot work
* Improved `--resume` memory usage and startup latency on large sessions
* Improved plugin startup — commands, skills, and agents now load from disk cache without re-fetching
* Improved Remote Control session titles: AI-generated titles now appear within seconds of the first message
* Improved `WebFetch` to identify as `Claude-User` so site operators can recognize and allowlist Claude Code traffic via `robots.txt`
* Reduced `WebFetch` peak memory usage for large pages
* Reduced scrollback resets in long sessions from once per turn to once per ~50 messages
* Faster `claude -p` startup with unauthenticated HTTP/SSE MCP servers (~600ms saved)
* Bash ghost-text suggestions now include just-submitted commands immediately
* Increased non-streaming fallback token cap (21k → 64k) and timeout (120s → 300s local) so fallback requests are less likely to be truncated
* Interrupting a prompt before any response now automatically restores your input so you can edit and resubmit
* `/status` now works while Claude is responding, instead of being queued until the turn finishes
* Plugin MCP servers that duplicate an org-managed connector are now suppressed instead of running a second connection
* Linux: respect `XDG_DATA_HOME` when registering the `claude-cli://` protocol handler
* Changed "stop all background agents" keybinding from `Ctrl+F` to `Ctrl+X Ctrl+K` to stop shadowing readline forward-char
* Deprecated `TaskOutput` tool in favor of using `Read` on the background task's output file path
* Added `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK` env var to disable the non-streaming fallback when streaming fails
* Plugin options (`manifest.userConfig`) now available externally — plugins can prompt for configuration at enable time, with `sensitive: true` values stored in keychain (macOS) or protected credentials file (other platforms)
* Claude can now reference the on-disk path of clipboard-pasted images for file operations
* `Ctrl+L` now clears the screen and forces a full redraw
* `--bare -p` (SDK pattern) is ~14% faster to the API request
* Memory: `MEMORY.md` index now truncates at 25KB as well as 200 lines
* Disabled `AskUserQuestion` and plan-mode tools when `--channels` is active

> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
