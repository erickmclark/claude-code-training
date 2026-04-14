#!/bin/bash
# Auto-generated Claude Code session demo
# Lesson 26: Headless Mode & Scripting

clear
echo -e "\033[90m[Opus] 📁 my-app | 🌿 main\033[0m"
sleep 0.8
echo -e "\033[90m# Basic usage:\033[0m"
sleep 0.4
echo -e "\n\033[1;36m❯\033[0m claude -p \"Summarize what this project does\""
sleep 1.2
echo -e "\033[90m# With file content:\033[0m"
sleep 0.4
echo -e "\n\033[1;36m❯\033[0m claude -p \"Explain this error\" < build-error.txt"
sleep 1.2
echo -e "\033[90m# Heredoc for multi-line prompts:\033[0m"
sleep 0.4
echo -e "\n\033[1;36m❯\033[0m claude -p \"\$(cat <<'EOF'"
sleep 1.2
echo -e "  Review these changes for security issues."
sleep 0.4
echo -e "  Focus on: injection, auth, secrets."
sleep 0.4
echo -e "  EOF"
sleep 0.4
echo -e "  )\""
sleep 0.4
echo -e "\033[90m# With stdin pipe:\033[0m"
sleep 0.4
echo -e "\033[33m● Bash\033[0m cat error.log | claude -p \"Find the root cause of this error\""
sleep 0.8
echo -e "\033[90m# Non-interactive means:\033[0m"
sleep 0.4
echo -e "\033[90m# - No session saved\033[0m"
sleep 0.4
echo -e "\033[90m# - Exits when prompt is answered\033[0m"
sleep 0.4
echo -e "\033[90m# - No permission prompts (unless you trigger them)\033[0m"
sleep 0.4
echo -e "\n\033[1;32m✓ Done\033[0m — Headless Mode & Scripting"
sleep 3.0