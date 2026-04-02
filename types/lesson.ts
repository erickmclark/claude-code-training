export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Step {
  title: string;
  description: string;
  code?: string;
  language?: string;
  tip?: string;
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  objectives: string[];
  keyTakeaway: string;
  impactMetric: string;
  steps: Step[];
  terminalCommands: string[];
  realExample: {
    title: string;
    description: string;
    before: string;
    after: string;
  };
  exercise: {
    title: string;
    instructions: string[];
  };
  quiz: QuizQuestion[];
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  quizScore: number | null;
  completedAt: string | null;
  stepsCompleted: number[];
}

export interface UserProgress {
  lessons: Record<number, LessonProgress>;
  startedAt: string;
  lastActiveAt: string;
}
