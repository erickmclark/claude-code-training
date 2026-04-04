const GAMIFICATION_KEY = 'claude-code-gamification';

interface XPEvent {
  type: 'task' | 'step' | 'quiz_answer' | 'quiz_perfect' | 'challenge' | 'module' | 'exam' | 'streak' | 'streak_bonus';
  xp: number;
  timestamp: string;
  detail?: string;
}

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  longestStreak: number;
  badges: string[];
}

const LEVELS = [
  { level: 1, title: 'Beginner', xpRequired: 0 },
  { level: 2, title: 'Apprentice', xpRequired: 300 },
  { level: 3, title: 'Practitioner', xpRequired: 800 },
  { level: 4, title: 'Specialist', xpRequired: 1500 },
  { level: 5, title: 'Expert', xpRequired: 2500 },
  { level: 6, title: 'Master', xpRequired: 4000 },
  { level: 7, title: '10x Engineer', xpRequired: 5000 },
];

const XP_TABLE: Record<XPEvent['type'], number> = {
  task: 100,
  step: 10,
  quiz_answer: 10,
  quiz_perfect: 50,
  challenge: 200,
  module: 150,
  exam: 500,
  streak: 25,
  streak_bonus: 100,
};

function defaultGamification(): GamificationState {
  return { xp: 0, level: 1, streak: 0, lastActiveDate: '', longestStreak: 0, badges: [] };
}

export function getGamification(): GamificationState {
  if (typeof window === 'undefined') return defaultGamification();
  const stored = localStorage.getItem(GAMIFICATION_KEY);
  if (!stored) return defaultGamification();
  try {
    return { ...defaultGamification(), ...JSON.parse(stored) };
  } catch {
    return defaultGamification();
  }
}

function saveGamification(state: GamificationState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
}

export function getLevel(xp: number): { level: number; title: string; xpRequired: number } {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp: number): {
  currentLevel: number;
  nextLevel: number | null;
  progressPercent: number;
  xpToNext: number;
} {
  const current = getLevel(xp);
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  if (nextIdx >= LEVELS.length) {
    return { currentLevel: current.level, nextLevel: null, progressPercent: 100, xpToNext: 0 };
  }
  const next = LEVELS[nextIdx];
  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = next.xpRequired - current.xpRequired;
  return {
    currentLevel: current.level,
    nextLevel: next.level,
    progressPercent: Math.round((xpInLevel / xpNeeded) * 100),
    xpToNext: xpNeeded - xpInLevel,
  };
}

export function addXP(
  type: XPEvent['type'],
): { newXp: number; xpGained: number; leveledUp: boolean; newLevel: number } {
  const gam = getGamification();
  const xpGained = XP_TABLE[type] || 0;
  const oldLevel = getLevel(gam.xp).level;
  gam.xp += xpGained;
  const newLevelInfo = getLevel(gam.xp);
  gam.level = newLevelInfo.level;
  saveGamification(gam);
  return { newXp: gam.xp, xpGained, leveledUp: newLevelInfo.level > oldLevel, newLevel: newLevelInfo.level };
}

export function checkStreak(): { streakUpdated: boolean; newStreak: number; xpAwarded: number } {
  const gam = getGamification();
  const today = new Date().toISOString().split('T')[0];

  if (gam.lastActiveDate === today) {
    return { streakUpdated: false, newStreak: gam.streak, xpAwarded: 0 };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let xpAwarded = 0;

  if (gam.lastActiveDate === yesterday) {
    gam.streak += 1;
  } else {
    gam.streak = 1;
  }

  gam.lastActiveDate = today;
  if (gam.streak > gam.longestStreak) gam.longestStreak = gam.streak;

  gam.xp += XP_TABLE.streak;
  xpAwarded += XP_TABLE.streak;
  gam.level = getLevel(gam.xp).level;

  if (gam.streak > 0 && gam.streak % 7 === 0) {
    gam.xp += XP_TABLE.streak_bonus;
    xpAwarded += XP_TABLE.streak_bonus;
    gam.level = getLevel(gam.xp).level;
    if (!gam.badges.includes('week-warrior')) gam.badges.push('week-warrior');
  }

  if (gam.streak >= 30 && !gam.badges.includes('month-master')) gam.badges.push('month-master');

  saveGamification(gam);
  return { streakUpdated: true, newStreak: gam.streak, xpAwarded };
}

export function awardBadge(badgeId: string): boolean {
  const gam = getGamification();
  if (gam.badges.includes(badgeId)) return false;
  gam.badges.push(badgeId);
  saveGamification(gam);
  return true;
}

export const ALL_BADGES = [
  { id: 'first-step', name: 'First Step', icon: '🎯', criteria: 'Complete any task' },
  { id: 'module-1', name: 'Foundations', icon: '🏗️', criteria: 'Complete Module 1' },
  { id: 'module-2', name: 'Core Workflows', icon: '⚙️', criteria: 'Complete Module 2' },
  { id: 'module-3', name: 'Automation', icon: '🔗', criteria: 'Complete Module 3' },
  { id: 'module-4', name: 'Agent Architect', icon: '🤖', criteria: 'Complete Module 4' },
  { id: 'quiz-ace', name: 'Quiz Ace', icon: '💯', criteria: 'Score 100% on any quiz' },
  { id: 'week-warrior', name: 'Week Warrior', icon: '🔥', criteria: '7-day streak' },
  { id: 'month-master', name: 'Month Master', icon: '🏆', criteria: '30-day streak' },
  { id: 'builder', name: 'Builder', icon: '🏗️', criteria: 'Complete any guided build' },
  { id: 'challenger', name: 'Challenger', icon: '💪', criteria: 'Complete any module challenge' },
  { id: 'certified', name: 'Certified', icon: '🎓', criteria: 'Pass final exam ≥80%' },
  { id: '10x-engineer', name: '10x Engineer', icon: '🚀', criteria: 'Reach Level 7 (5000 XP)' },
];
