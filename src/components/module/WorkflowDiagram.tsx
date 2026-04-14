'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLessonById, getModuleForLesson } from '@/src/data/lessons/index';

// ─── Module badge palette ──────────────────────────────────────────────
// Maps a canonical module id (from data/modules.ts) to its badge styling.
// The 14 workflow nodes all belong to modules 1-4; if a node ever points
// to a lesson outside these modules, the badge falls back to a neutral grey.
type ModuleBadgeKey = 'mod1' | 'mod2' | 'mod3' | 'mod4';

const MODULE_BADGES: Record<ModuleBadgeKey, { bg: string; color: string; border: string }> = {
  mod1: { bg: '#e6f3e6', color: '#2d6b2d', border: '#2d6b2d' }, // Foundations — green
  mod2: { bg: '#e6f1fb', color: '#185fa5', border: '#185fa5' }, // Core Workflows — blue
  mod3: { bg: '#fef3e2', color: '#8a5500', border: '#8a5500' }, // Automation — amber
  mod4: { bg: '#fce8e4', color: '#8a2a10', border: '#8a2a10' }, // Agent Architecture — coral
};

const MODULE_ID_TO_BADGE: Record<number, ModuleBadgeKey> = {
  1: 'mod1',
  2: 'mod2',
  3: 'mod3',
  4: 'mod4',
};

// ─── Phase definitions ─────────────────────────────────────────────────
type PhaseId = 'plan' | 'build' | 'verify' | 'ship';

const PHASES: { id: PhaseId; num: string; name: string; icon: string }[] = [
  { id: 'plan',   num: 'Phase 01', name: 'Plan',   icon: '🗺️' },
  { id: 'build',  num: 'Phase 02', name: 'Build',  icon: '⚙️' },
  { id: 'verify', num: 'Phase 03', name: 'Verify', icon: '🔍' },
  { id: 'ship',   num: 'Phase 04', name: 'Ship',   icon: '🚀' },
];

// ─── Node data ─────────────────────────────────────────────────────────
interface WorkflowNode {
  id: string;
  phase: PhaseId;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  when: string;
  connects: string[]; // node titles (not ids) for cross-phase navigation
  tip: string;
  command: string;
  lessonId: number;
}

