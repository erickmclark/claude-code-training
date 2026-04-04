'use client';

import { useEffect, useState } from 'react';
import { getAssessmentProgress, generateCertificateId, saveCertificate, isCertificateReady } from '@/utils/assessment';
import { getProgress } from '@/utils/progress';
import { CertificateData } from '@/types/assessment';

interface CertificateGeneratorProps {
  onGenerate?: () => void;
}

const LESSON_TITLES: Record<number, string> = {
  1: 'Parallel Execution',
  2: 'Plan Mode Mastery',
  3: 'CLAUDE.md Files',
  4: 'Git Worktrees',
  5: 'Voice Dictation',
  6: 'Verification Loops',
  7: '/batch Parallelization',
  8: 'Custom Agents',
  9: 'Slash Commands',
  10: 'Hooks & Automation',
  11: 'Mobile Control',
  12: 'Advanced Mastery',
};

export default function CertificateGenerator({ onGenerate }: CertificateGeneratorProps) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [name, setName] = useState('');
  const [lessonsCompleted, setLessonsCompleted] = useState(0);

  useEffect(() => {
    setMounted(true);
    const isReady = isCertificateReady();
    setReady(isReady);

    const assessmentProgress = getAssessmentProgress();
    if (assessmentProgress.certificate) {
      setCertificate(assessmentProgress.certificate);
    }

    const progress = getProgress();
    const completed = Object.values(progress.lessons).filter(l => l.completed).length;
    setLessonsCompleted(completed);
  }, []);

  if (!mounted) {
    return null;
  }

  // State 1: Not ready
  if (!ready && !certificate) {
    const assessmentProgress = getAssessmentProgress();
    const mod1 = assessmentProgress.moduleExams['module-1'];
    const mod2 = assessmentProgress.moduleExams['module-2'];
    const finalExam = assessmentProgress.finalExam;

    return (
      <div className="bg-slate-800/30 rounded-xl border border-dashed border-slate-600 p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-slate-400 mb-2">Certificate of Mastery</h3>
          <p className="text-slate-500">
            Complete the program requirements to unlock your certificate.
          </p>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-sm">
            <span className={lessonsCompleted >= 12 ? 'text-green-400' : 'text-slate-500'}>
              {lessonsCompleted >= 12 ? '✓' : '○'}
            </span>
            <span className={lessonsCompleted >= 12 ? 'text-green-300' : 'text-slate-400'}>
              Complete all 12 lessons ({lessonsCompleted}/12)
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={mod1?.passed ? 'text-green-400' : 'text-slate-500'}>
              {mod1?.passed ? '✓' : '○'}
            </span>
            <span className={mod1?.passed ? 'text-green-300' : 'text-slate-400'}>
              Pass Module 1 Exam (Fundamentals)
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={mod2?.passed ? 'text-green-400' : 'text-slate-500'}>
              {mod2?.passed ? '✓' : '○'}
            </span>
            <span className={mod2?.passed ? 'text-green-300' : 'text-slate-400'}>
              Pass Module 2 Exam (Advanced)
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className={finalExam?.passed ? 'text-green-400' : 'text-slate-500'}>
              {finalExam?.passed ? '✓' : '○'}
            </span>
            <span className={finalExam?.passed ? 'text-green-300' : 'text-slate-400'}>
              Pass Final Exam
            </span>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Ready but not generated
  if (!certificate) {
    const handleGenerate = () => {
      if (!name.trim()) return;

      const assessmentProgress = getAssessmentProgress();
      const capstonesCompleted = Object.values(assessmentProgress.capstoneSubmissions).map(
        s => s.projectName
      );

      const certData: CertificateData = {
        name: name.trim(),
        date: new Date().toISOString(),
        topicsMastered: Object.values(LESSON_TITLES),
        capstonesCompleted,
        totalHours: Object.values(assessmentProgress.timePerLesson).reduce((sum, t) => sum + t, 0),
        certificateId: generateCertificateId(),
        examScore: assessmentProgress.finalExam?.score ?? 0,
      };

      saveCertificate(certData);
      setCertificate(certData);
      onGenerate?.();
    };

    return (
      <div className="bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 rounded-xl border-2 border-yellow-500/30 p-8 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-yellow-300 mb-2">
          You&apos;ve Earned Your Certificate!
        </h3>
        <p className="text-slate-300 mb-8">
          Enter your name to generate your official certificate of completion.
        </p>

        <div className="max-w-sm mx-auto space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerate();
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!name.trim()}
            className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-600 disabled:text-slate-400 text-black font-bold rounded-lg transition-colors"
          >
            Generate Certificate
          </button>
        </div>
      </div>
    );
  }

  // State 3: Generated - full certificate display
  const issueDate = new Date(certificate.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shareText = `I just earned my Claude Code Mastery Certificate! Completed all 12 lessons and passed the final exam with a ${certificate.examScore}% score. #ClaudeCode #AI #DeveloperTools`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://claudecodemastery.com')}&summary=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-6">
      {/* Certificate */}
      <div
        id="certificate"
        className="bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 rounded-xl border-2 border-yellow-500/50 p-2"
      >
        <div className="border border-yellow-500/30 rounded-lg p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 tracking-wide">
              Certificate of Completion
            </h2>
            <div className="w-32 h-0.5 bg-yellow-500/50 mx-auto mt-4" />
          </div>

          {/* Program Title */}
          <div className="text-center mb-8">
            <p className="text-lg text-slate-400 mb-1">awarded for successful completion of</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Claude Code Mastery Program
            </h3>
          </div>

          {/* Recipient */}
          <div className="text-center mb-8">
            <p className="text-slate-400 mb-2">This certifies that</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {certificate.name}
            </p>
            <p className="text-slate-300">
              has successfully completed the Claude Code Mastery training program
            </p>
          </div>

          {/* Divider */}
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto mb-8" />

          {/* Topics Mastered */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-yellow-300/80 uppercase tracking-wider text-center mb-4">
              Topics Mastered
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {certificate.topicsMastered.map((topic) => (
                <div
                  key={topic}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-center"
                >
                  <span className="text-sm text-slate-300">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{certificate.examScore}%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Exam Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">12/12</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Lessons</div>
            </div>
            {certificate.capstonesCompleted.length > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">
                  {certificate.capstonesCompleted.length}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  Capstone{certificate.capstonesCompleted.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>

          {/* Capstone Projects */}
          {certificate.capstonesCompleted.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-yellow-300/80 uppercase tracking-wider text-center mb-3">
                Capstone Projects Completed
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.capstonesCompleted.map((project) => (
                  <span
                    key={project}
                    className="bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 text-sm text-green-300"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-700/50">
            <div className="text-sm text-slate-500">
              Certificate ID: {certificate.certificateId}
            </div>
            <div className="text-sm text-slate-500">
              Issued: {issueDate}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => window.open(linkedInUrl, '_blank', 'noopener,noreferrer')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share on LinkedIn
        </button>
        <button
          onClick={() => window.open(twitterUrl, '_blank', 'noopener,noreferrer')}
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share on X
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download as Image
        </button>
      </div>
    </div>
  );
}
