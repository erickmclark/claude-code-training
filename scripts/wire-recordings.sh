#!/bin/bash
# Maps each lesson to its GIF and adds recording: field to the first step.
# Only touches lessons that don't already have a recording wired.

FILE="data/lessons.ts"

add_recording() {
  local step_title="$1"
  local gif_name="$2"

  # Check if already has recording
  local line=$(grep -n "title: '$step_title'" "$FILE" | head -1 | cut -d: -f1)
  if [ -z "$line" ]; then
    echo "  ⚠ Step not found: $step_title"
    return
  fi

  local next_line=$((line + 1))
  local next_content=$(sed -n "${next_line}p" "$FILE")

  if echo "$next_content" | grep -q "recording:"; then
    echo "  ⏭ Already wired: $step_title"
    return
  fi

  # Insert recording: line after the title
  sed -i '' "${line}a\\
        recording: 'screenshots/${gif_name}.gif',
" "$FILE"
  echo "  ✓ Wired: $step_title → ${gif_name}.gif"
}

echo "Wiring recordings to lesson steps..."

# Lesson 1: Parallel Execution
add_recording "Run Multiple Sessions" "parallel-execution"

# Lesson 3: CLAUDE.md — already wired? Check first step title
add_recording "Create Your First CLAUDE.md" "claudemd-files"

# Lesson 5: Voice Dictation
add_recording "Enable Voice Mode" "voice-dictation"

# Lesson 7: /batch Parallelization
add_recording "Understand /batch" "batch-parallelization"

# Lesson 8: Custom Agents
add_recording "Create Agent Directory" "custom-agents"

# Lesson 11: Mobile Control
add_recording "Enable Remote Control" "mobile-control"

# Lesson 12: Advanced Mastery
add_recording "Challenge Claude on Quality" "advanced-mastery"

# Lesson 13: CLAUDE.local.md
add_recording "Create CLAUDE.local.md" "claude-local-md"

# Lesson 14: /rewind — already wired
# Lesson 15: Ultraplan
add_recording "Launch Ultraplan" "ultraplan"

# Lesson 16: Channels
add_recording "Understand Channels" "channels"

# Lesson 17: Agent Teams
add_recording "Enable Agent Teams" "agent-teams"

# Lesson 18: Computer Use
add_recording "Enable Computer Use" "computer-use"

# Lesson 19: MCP Integrations
add_recording "Understand MCP" "mcp-integrations"

# Lesson 20: Cost Management
add_recording "Three Models, Three Price Points" "cost-management"

# Lesson 21: Extended Thinking
add_recording "Set Effort Levels" "extended-thinking"

# Lesson 22: Context Management
add_recording "Understand the Context Window" "context-management"

# Lesson 23: Session Management
add_recording "Continue and Resume" "session-management"

# Lesson 24: Skills System
add_recording "Understand Skills" "skills-system"

# Lesson 25: IDE Integration
add_recording "VS Code Extension" "ide-integration"

# Lesson 26: Headless Mode
add_recording "Run Non-Interactive" "headless-mode"

# Lesson 27: Chrome Extension
add_recording "Connect Chrome" "chrome-extension"

# Lesson 28: CI/CD
add_recording "GitHub Actions Setup" "cicd"

# Lesson 29: Plugins
add_recording "Install Your First Plugin" "plugins"

# Lesson 30: Slack & Scheduling
add_recording "Claude in Slack" "slack-scheduling"

# Lesson 31: Web Sessions
add_recording "Start a Web Session" "web-sessions"

# Lesson 32: Desktop App
add_recording "The Code Tab" "desktop-app"

# Lesson 33: Permission Modes
add_recording "Choose a Permission Mode" "permission-modes"

# Lesson 37: Planning a Real Feature
add_recording "Start with a Vague Brief" "plan-mode"

# Lesson 38: Building in Parallel
add_recording "Find the Parallel Seams" "parallel-execution"

# Lesson 39: Verifying and Shipping
add_recording 'Define "Done"' "verification-loop"

# Lesson 40: When Things Go Wrong
add_recording "Spot the Signs Early" "rewind"

# Lesson 41: Agent Patterns
add_recording "The Four Patterns" "agent-patterns"

# Lesson 43: Prompt Caching
add_recording "What Gets Cached" "prompt-caching"

echo ""
echo "Done!"