const NODES: WorkflowNode[] = [
  // ─── Plan ───
  {
    id: 'ultraplan',
    phase: 'plan',
    icon: '☁️',
    title: 'Ultraplan',
    subtitle: 'Cloud planning, browser review',
    description:
      'Type /ultraplan and Claude spins up a 30-minute Opus session in the cloud. Your terminal stays free. When done, open the browser link to review with inline comments, iterate, then approve to execute locally or in cloud.',
    when:
      'Use for large features, multi-repo changes, or when you need team sign-off before a single line of code gets written.',
    connects: ['Plan Mode', 'CLAUDE.md'],
    tip: 'Always commit and push before running /ultraplan — it snapshots your repo at that moment.',
    command:
      '/ultraplan migrate auth service to JWTs\n◇ ultraplan # Researching codebase...\n◆ ultraplan ready # Open link to review',
    lessonId: 15,
  },
  {
    id: 'planmode',
    phase: 'plan',
    icon: '🗺️',
    title: 'Plan Mode',
    subtitle: 'Review before Claude touches files',
    description:
      'Shift+Tab cycles Normal → Auto → Plan. In Plan Mode Claude shows you the exact files it will touch and the order of changes — nothing executes until you approve. Reject any plan that says "update related files" without naming them.',
    when:
      'Any change touching 3+ files. Refactors, migrations, new features. Skip for single-line fixes and typos.',
    connects: ['Ultraplan', 'CLAUDE.md', 'Worktrees', '/rewind'],
    tip: 'Read the plan like a code review. Look for missing test steps and vague file references.',
    command:
      '# Press Shift+Tab until you see:\n[Plan Mode] Type your prompt...\n\nRefactor auth to use JWT tokens',
    lessonId: 2,
  },
  {
    id: 'claudemd',
    phase: 'plan',
    icon: '📋',
    title: 'CLAUDE.md',
    subtitle: 'Rules loaded every session',
    description:
      'A markdown file in your project root that Claude reads at the start of every session. Defines your stack, coding standards, rules, and preferences. Keep it under 200 lines or rules at the bottom get ignored. Use CLAUDE.local.md for personal prefs.',
    when:
      'Every project. Set it up once, update it whenever you notice Claude repeating the same mistake.',
    connects: ['Plan Mode', 'Hooks', 'Slash commands'],
    tip: 'When Claude ignores a rule, add a stronger version to CLAUDE.md immediately. Treat it as a living rulebook.',
    command:
      '# In project root:\n# ./CLAUDE.md\n\nStack: React + TypeScript + Supabase\nNever use any types\nAlways write tests',
    lessonId: 3,
  },

  // ─── Build ───
  {
    id: 'worktrees',
    phase: 'build',
    icon: '🌿',
    title: 'Worktrees',
    subtitle: 'Parallel isolated sessions',
    description:
      'git worktree add lets Claude work in an isolated copy of your repo simultaneously. Multiple worktrees = multiple Claude sessions on different features with no conflicts. Merge in dependency order: schema first, then API, then UI.',
    when:
      'Any time you have 2+ independent tasks that could run simultaneously. Major productivity unlock.',
    connects: ['Agent teams', 'Model routing', 'Plan Mode'],
    tip: 'Merge order matters: always merge the foundation (database/schema) before dependent layers.',
    command:
      '# Create isolated worktree:\ngit worktree add ../feature-auth -b feature/auth\ncd ../feature-auth && claude',
    lessonId: 4,
  },
  {
    id: 'models',
    phase: 'build',
    icon: '💰',
    title: 'Model routing',
    subtitle: 'Right model for each task',
    description:
      'Opus for planning and architecture. Sonnet for implementation. Haiku for tests, formatting, and migrations. Routing correctly saves ~40% of your API costs. Use /model to switch mid-session.',
    when:
      'Every session. Default to Sonnet. Switch to Opus for complex planning, Haiku for repetitive tasks.',
    connects: ['Worktrees', 'Agent teams', '/rewind'],
    tip: "The biggest mistake: using Opus for everything. You'll blow your budget in 20 minutes on complex builds.",
    command:
      '# Switch model mid-session:\n/model haiku   # for writing tests\n/model sonnet  # for implementation\n/cost          # check spend so far',
    lessonId: 20,
  },
  {
    id: 'voice',
    phase: 'build',
    icon: '🎙️',
    title: 'Voice dictation',
    subtitle: 'Richer prompts, faster',
    description:
      'Dictating complex prompts produces 3-4x more context than typing. Your natural speech includes assumptions, edge cases, and nuance that typing omits. Use for the initial feature prompt, not back-and-forth corrections.',
    when:
      'Complex feature descriptions, architecture decisions, anything requiring detailed context.',
    connects: ['Plan Mode', 'Worktrees'],
    tip: 'Speak as if briefing a senior engineer. Include what you want, what to avoid, and why.',
    command:
      '# No command — enable in Claude Code settings\n# Microphone icon in the input bar\n# Speak your full prompt naturally',
    lessonId: 5,
  },
  {
    id: 'agents',
    phase: 'build',
    icon: '👥',
    title: 'Agent teams',
    subtitle: 'Coordinated parallel work',
    description:
      'Enable with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. A lead agent breaks down work, spawns specialists in isolated worktrees, manages inter-agent messaging. Each teammate owns different files to avoid conflicts.',
    when:
      'Complex features with interdependent components where teammates need to share status. More tokens — use deliberately.',
    connects: ['Worktrees', 'Model routing', 'Hooks'],
    tip: '5-6 tasks per teammate is ideal. Too many agents = too much coordination overhead.',
    command:
      '# In settings.json env:\nCLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1\n\n# Then describe the team in your prompt',
    lessonId: 17,
  },

  // ─── Verify ───
  {
    id: 'verify',
    phase: 'verify',
    icon: '🔍',
    title: 'Verification loops',
    subtitle: 'Visual + test + manual',
    description:
      'Three layers: automated test suite, visual browser check, manual review. Set up a Stop hook to run tests after every Claude response automatically. Catch regressions before they reach your PR.',
    when:
      'After every significant change. Set up the hook once and let it run automatically.',
    connects: ['Hooks', 'Computer use', '/rewind'],
    tip: "Boris's rule: never mark something done until you've seen it work in the browser with your own eyes.",
    command:
      '# In .claude/settings.json:\n"hooks": {\n  "Stop": [{"command": "npm test"}]\n}',
    lessonId: 6,
  },
  {
    id: 'hooks',
    phase: 'verify',
    icon: '🪝',
    title: 'Hooks',
    subtitle: 'Automation on every action',
    description:
      'Shell commands that fire automatically on Claude events. PostToolUse runs Prettier after every edit. PreToolUse blocks .env writes. Stop runs your test suite. Encode your team standards into automation once.',
    when:
      'Always. Set up at minimum: auto-format on edit, auto-test on stop, lint before commit.',
    connects: ['Verification loops', 'CLAUDE.md', 'Slash commands'],
    tip: 'A hook that blocks .env edits is worth more than any warning in CLAUDE.md.',
    command:
      '"hooks": {\n  "PostToolUse": [{"command":"prettier --write $FILE"}],\n  "PreToolUse": [{"command":"check-env-protection"}]\n}',
    lessonId: 10,
  },
  {
    id: 'rewind',
    phase: 'verify',
    icon: '⏪',
    title: '/rewind',
    subtitle: 'Roll back without losing state',
    description:
      'Press Esc twice to open the rewind menu. Roll back to any checkpoint in the session without losing your conversation state. Use when Claude has gone down the wrong path 2+ times and context is cluttered.',
    when:
      "When you've corrected Claude on the same issue 2+ times. When the context has too many failed attempts.",
    connects: ['Plan Mode', 'Verification loops', 'Model routing'],
    tip: "Don't keep trying to fix a bad path — rewind to before it happened and give Claude better framing.",
    command:
      '# Press Esc twice to open rewind menu\n# Select the checkpoint before things\n# went wrong, then re-prompt',
    lessonId: 14,
  },
  {
    id: 'computeruse',
    phase: 'verify',
    icon: '🖥️',
    title: 'Computer use',
    subtitle: 'Visual UI verification',
    description:
      'Claude can open macOS apps, click, type, and see your screen. Use for visual verification of UI changes, testing native apps without a test suite, comparing implementation against design mockups.',
    when:
      'UI changes needing visual verification. Native apps with no automated tests. Figma-to-code comparison.',
    connects: ['Verification loops', 'Agent teams'],
    tip: 'Close unrelated apps first — Claude sees your full screen and can interact with anything visible.',
    command:
      '# Enable in Claude Code settings\n# Computer use toggle → On\n\n"Check that the dashboard\n layout matches the mockup"',
    lessonId: 18,
  },

  // ─── Ship ───
  {
    id: 'slash',
    phase: 'ship',
    icon: '⚡',
    title: 'Slash commands',
    subtitle: '/deploy, /review-pr, /commit',
    description:
      'Custom commands in .claude/skills/ that package repeatable workflows. /deploy enforces lint → test → build → deploy order. /review-pr runs your security agent. Always include abort conditions for safety.',
    when:
      'Any workflow you repeat more than 3 times. Deploy, review, migrate, format — all deserve a slash command.',
    connects: ['Hooks', 'MCP integrations', 'CLAUDE.md'],
    tip: 'A good slash command never asks for confirmation on destructive actions — it enforces safe order by design.',
    command:
      '# In .claude/skills/deploy/SKILL.md:\n# Run: lint → test → build → deploy\n# Abort if any step fails\n/deploy staging',
    lessonId: 9,
  },
  {
    id: 'mcp',
    phase: 'ship',
    icon: '🔌',
    title: 'MCP integrations',
    subtitle: 'GitHub, Slack, CI/CD, Sentry',
    description:
      "Model Context Protocol connects Claude to external tools. GitHub Actions for CI status. Sentry for error logs. Slack for team comms. BigQuery for analytics. Claude pulls data on demand when it decides it's relevant.",
    when:
      'When you find yourself pasting logs, CI output, or external data into Claude manually.',
    connects: ['Channels', 'Slash commands', 'Agent teams'],
    tip: 'MCP pulls (Claude asks). Channels push (external triggers Claude). Use both together.',
    command:
      '# In .claude/settings.json:\n"mcpServers": {\n  "github": {"command": "mcp-github"}\n}',
    lessonId: 19,
  },
  {
    id: 'channels',
    phase: 'ship',
    icon: '📡',
    title: 'Channels',
    subtitle: 'Push events to Claude',
    description:
      'External systems push events into a running Claude session. CI fails at 3am → channel wakes Claude → Claude investigates. Sentry spike → Claude queries logs automatically. Reactive automation without you at the keyboard.',
    when:
      'Production monitoring, CI pipelines, Slack bug reports. When you want Claude to act on events, not wait for prompts.',
    connects: ['MCP integrations', 'Hooks', 'Agent teams'],
    tip: 'Channels + hooks = a fully autonomous quality loop. CI fails → Claude investigates → hook verifies the fix.',
    command:
      '# Claude receives CI failure:\nChannel: github-actions\nEvent: test_failed\nPayload: {run_id, logs_url}\n→ Claude investigates automatically',
    lessonId: 16,
  },
];

