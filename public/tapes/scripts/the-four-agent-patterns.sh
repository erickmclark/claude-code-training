#!/bin/bash
# Auto-generated Claude Code session demo
# Lesson 41: The Four Agent Patterns

clear
echo -e "\033[90m[Opus] 📁 my-app | 🌿 main\033[0m"
sleep 0.8
echo -e "\033[90m# .claude/commands/research-and-write.md\033[0m"
sleep 0.4
echo -e "  ---"
sleep 0.4
echo -e "  description: Research a topic, then draft a blog post from the findings"
sleep 0.4
echo -e "  ---"
sleep 0.4
echo -e "  1. Use the Explore subagent to research \"\$ARGUMENTS\". Save findings to .claude/scratch/research.md."
sleep 0.4
echo -e "  2. Read .claude/scratch/research.md."
sleep 0.4
echo -e "  3. Use the general-purpose subagent to draft a 600-word blog post based on the findings. Write it to drafts/\$ARGUMENTS.md."
sleep 0.4
echo -e "  4. Read the draft and report the file path."
sleep 0.4
echo -e "\n\033[1;32m✓ Done\033[0m — The Four Agent Patterns"
sleep 3.0