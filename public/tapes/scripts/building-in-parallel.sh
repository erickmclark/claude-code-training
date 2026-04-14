#!/bin/bash
# Auto-generated Claude Code session demo
# Lesson 38: Building in Parallel

clear
echo -e "\033[90m[Opus] 📁 my-app | 🌿 main\033[0m"
sleep 0.8
echo -e "\033[90m# Create three worktrees for parallel work:\033[0m"
sleep 0.4
echo -e "\033[33m● Bash\033[0m git worktree add ../proj-search-bar -b feat/search-bar"
sleep 0.8
echo -e "\033[33m● Bash\033[0m git worktree add ../proj-search-api -b feat/search-api"
sleep 0.8
echo -e "\033[33m● Bash\033[0m git worktree add ../proj-search-tests -b feat/search-tests"
sleep 0.8
echo -e "\033[90m# Or let Claude Code handle it:\033[0m"
sleep 0.4
echo -e "\n\033[1;36m❯\033[0m claude --worktree feat/search-bar"
sleep 1.2
echo -e "\n\033[1;32m✓ Done\033[0m — Building in Parallel"
sleep 3.0