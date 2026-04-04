import { QuizQuestion } from './lesson';

export interface ModuleExam {
  id: string;
  title: string;
  description: string;
  lessonIds: number[];
  questionsPerLesson: number;
  duration: number; // minutes
  passingScore: number; // percentage
  questions: QuizQuestion[];
}

export interface CapstoneProject {
  id: string;
  tier: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description: string;
  goal: string;
  requirements: string[];
  deliverables: string[];
  estimatedHours: number;
  learningOutcome: string;
  rubric: RubricItem[];
  techniques: string[];
}

export interface RubricItem {
  criteria: string;
  description: string;
  points: number;
}

export interface CapstoneSubmission {
  projectId: string;
  projectName: string;
  githubUrl: string;
  liveUrl: string;
  demoVideoUrl: string;
  screenshots: string[];
  techniquesUsed: string[];
  timeSpent: number; // hours
  challenges: string;
  lessonsLearned: string;
  submittedAt: string;
}

export interface ExamResult {
  examId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number; // seconds
  answers: number[]; // selected answer indices
}

export interface CertificateData {
  name: string;
  date: string;
  topicsMastered: string[];
  capstonesCompleted: string[];
  totalHours: number;
  certificateId: string;
  examScore: number;
}

export interface AssessmentProgress {
  quizScores: Record<number, number>; // lessonId -> score
  moduleExams: Record<string, ExamResult>;
  capstoneSubmissions: Record<string, CapstoneSubmission>;
  finalExam: ExamResult | null;
  certificate: CertificateData | null;
  timePerLesson: Record<number, number>; // lessonId -> minutes
}
