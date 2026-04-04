'use client';

import { useState } from 'react';
import { CapstoneProject as CapstoneProjectType, CapstoneSubmission } from '@/types/assessment';
import CapstoneSubmissionForm from '@/components/CapstoneSubmission';

interface CapstoneProjectProps {
  project: CapstoneProjectType;
  isSubmitted: boolean;
  submission?: CapstoneSubmission;
  onSubmit: (submission: CapstoneSubmission) => void;
}

export default function CapstoneProject({ project, isSubmitted, submission, onSubmit }: CapstoneProjectProps) {
  const [checkedRequirements, setCheckedRequirements] = useState<Record<number, boolean>>({});
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const tierColor =
    project.tier === 'beginner'
      ? 'bg-green-500/20 text-green-300 border-green-500/30'
      : project.tier === 'intermediate'
      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

  const tierLabel = project.tier.charAt(0).toUpperCase() + project.tier.slice(1);

  const toggleRequirement = (idx: number) => {
    setCheckedRequirements(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSubmit = (submissionData: CapstoneSubmission) => {
    onSubmit(submissionData);
    setShowSubmissionForm(false);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-b border-slate-700 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full border ${tierColor}`}>
              {tierLabel}
            </span>
            <span className="text-xs px-3 py-1 rounded-full border border-slate-600 bg-slate-700/50 text-slate-300">
              ~{project.estimatedHours} hours
            </span>
            {isSubmitted && (
              <span className="text-xs px-3 py-1 rounded-full border border-green-500/30 bg-green-500/20 text-green-300">
                Submitted
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
          <p className="text-slate-300">{project.description}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Goal */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#x1F3AF;</span>
            <div>
              <h3 className="font-bold text-blue-300 mb-1">Goal</h3>
              <p className="text-slate-200">{project.goal}</p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Requirements</h3>
          <div className="space-y-3">
            {project.requirements.map((req, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div className="mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={checkedRequirements[idx] || false}
                    onChange={() => toggleRequirement(idx)}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-800 cursor-pointer"
                  />
                </div>
                <span className={`text-slate-300 group-hover:text-slate-200 transition-colors ${checkedRequirements[idx] ? 'line-through text-slate-500' : ''}`}>
                  <span className="text-slate-500 font-mono text-sm mr-2">{idx + 1}.</span>
                  {req}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Deliverables</h3>
          <ul className="space-y-2">
            {project.deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300">
                <span className="text-blue-400 mt-0.5">&#x25B8;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Techniques Used */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Techniques Practiced</h3>
          <div className="flex flex-wrap gap-2">
            {project.techniques.map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Rubric */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-lg font-bold text-white">Rubric</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-t border-slate-700">
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700/30">Criteria</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700/30">Description</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-700/30 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {project.rubric.map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-700/50">
                    <td className="px-6 py-3 text-sm font-medium text-white">{item.criteria}</td>
                    <td className="px-6 py-3 text-sm text-slate-400">{item.description}</td>
                    <td className="px-6 py-3 text-sm text-blue-400 font-semibold text-right">{item.points}</td>
                  </tr>
                ))}
                <tr className="border-t border-slate-600">
                  <td className="px-6 py-3 text-sm font-bold text-white" colSpan={2}>Total</td>
                  <td className="px-6 py-3 text-sm font-bold text-blue-400 text-right">
                    {project.rubric.reduce((sum, item) => sum + item.points, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Learning Outcome */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#x2705;</span>
            <div>
              <h3 className="font-bold text-green-300 mb-1">Learning Outcome</h3>
              <p className="text-slate-200">{project.learningOutcome}</p>
            </div>
          </div>
        </div>

        {/* Submission Section */}
        {isSubmitted && submission ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">&#x1F389;</span>
              <h3 className="text-lg font-bold text-green-300">Project Submitted</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 w-28">Project Name:</span>
                <span className="text-white">{submission.projectName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 w-28">GitHub:</span>
                <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                  {submission.githubUrl}
                </a>
              </div>
              {submission.liveUrl && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 w-28">Live URL:</span>
                  <a href={submission.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                    {submission.liveUrl}
                  </a>
                </div>
              )}
              {submission.demoVideoUrl && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 w-28">Demo Video:</span>
                  <a href={submission.demoVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">
                    {submission.demoVideoUrl}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 w-28">Time Spent:</span>
                <span className="text-white">{submission.timeSpent} hours</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 w-28">Submitted:</span>
                <span className="text-white">{new Date(submission.submittedAt).toLocaleDateString()}</span>
              </div>
              {submission.techniquesUsed.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 w-28">Techniques:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {submission.techniquesUsed.map((tech, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSubmissionForm(true)}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Submit Project
          </button>
        )}
      </div>

      {/* Submission Modal */}
      {showSubmissionForm && (
        <CapstoneSubmissionForm
          project={project}
          onSubmit={handleSubmit}
          onClose={() => setShowSubmissionForm(false)}
        />
      )}
    </div>
  );
}
