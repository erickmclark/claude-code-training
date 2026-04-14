/**
 * Maps each lesson ID to the official documentation files that cover its topic.
 * Used by the AI enrichment API to ground responses in authoritative source material.
 * Files are relative to .claude/docs/official/
 */
export const lessonDocMap: Record<number, string[]> = {
  1: ['workflows-part-1.md'],                                      // Parallel Execution
  2: ['workflows-part-2.md'],                                      // Plan Mode Mastery
  3: ['claude-md.md'],                                             // CLAUDE.md Files
  4: ['workflows-part-2.md'],                                      // Git Worktrees
  5: ['cli-reference.md'],                                         // Voice Dictation
  6: ['workflows-part-1.md', 'chrome.md'],                         // Verification Loops
  7: ['workflows-part-1.md'],                                      // /batch Parallelization
  8: ['sub-agents-part-1.md', 'sub-agents-part-2.md'],             // Custom Agents
  9: ['skills-part-1.md'],                                         // Slash Commands
  10: ['hooks-part-1.md', 'hooks-part-2.md'],                      // Hooks & Automation
  11: ['remote-control.md'],                                       // Mobile Control
  12: ['workflows-part-1.md', 'workflows-part-2.md'],              // Advanced Mastery
  13: ['claude-md.md'],                                            // CLAUDE.local.md
  14: ['cli-reference.md'],                                        // Checkpointing & /rewind
  15: ['cli-reference.md'],                                        // Ultraplan
  16: ['channels.md'],                                             // Channels
  17: ['agent-teams.md'],                                          // Agent Teams
  18: ['computer-use.md'],                                         // Computer Use
  19: ['mcp.md'],                                                  // MCP Integrations
  20: ['workflows-part-1.md'],                                     // Cost Management
  21: ['workflows-part-2.md'],                                     // Extended Thinking
  22: ['claude-md.md'],                                            // Context Management
  23: ['workflows-part-2.md'],                                     // Session Management
  24: ['skills-part-1.md', 'skills-part-2.md'],                    // Skills System
  25: ['vs-code.md', 'jetbrains.md'],                              // IDE Integration
  26: ['headless.md'],                                             // Headless Mode
  27: ['chrome.md'],                                               // Chrome Extension
  28: ['github-actions.md', 'gitlab-ci.md', 'code-review-ci.md'], // CI/CD
  29: ['plugins.md', 'discover-plugins.md'],                       // Plugins & Marketplaces
  30: ['slack.md', 'scheduled-tasks.md', 'remote-control.md'],     // Slack, Scheduling & Remote
  34: ['overview.md', 'features-overview.md'],                     // What is Claude Code
  31: ['web.md'],                                                  // Claude Code on the Web
  32: ['desktop.md'],                                              // Desktop App
  33: ['security.md'],                                             // Permission Modes & Security
  41: ['sub-agents-part-1.md', 'sub-agents-part-2.md', 'agent-teams.md'], // The Four Agent Patterns
  43: ['claude-md.md', 'workflows-part-1.md'],                     // Prompt Caching In Practice
};