// Lookup helpers ─────────────────────────────────────────────────────────
const NODES_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n] as const));
const NODES_BY_TITLE = Object.fromEntries(NODES.map((n) => [n.title, n] as const));

function getBadgeForLesson(lessonId: number): {
  badge: ModuleBadgeKey | null;
  label: string;
} {
  const mod = getModuleForLesson(lessonId);
  if (!mod) return { badge: null, label: 'Module' };
  // mod.title is "Module N: Subtitle" — keep the "Module N" part for the badge label.
  const label = mod.title.split(':')[0]?.trim() ?? mod.title;
  const badge = MODULE_ID_TO_BADGE[mod.id] ?? null;
  return { badge, label };
}

// ─── Component ─────────────────────────────────────────────────────────
interface WorkflowDiagramProps {
  /**
   * - "wide" (default): full-width standalone layout. Phase tabs across the
   *   top, then a side-by-side split (nodes left, sticky detail right) on
   *   viewports ≥ 1024px, falling back to stacked below that.
   * - "narrow": force a stacked internal layout regardless of viewport.
   *   Used when the diagram is rendered inside a narrower parent column
   *   (e.g., LessonPage's lesson-36 2-column layout where the map sits in
   *   the right rail next to the lesson text).
   */
  layout?: 'wide' | 'narrow';
}

