'use client';

import { useState } from 'react';
import { CapstoneProject, CapstoneSubmission } from '@/types/assessment';

const ALL_TECHNIQUES = [
  'Parallel Execution',
  'Plan Mode',
  'CLAUDE.md Files',
  'Git Worktrees',
  'Voice Dictation',
  'Verification Loops',
  '/batch Parallelization',
  'Custom Agents',
  'Slash Commands',
  'Hooks & Automation',
  'Mobile Control',
  'Advanced Mastery',
];

interface CapstoneSubmissionFormProps {
  project: CapstoneProject;
  onSubmit: (submission: CapstoneSubmission) => void;
  onClose: () => void;
}

export default function CapstoneSubmissionForm({ project, onSubmit, onClose }: CapstoneSubmissionFormProps) {
  const [projectName, setProjectName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [techniquesUsed, setTechniquesUsed] = useState<string[]>([...project.techniques]);
  const [timeSpent, setTimeSpent] = useState<number>(project.estimatedHours);
  const [challenges, setChallenges] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const toggleTechnique = (tech: string) => {
    setTechniquesUsed(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!projectName.trim()) newErrors.projectName = true;
    if (!githubUrl.trim()) newErrors.githubUrl = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submission: CapstoneSubmission = {
      projectId: project.id,
      projectName: projectName.trim(),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      demoVideoUrl: demoVideoUrl.trim(),
      screenshots: [],
      techniquesUsed,
      timeSpent,
      challenges: challenges.trim(),
      lessonsLearned: lessonsLearned.trim(),
      submittedAt: new Date().toISOString(),
    };

    onSubmit(submission);
  };

  const inputClass = (field?: string) =>
    `w-full px-4 py-2.5 rounded-lg bg-slate-700 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      field && errors[field] ? 'border-red-500' : 'border-slate-600'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Submit Capstone Project</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">{project.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => { setProjectName(e.target.value); setErrors(prev => ({ ...prev, projectName: false })); }}
              placeholder="My Claude Code Project"
              className={inputClass('projectName')}
            />
            {errors.projectName && (
              <p className="text-red-400 text-xs mt-1">Project name is required.</p>
            )}
          </div>

          {/* GitHub Repo URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              GitHub Repo URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={e => { setGithubUrl(e.target.value); setErrors(prev => ({ ...prev, githubUrl: false })); }}
              placeholder="https://github.com/username/repo"
              className={inputClass('githubUrl')}
            />
            {errors.githubUrl && (
              <p className="text-red-400 text-xs mt-1">GitHub URL is required.</p>
            )}
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Live URL <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="text"
              value={liveUrl}
              onChange={e => setLiveUrl(e.target.value)}
              placeholder="https://my-project.vercel.app"
              className={inputClass()}
            />
          </div>

          {/* Demo Video URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Demo Video URL <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="text"
              value={demoVideoUrl}
              onChange={e => setDemoVideoUrl(e.target.value)}
              placeholder="https://www.loom.com/share/..."
              className={inputClass()}
            />
          </div>

          {/* Techniques Used */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Techniques Used
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_TECHNIQUES.map(tech => (
                <label
                  key={tech}
                  className="flex items-center gap-2.5 cursor-pointer group p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={techniquesUsed.includes(tech)}
                    onChange={() => toggleTechnique(tech)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-800 cursor-pointer"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                    {tech}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Spent */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Time Spent (hours)
            </label>
            <input
              type="number"
              value={timeSpent}
              onChange={e => setTimeSpent(Number(e.target.value))}
              min={0}
              step={0.5}
              className={`${inputClass()} max-w-32`}
            />
          </div>

          {/* Challenges Faced */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Challenges Faced
            </label>
            <textarea
              value={challenges}
              onChange={e => setChallenges(e.target.value)}
              placeholder="What obstacles did you encounter? How did you overcome them?"
              rows={3}
              className={inputClass()}
            />
          </div>

          {/* Lessons Learned */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Lessons Learned
            </label>
            <textarea
              value={lessonsLearned}
              onChange={e => setLessonsLearned(e.target.value)}
              placeholder="What key insights did you gain from this project?"
              rows={3}
              className={inputClass()}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Submit Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
