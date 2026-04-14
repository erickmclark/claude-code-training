#!/bin/bash
# Auto-generated Claude Code session demo
# Lesson 24: Skills System Deep Dive

clear
echo -e "\033[90m[Opus] 📁 my-app | 🌿 main\033[0m"
sleep 0.8
echo -e "\033[90m# Option 1: Plain command (simple)\033[0m"
sleep 0.4
echo -e "  .claude/commands/commit.md"
sleep 0.4
echo -e "\033[90m# Content: \\\"Create a commit message for the staged changes\\\"\033[0m"
sleep 0.4
echo -e "\033[90m# Invoked: /commit\033[0m"
sleep 0.4
echo -e "\033[90m# Option 2: Full skill (recommended for reusable workflows)\033[0m"
sleep 0.4
echo -e "  .claude/skills/commit/SKILL.md"
sleep 0.4
echo -e "\033[90m# Content: YAML frontmatter + detailed instructions\033[0m"
sleep 0.4
echo -e "\033[90m# Invoked: /commit\033[0m"
sleep 0.4
echo -e "\033[90m# Both work. Skills add:\033[0m"
sleep 0.4
echo -e "\033[90m# - YAML frontmatter control\033[0m"
sleep 0.4
echo -e "\033[90m# - \\\$ARGUMENTS substitution\033[0m"
sleep 0.4
echo -e "\033[90m# - disable-model-invocation\033[0m"
sleep 0.4
echo -e "\033[90m# - context: fork isolation\033[0m"
sleep 0.4
echo -e "\n\033[1;32m✓ Done\033[0m — Skills System Deep Dive"
sleep 3.0