export default function WorkflowDiagram({ layout = 'wide' }: WorkflowDiagramProps) {
  const [currentPhase, setCurrentPhase] = useState<PhaseId>('plan');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Side-by-side layout above 1024px, stacked below. Hydration-safe: SSR
  // returns false (assume narrow / stacked); the client switches after mount.
  // In "narrow" mode this is forced false so the inner grid is always stacked.
  const [isViewportWide, setIsViewportWide] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsViewportWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // The internal map+detail split is side-by-side ONLY when both
  // (a) the parent allows it (layout === 'wide') AND
  // (b) the viewport is wide enough to fit it.
  const isWide = layout === 'wide' && isViewportWide;

  const selectedNode = selectedNodeId ? NODES_BY_ID[selectedNodeId] : null;

  const visibleNodes = NODES.filter((n) => n.phase === currentPhase);

  const isConnectedToSelected = (node: WorkflowNode): boolean => {
    if (!selectedNode) return true;
    if (node.id === selectedNode.id) return true;
    return selectedNode.connects.includes(node.title);
  };

  const handlePhaseClick = (phase: PhaseId) => {
    setCurrentPhase(phase);
    setSelectedNodeId(null);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const jumpToNodeByTitle = (title: string) => {
    const target = NODES_BY_TITLE[title];
    if (!target) return;
    if (target.phase !== currentPhase) {
      setCurrentPhase(target.phase);
    }
    setSelectedNodeId(target.id);
  };

  // Highlight the active phase pills if a node from that phase is selected or
  // if the selected node connects to a node in that phase.
  const isPhasePillActive = (pillNode: WorkflowNode): boolean => {
    if (!selectedNode) return false;
    if (pillNode.id === selectedNode.id) return true;
    return selectedNode.connects.includes(pillNode.title);
  };

  return (
    <div style={{ maxWidth: layout === 'wide' ? 1280 : '100%', margin: '0 auto' }}>
      {/* Self-contained keyframes — keeps the component portable. */}
      <style>{`
        @keyframes wfFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wfSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wfGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(204, 92, 56, 0); } 50% { box-shadow: 0 0 0 4px rgba(204, 92, 56, 0.15); } }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
          animation: 'wfFadeUp 0.4s ease both',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: 'var(--color-coral)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M9 3l6 6-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 500,
              color: 'var(--color-ink)',
            }}
          >
            The 10x Workflow Map
          </div>
        </div>
        <span
          style={{
            fontSize: 12,
            color: 'var(--color-hint)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Click any node to explore
        </span>
      </div>

      {/* ── Phase tabs ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: 20,
          animation: 'wfFadeUp 0.4s ease 0.05s both',
        }}
      >
        {PHASES.map((phase) => {
          const phaseNodes = NODES.filter((n) => n.phase === phase.id);
          const isActive = currentPhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => handlePhaseClick(phase.id)}
              type="button"
              style={{
                background: isActive ? 'var(--color-coral-light)' : '#fff',
                border: `0.5px solid ${isActive ? 'var(--color-coral)' : 'var(--color-border)'}`,
                borderRadius: 12,
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
              }}
            >
              {/* underline accent */}
              <span
                style={{
                  content: "''",
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: 'var(--color-coral)',
                  transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.2s',
                  display: 'block',
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-coral)' : 'var(--color-hint)',
                  marginBottom: 6,
                }}
              >
                {phase.num}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: isActive ? 'var(--color-coral-dark)' : 'var(--color-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{phase.icon}</span>
                {phase.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {phaseNodes.slice(0, 3).map((node) => {
                  const pillActive = isPhasePillActive(node);
                  return (
                    <span
                      key={node.id}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentPhase !== phase.id) setCurrentPhase(phase.id);
                        setSelectedNodeId(node.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          if (currentPhase !== phase.id) setCurrentPhase(phase.id);
                          setSelectedNodeId(node.id);
                        }
                      }}
                      style={{
                        fontSize: 11,
                        color: pillActive ? 'var(--color-coral)' : 'var(--color-hint)',
                        fontWeight: pillActive ? 500 : 400,
                        padding: '2px 0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: pillActive ? 'var(--color-coral)' : 'var(--color-muted)',
                          flexShrink: 0,
                        }}
                      />
                      {node.title}
                    </span>
                  );
                })}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: isActive ? '#f0c4b0' : 'var(--color-muted)',
                  marginTop: 6,
                }}
              >
                {phaseNodes.length} techniques
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Map + Detail (side-by-side on desktop, stacked on narrow viewports) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isWide ? '1.4fr 1fr' : '1fr',
          gap: 20,
          marginBottom: 20,
          alignItems: 'start',
          animation: 'wfFadeUp 0.4s ease 0.1s both',
        }}
      >
        {/* ── Nodes column ── */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-hint)',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-body)',
            }}
          >
            {PHASES.find((p) => p.id === currentPhase)?.name} phase — techniques
            <span style={{ flex: 1, height: 0.5, background: 'var(--color-border)' }} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}
          >
            {visibleNodes.map((node, i) => {
              const isSelected = selectedNodeId === node.id;
              const isDimmed = selectedNode !== null && !isConnectedToSelected(node);
              const { badge, label } = getBadgeForLesson(node.lessonId);
              const badgeStyle = badge ? MODULE_BADGES[badge] : { bg: 'var(--color-sand)', color: 'var(--color-secondary)', border: 'var(--color-border)' };

              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  type="button"
                  style={{
                    background: isSelected ? 'var(--color-coral-light)' : '#fff',
                    border: `0.5px solid ${isSelected ? 'var(--color-coral)' : 'var(--color-border)'}`,
                    borderRadius: 12,
                    padding: '18px 22px',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                    position: 'relative',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    opacity: isDimmed ? 0.3 : 1,
                    animation: `wfFadeUp 0.35s ease ${i * 0.06}s both${isSelected ? ', wfGlow 1.5s ease' : ''}`,
                  }}
                >
                  <span style={{ fontSize: 22, marginBottom: 9, display: 'block' }}>{node.icon}</span>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: isSelected ? 'var(--color-coral-dark)' : 'var(--color-ink)',
                      marginBottom: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    {node.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-hint)',
                      lineHeight: 1.45,
                    }}
                  >
                    {node.subtitle}
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      fontSize: 9,
                      fontWeight: 500,
                      padding: '2px 7px',
                      borderRadius: 8,
                      background: badgeStyle.bg,
                      color: badgeStyle.color,
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail column (sticky on wide viewports) ── */}
        <div
          style={{
            position: isWide ? 'sticky' : 'static',
            top: 16,
            animation: 'wfFadeUp 0.4s ease 0.15s both',
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '0.5px solid var(--color-border)',
              borderRadius: 14,
              overflow: 'hidden',
              minHeight: 200,
              transition: 'all 0.2s',
            }}
          >
            {!selectedNode ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 24px',
                  gap: 10,
                  minHeight: 200,
                }}
              >
                <span style={{ fontSize: 32, opacity: 0.3 }}>{isWide ? '←' : '↑'}</span>
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--color-muted)',
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.55,
                  }}
                >
                  Select any node {isWide ? 'on the left' : 'above'} to see how it fits
                  <br />
                  into the full 10x workflow
                </span>
              </div>
            ) : (
              <DetailContent
                node={selectedNode}
                jumpToNodeByTitle={jumpToNodeByTitle}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginTop: 14,
          paddingTop: 12,
          borderTop: '0.5px solid var(--color-border)',
          animation: 'wfFadeUp 0.4s ease 0.2s both',
        }}
      >
        {[
          { key: 'mod1' as const, label: 'Module 1 — Foundations' },
          { key: 'mod2' as const, label: 'Module 2 — Core Workflows' },
          { key: 'mod3' as const, label: 'Module 3 — Automation' },
          { key: 'mod4' as const, label: 'Module 4 — Agent Architecture' },
        ].map((item) => {
          const c = MODULE_BADGES[item.key];
          return (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                color: 'var(--color-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: c.bg,
                  border: `0.5px solid ${c.border}`,
                }}
              />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail panel ──────────────────────────────────────────────────────
function DetailContent({
  node,
  jumpToNodeByTitle,
}: {
  node: WorkflowNode;
  jumpToNodeByTitle: (title: string) => void;
}) {
  const lesson = getLessonById(node.lessonId);
  const { badge, label } = getBadgeForLesson(node.lessonId);
  const badgeStyle = badge ? MODULE_BADGES[badge] : { bg: 'var(--color-sand)', color: 'var(--color-secondary)', border: 'var(--color-border)' };

  return (
    <div
      style={{
        padding: '22px 24px',
        animation: 'wfSlideIn 0.25s ease both',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header — icon + title + module badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 24 }}>{node.icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 19,
            fontWeight: 500,
            color: 'var(--color-ink)',
          }}
        >
          {node.title}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: 10,
            background: badgeStyle.bg,
            color: badgeStyle.color,
            fontFamily: 'var(--font-body)',
          }}
        >
          {label}
        </span>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.7,
          color: 'var(--color-body)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {node.description}
      </div>

      {/* When to use callout */}
      <div
        style={{
          background: 'var(--color-sand)',
          borderRadius: 9,
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-hint)',
            marginBottom: 5,
            fontFamily: 'var(--font-body)',
          }}
        >
          When to use
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-body)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)',
          }}
        >
          {node.when}
        </div>
      </div>

      {/* Connects with */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-hint)',
            marginBottom: 6,
            fontFamily: 'var(--font-body)',
          }}
        >
          Connects with
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {node.connects.map((title) => {
            const exists = !!NODES_BY_TITLE[title];
            return (
              <button
                key={title}
                onClick={() => jumpToNodeByTitle(title)}
                type="button"
                disabled={!exists}
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  background: 'var(--color-sand)',
                  color: 'var(--color-body)',
                  borderRadius: 20,
                  cursor: exists ? 'pointer' : 'not-allowed',
                  border: '0.5px solid var(--color-border)',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                  opacity: exists ? 1 : 0.5,
                }}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro tip card */}
      <div
        style={{
          background: 'var(--color-cream)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 9,
          padding: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--color-coral)',
            marginBottom: 4,
            fontFamily: 'var(--font-body)',
          }}
        >
          ★ Pro tip
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-body)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)',
          }}
        >
          {node.tip}
        </div>
      </div>

      {/* Command reference — terminal-styled */}
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-hint)',
            marginBottom: 6,
            fontFamily: 'var(--font-body)',
          }}
        >
          Command reference
        </div>
        <pre
          style={{
            background: 'var(--color-ink)',
            borderRadius: 8,
            padding: '12px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#e8e4de',
            lineHeight: 1.6,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {node.command}
        </pre>
      </div>

      {/*
        Intentional exception: this is the ONLY place in the app that routes to
        /lesson/[id]/intro. The workflow map is a "preview/onboarding" experience,
        so the intro splash is the right destination here. Don't normalize this
        back to /lesson/[id] in a future cleanup.
      */}
      <Link
        href={`/lesson/${node.lessonId}/intro`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
          padding: '12px 18px',
          background: 'var(--color-coral)',
          borderRadius: 9,
          border: 'none',
          textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          marginTop: 4,
        }}
      >
        → Jump to {lesson ? `Lesson ${node.lessonId}: ${lesson.title}` : `Lesson ${node.lessonId}`}
      </Link>
    </div>
  );
}
