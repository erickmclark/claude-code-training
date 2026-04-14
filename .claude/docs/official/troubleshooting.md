# Troubleshooting

> Discover solutions to common issues with Claude Code installation and usage.

## Troubleshoot installation issues

<Tip>
  If you'd rather skip the terminal entirely, the [Claude Code Desktop app](/en/desktop-quickstart) lets you install and use Claude Code through a graphical interface. Download it for [macOS](https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect?utm_source=claude_code\&utm_medium=docs) or [Windows](https://claude.com/download?utm_source=claude_code\&utm_medium=docs) and start coding without any command-line setup.
</Tip>

Find the error message or symptom you're seeing:

| What you see                                                | Solution                                                                                                                |
| :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `command not found: claude` or `'claude' is not recognized` | [Fix your PATH](#command-not-found-claude-after-installation)                                                           |
| `syntax error near unexpected token '<'`                    | [Install script returns HTML](#install-script-returns-html-instead-of-a-shell-script)                                   |
| `curl: (56) Failure writing output to destination`          | [Download script first, then run it](#curl-56-failure-writing-output-to-destination)                                    |
| `Killed` during install on Linux                            | [Add swap space for low-memory servers](#install-killed-on-low-memory-linux-servers)                                    |
| `TLS connect error` or `SSL/TLS secure channel`             | [Update CA certificates](#tls-or-ssl-connection-errors)                                                                 |
| `Failed to fetch version` or can't reach download server    | [Check network and proxy settings](#check-network-connectivity)                                                         |
| `irm is not recognized` or `&& is not valid`                | [Use the right command for your shell](#windows-irm-or--not-recognized)                                                 |
| `Claude Code on Windows requires git-bash`                  | [Install or configure Git Bash](#windows-claude-code-on-windows-requires-git-bash)                                      |
| `Error loading shared library`                              | [Wrong binary variant for your system](#linux-wrong-binary-variant-installed-muslglibc-mismatch)                        |
| `Illegal instruction` on Linux                              | [Architecture mismatch](#illegal-instruction-on-linux)                                                                  |
| `dyld: cannot load` or `Abort trap` on macOS                | [Binary incompatibility](#dyld-cannot-load-on-macos)                                                                    |
| `Invoke-Expression: Missing argument in parameter list`     | [Install script returns HTML](#install-script-returns-html-instead-of-a-shell-script)                                   |
| `App unavailable in region`                                 | Claude Code is not available in your country. See [supported countries](https://www.anthropic.com/supported-countries). |
| `unable to get local issuer certificate`                    | [Configure corporate CA certificates](#tls-or-ssl-connection-errors)                                                    |
| `OAuth error` or `403 Forbidden`                            | [Fix authentication](#authentication-issues)                                                                            |

If your issue isn't listed, work through these diagnostic steps.

## Debug installation problems

### Check network connectivity

The installer downloads from `storage.googleapis.com`. Verify you can reach it:

```bash  theme={null}
curl -sI https://storage.googleapis.com
```

If this fails, your network may be blocking the connection. Common causes:

* Corporate firewalls or proxies blocking Google Cloud Storage
* Regional network restrictions: try a VPN or alternative network
* TLS/SSL issues: update your system's CA certificates, or check if `HTTPS_PROXY` is configured

If you're behind a corporate proxy, set `HTTPS_PROXY` and `HTTP_PROXY` to your proxy's address before installing. Ask your IT team for the proxy URL if you don't know it, or check your browser's proxy settings.

This example sets both proxy variables, then runs the installer through your proxy:

```bash  theme={null}
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
curl -fsSL https://claude.ai/install.sh | bash
```

### Verify your PATH

If installation succeeded but you get a `command not found` or `not recognized` error when running `claude`, the install directory isn't in your PATH. Your shell searches for programs in directories listed in PATH, and the installer places `claude` at `~/.local/bin/claude` on macOS/Linux or `%USERPROFILE%\.local\bin\claude.exe` on Windows.

Check if the install directory is in your PATH by listing your PATH entries and filtering for `local/bin`:

**macOS/Linux:**
```bash  theme={null}
echo $PATH | tr ':' '\n' | grep local/bin
```

If there's no output, the directory is missing. Add it to your shell configuration:

```bash  theme={null}
# Zsh (macOS default)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Bash (Linux default)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Windows PowerShell:**
```powershell  theme={null}
$env:PATH -split ';' | Select-String 'local\\bin'
```

If there's no output, add the install directory to your User PATH:

```powershell  theme={null}
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

### Check for conflicting installations

Multiple Claude Code installations can cause version mismatches or unexpected behavior. Check what's installed:

```bash  theme={null}
which -a claude
ls -la ~/.local/bin/claude
ls -la ~/.claude/local/
npm -g ls @anthropic-ai/claude-code 2>/dev/null
```

If you find multiple installations, keep only one. The native install at `~/.local/bin/claude` is recommended. Remove any extra installations:

```bash  theme={null}
npm uninstall -g @anthropic-ai/claude-code
brew uninstall --cask claude-code  # macOS only
```

### Check directory permissions

```bash  theme={null}
test -w ~/.local/bin && echo "writable" || echo "not writable"
test -w ~/.claude && echo "writable" || echo "not writable"
```

If either directory isn't writable:

```bash  theme={null}
sudo mkdir -p ~/.local/bin
sudo chown -R $(whoami) ~/.local
```

### Verify the binary works

```bash  theme={null}
ls -la $(which claude)
ldd $(which claude) | grep "not found"  # Linux only
claude --version
```

## Common installation issues

### Install script returns HTML instead of a shell script

```text  theme={null}
bash: line 1: syntax error near unexpected token `<'
bash: line 1: `<!DOCTYPE html>'
```

This means the install URL returned an HTML page instead of the install script. If the HTML page says "App unavailable in region," Claude Code is not available in your country.

**Solutions:**

On macOS or Linux, install via Homebrew:
```bash  theme={null}
brew install --cask claude-code
```

On Windows, install via WinGet:
```powershell  theme={null}
winget install Anthropic.ClaudeCode
```

### `command not found: claude` after installation

The install directory isn't in your shell's search path. See [Verify your PATH](#verify-your-path) for the fix on each platform.

### `curl: (56) Failure writing output to destination`

The connection broke before the script finished downloading.

**Solutions:**

1. Test connectivity: `curl -fsSL https://storage.googleapis.com -o /dev/null`
2. Try an alternative install method (Homebrew on macOS/Linux, WinGet on Windows)

### TLS or SSL connection errors

Errors like `curl: (35) TLS connect error` or `SSL/TLS secure channel` indicate TLS handshake failures.

**Solutions:**

1. Update CA certificates:
   ```bash  theme={null}
   sudo apt-get update && sudo apt-get install ca-certificates  # Ubuntu/Debian
   brew install ca-certificates  # macOS
   ```

2. On Windows, enable TLS 1.2:
   ```powershell  theme={null}
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   irm https://claude.ai/install.ps1 | iex
   ```

3. For corporate proxies with TLS inspection, set `NODE_EXTRA_CA_CERTS`:
   ```bash  theme={null}
   export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.pem
   ```

### `Failed to fetch version from storage.googleapis.com`

```bash  theme={null}
curl -sI https://storage.googleapis.com  # Test connectivity
export HTTPS_PROXY=http://proxy.example.com:8080  # If behind a proxy
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows: `irm` or `&&` not recognized

* **`irm` not recognized**: you're in CMD, not PowerShell. Open PowerShell and run: `irm https://claude.ai/install.ps1 | iex`
* **`&&` not valid**: you're in PowerShell but ran the CMD command. Use: `irm https://claude.ai/install.ps1 | iex`

### Install killed on low-memory Linux servers

```text  theme={null}
bash: line 142: 34803 Killed    "$binary_path" install
```

Add swap space:

```bash  theme={null}
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
curl -fsSL https://claude.ai/install.sh | bash
```

### Install hangs in Docker

Set a working directory before running the installer:
```dockerfile  theme={null}
WORKDIR /tmp
RUN curl -fsSL https://claude.ai/install.sh | bash
```

### Windows: Claude Desktop overrides `claude` CLI command

Update Claude Desktop to the latest version to fix this issue.

### Windows: "Claude Code on Windows requires git-bash"

Install [Git for Windows](https://git-scm.com/downloads/win). During setup, select "Add to PATH."

If Git is already installed but Claude Code can't find it, set the path in your [settings.json file](/en/settings):

```json  theme={null}
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```

### Linux: wrong binary variant installed (musl/glibc mismatch)

```text  theme={null}
Error loading shared library libstdc++.so.6: No such file or directory
```

Check which libc your system uses:
```bash  theme={null}
ldd /bin/ls | head -1
```

If you're on glibc but got the musl binary, remove the installation and reinstall.

If you're actually on musl (Alpine Linux), install required packages:
```bash  theme={null}
apk add libgcc libstdc++ ripgrep
```

### `Illegal instruction` on Linux

Verify your architecture:
```bash  theme={null}
uname -m
```

`x86_64` means 64-bit Intel/AMD, `aarch64` means ARM64. If the binary doesn't match, file a GitHub issue.

### `dyld: cannot load` on macOS

Claude Code requires macOS 13.0 or later. Update macOS or try Homebrew:
```bash  theme={null}
brew install --cask claude-code
```

### Windows installation issues: errors in WSL

**OS/platform detection issues:** Run `npm config set os linux` before installation, or install with `npm install -g @anthropic-ai/claude-code --force --no-os-check`.

**Node not found errors:** Check `which npm` and `which node` — they should point to Linux paths starting with `/usr/`, not `/mnt/c/`.

**nvm version conflicts:** Add nvm loading to your shell config:

```bash  theme={null}
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### WSL2 sandbox setup

If you see an error about missing `bubblewrap` or `socat` when running `/sandbox`:

```bash  theme={null}
sudo apt-get install bubblewrap socat  # Ubuntu/Debian
sudo dnf install bubblewrap socat      # Fedora
```

WSL1 does not support sandboxing.

## Permissions and authentication

### Repeated permission prompts

Use the `/permissions` command to allow specific tools to run without approval. See [Permissions docs](/en/permissions#manage-permissions).

### Authentication issues

1. Run `/logout` to sign out completely
2. Close Claude Code
3. Restart with `claude` and complete the authentication process again

If the browser doesn't open automatically during login, press `c` to copy the OAuth URL to your clipboard.

### OAuth error: Invalid code

Press Enter to retry and complete the login quickly after the browser opens. Type `c` to copy the full URL if the browser doesn't open automatically.

### 403 Forbidden after login

* **Claude Pro/Max users**: verify your subscription is active at [claude.ai/settings](https://claude.ai/settings)
* **Console users**: confirm your account has the "Claude Code" or "Developer" role
* **Behind a proxy**: see [network configuration](/en/network-config)

### "This organization has been disabled" with an active subscription

An `ANTHROPIC_API_KEY` environment variable is overriding your subscription. Unset it:

```bash  theme={null}
unset ANTHROPIC_API_KEY
claude
```

Check `~/.zshrc`, `~/.bashrc`, or `~/.profile` for `export ANTHROPIC_API_KEY=...` lines and remove them.

### OAuth login fails in WSL2

Set the `BROWSER` environment variable:

```bash  theme={null}
export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
claude
```

Or press `c` to copy the OAuth URL, then paste it into your Windows browser.

### "Not logged in" or token expired

Run `/login` to re-authenticate. Check that your system clock is accurate.

## Configuration file locations

| File                          | Purpose                                                                                                |
| :---------------------------- | :----------------------------------------------------------------------------------------------------- |
| `~/.claude/settings.json`     | User settings (permissions, hooks, model overrides)                                                    |
| `.claude/settings.json`       | Project settings (checked into source control)                                                         |
| `.claude/settings.local.json` | Local project settings (not committed)                                                                 |
| `~/.claude.json`              | Global state (theme, OAuth, MCP servers)                                                               |
| `.mcp.json`                   | Project MCP servers (checked into source control)                                                      |
| `managed-mcp.json`            | [Managed MCP servers](/en/mcp#managed-mcp-configuration)                                               |
| Managed settings              | [Managed settings](/en/settings#settings-files) (server-managed, MDM/OS-level policies, or file-based) |

### Resetting configuration

```bash  theme={null}
# Reset all user settings and state
rm ~/.claude.json
rm -rf ~/.claude/

# Reset project-specific settings
rm -rf .claude/
rm .mcp.json
```

## Performance and stability

### High CPU or memory usage

1. Use `/compact` regularly to reduce context size
2. Close and restart Claude Code between major tasks
3. Add large build directories to your `.gitignore` file

### Command hangs or freezes

1. Press Ctrl+C to attempt to cancel the current operation
2. If unresponsive, close the terminal and restart

### Search and discovery issues

If Search tool, `@file` mentions, custom agents, and custom skills aren't working, install system `ripgrep`:

```bash  theme={null}
brew install ripgrep       # macOS
winget install BurntSushi.ripgrep.MSVC  # Windows
sudo apt install ripgrep  # Ubuntu/Debian
apk add ripgrep           # Alpine Linux
pacman -S ripgrep         # Arch Linux
```

Then set `USE_BUILTIN_RIPGREP=0` in your [environment](/en/env-vars).

### Slow or incomplete search results on WSL

Disk read performance penalties when working across file systems on WSL may result in fewer-than-expected matches.

**Solutions:**

1. Submit more specific searches with directories or file types
2. Move project to Linux filesystem (`/home/`) rather than Windows filesystem (`/mnt/c/`)
3. Use native Windows instead of WSL for better file system performance

## IDE integration issues

### JetBrains IDE not detected on WSL2

**Option 1: Configure Windows Firewall**

1. Find your WSL2 IP: `wsl hostname -I`
2. Open PowerShell as Administrator:
   ```powershell  theme={null}
   New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
   ```
3. Restart both your IDE and Claude Code

**Option 2: Switch to mirrored networking**

Add to `.wslconfig` in your Windows user directory:

```ini  theme={null}
[wsl2]
networkingMode=mirrored
```

Then restart WSL with `wsl --shutdown` from PowerShell.

### Escape key not working in JetBrains IDE terminals

1. Go to Settings → Tools → Terminal
2. Either uncheck "Move focus to the editor with Escape", or delete the "Switch focus to Editor" shortcut

## Markdown formatting issues

### Missing language tags in code blocks

1. Ask Claude to add language tags: "Add appropriate language tags to all code blocks in this markdown file."
2. Use post-processing hooks to detect and add missing language tags
3. Review generated markdown files after creation

### Reduce markdown formatting issues

* Be explicit in requests: ask for "properly formatted markdown with language-tagged code blocks"
* Use project conventions: document your preferred markdown style in [`CLAUDE.md`](/en/memory)
* Set up validation hooks to automatically verify and fix common formatting issues

## Get more help

1. Use the `/feedback` command within Claude Code to report problems directly to Anthropic
2. Check the [GitHub repository](https://github.com/anthropics/claude-code) for known issues
3. Run `/doctor` to diagnose issues. It checks:
   * Installation type, version, and search functionality
   * Auto-update status and available versions
   * Invalid settings files (malformed JSON, incorrect types)
   * MCP server configuration errors
   * Keybinding configuration problems
   * Context usage warnings (large CLAUDE.md files, high MCP token usage, unreachable permission rules)
   * Plugin and agent loading errors
4. Ask Claude directly about its capabilities and features — Claude has built-in access to its documentation
> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.
