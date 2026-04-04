import { AssessmentProgress, ExamResult, CapstoneSubmission, CertificateData } from '@/types/assessment';

const ASSESSMENT_KEY = 'claude-code-assessment-progress';

export function getAssessmentProgress(): AssessmentProgress {
  if (typeof window === 'undefined') {
    return {
      quizScores: {},
      moduleExams: {},
      capstoneSubmissions: {},
      finalExam: null,
      certificate: null,
      timePerLesson: {},
    };
  }
  const stored = localStorage.getItem(ASSESSMENT_KEY);
  if (stored) return JSON.parse(stored);
  const initial: AssessmentProgress = {
    quizScores: {},
    moduleExams: {},
    capstoneSubmissions: {},
    finalExam: null,
    certificate: null,
    timePerLesson: {},
  };
  localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(initial));
  return initial;
}

export function saveAssessmentProgress(progress: AssessmentProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(progress));
}

export function saveExamResult(examId: string, result: ExamResult): void {
  const progress = getAssessmentProgress();
  if (examId === 'final') {
    progress.finalExam = result;
  } else {
    progress.moduleExams[examId] = result;
  }
  saveAssessmentProgress(progress);
}

export function saveCapstoneSubmission(projectId: string, submission: CapstoneSubmission): void {
  const progress = getAssessmentProgress();
  progress.capstoneSubmissions[projectId] = submission;
  saveAssessmentProgress(progress);
}

export function saveCertificate(certificate: CertificateData): void {
  const progress = getAssessmentProgress();
  progress.certificate = certificate;
  saveAssessmentProgress(progress);
}

export function generateCertificateId(): string {
  return 'CCM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function isModule1Ready(): boolean {
  // Need lessons 1-3 completed
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('claude-code-training-progress');
  if (!stored) return false;
  const progress = JSON.parse(stored);
  return [1, 2, 3].every(id => progress.lessons[id]?.completed);
}

export function isModule2Ready(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('claude-code-training-progress');
  if (!stored) return false;
  const progress = JSON.parse(stored);
  return [4, 5, 6, 7, 8, 9, 10, 11, 12].every(id => progress.lessons[id]?.completed);
}

export function isFinalExamReady(): boolean {
  const progress = getAssessmentProgress();
  const mod1 = progress.moduleExams['module-1'];
  const mod2 = progress.moduleExams['module-2'];
  return !!(mod1?.passed && mod2?.passed);
}

export function isCertificateReady(): boolean {
  const progress = getAssessmentProgress();
  return !!(progress.finalExam?.passed);
}

export function getOverallProgress(): {
  lessonsCompleted: number;
  quizzesPassed: number;
  module1Passed: boolean;
  module2Passed: boolean;
  capstonesSubmitted: number;
  finalExamPassed: boolean;
  certificateEarned: boolean;
} {
  const progress = getAssessmentProgress();
  if (typeof window === 'undefined') {
    return { lessonsCompleted: 0, quizzesPassed: 0, module1Passed: false, module2Passed: false, capstonesSubmitted: 0, finalExamPassed: false, certificateEarned: false };
  }
  const stored = localStorage.getItem('claude-code-training-progress');
  const lessonProgress = stored ? JSON.parse(stored) : { lessons: {} };
  const completedLessons = Object.values(lessonProgress.lessons || {}).filter((l: any) => l.completed).length;
  const passedQuizzes = Object.values(lessonProgress.lessons || {}).filter((l: any) => l.completed && (l.quizScore || 0) >= 60).length;

  return {
    lessonsCompleted: completedLessons,
    quizzesPassed: passedQuizzes,
    module1Passed: !!progress.moduleExams['module-1']?.passed,
    module2Passed: !!progress.moduleExams['module-2']?.passed,
    capstonesSubmitted: Object.keys(progress.capstoneSubmissions).length,
    finalExamPassed: !!progress.finalExam?.passed,
    certificateEarned: !!progress.certificate,
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
