export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Step {
  id?: number;
  title: string;
  description: string;
  code?: string;
  language?: string;
  tip?: string;
  whatYouBuild?: string;
  techniques?: string[];
  prompt?: string;
  checkpoint?: string;
  borisTip?: string;
  officialTip?: string;
  lessonIds?: number[];
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  objectives: string[];
  keyTakeaway?: string;
  impactMetric?: string;
  steps: Step[];
  terminalCommands: string[];
  realExample?: {
    title: string;
    description: string;
    before: string;
    after: string;
  };
  exercise?: {
    title: string;
    instructions: string[];
  };
  quiz: QuizQuestion[];
}

export interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  type: 'command' | 'code' | 'planning' | 'verification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  challenge: string;
  inputPlaceholder: string;
  hints: string[];
  solution: string;
  successMessage: string;
  keywords: string[];
  codeLanguage?: string;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  quizScore: number | null;
  completedAt: string | null;
  stepsCompleted: number[];
  practicesCompleted?: string[];
}

export interface TestResult {
  score: number;
  passed: boolean;
  completedAt: string;
  answers?: number[];
}

export interface UserProgress {
  lessons: Record<number, LessonProgress>;
  startedAt: string;
  lastActiveAt: string;
  testResult?: TestResult | null;
  buildProgress?: Record<string, number[]>;
}

export interface LessonSummary {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  lessons: number[];
  estimatedTime?: string;
  outcomes?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tip?: string;
}

export interface BuildStep {
  id: number;
  title: string;
  description: string;
  whatYouBuild: string;
  techniques: string[];
  prompt: string;
  expectedOutput?: string;
  checkpoint: string;
  borisTip: string;
  officialTip?: string;
  lessonIds: number[];
}

export interface GuidedBuild {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  company: string;
  difficulty: string;
  duration: string;
  steps: BuildStep[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: {
    title: string;
    description: string;
    lessons?: number[];
  }[];
}

export interface CaseStudy {
  id: string;
  company: string;
  tagline: string;
  category: 'enterprise' | 'startup';
  icon: string;
  whatTheyBuilt: string;
  technicalApproach: string;
  valueDelivered: string;
  keyMetric: string;
  outcome: string;
  sourceUrl: string;
  sourceName: string;
}
