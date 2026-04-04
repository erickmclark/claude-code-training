'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CapstoneProject from '@/components/CapstoneProject';
import { capstoneProjects } from '@/data/capstones';
import { CapstoneSubmission } from '@/types/assessment';
import { getAssessmentProgress, saveCapstoneSubmission } from '@/utils/assessment';

export default function CapstonesPage() {
  const [submissions, setSubmissions] = useState<Record<string, CapstoneSubmission>>({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const progress = getAssessmentProgress();
    setSubmissions(progress.capstoneSubmissions);
  }, []);

  const handleSubmit = (projectId: string) => (submission: CapstoneSubmission) => {
    saveCapstoneSubmission(projectId, submission);
    setSubmissions(prev => ({ ...prev, [projectId]: submission }));
    setSelectedProject(null);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const tierColors = {
    beginner: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-400', label: 'Beginner' },
    intermediate: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Intermediate' },
    advanced: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Advanced' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>&larr;</span>
              <span className="font-semibold">Claude Code Mastery</span>
            </Link>
            <h1 className="text-lg font-bold text-white">Capstone Projects</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Capstone Projects</h2>
          <p className="text-slate-300 mb-6">
            Put your skills to the test. Build real projects that demonstrate your Claude Code mastery.
          </p>

          {/* Tier overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {capstoneProjects.map(project => {
              const colors = tierColors[project.tier];
              const isSubmitted = !!submissions[project.id];
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedProject === project.id
                      ? `${colors.border} ${colors.bg}`
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {colors.label}
                    </span>
                    {isSubmitted && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                        Submitted
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{project.title}</h3>
                  <p className="text-xs text-slate-400">{project.estimatedHours}h estimated &middot; {project.techniques.length} techniques</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected project detail */}
        {selectedProject && (
          <CapstoneProject
            project={capstoneProjects.find(p => p.id === selectedProject)!}
            isSubmitted={!!submissions[selectedProject]}
            submission={submissions[selectedProject]}
            onSubmit={handleSubmit(selectedProject)}
          />
        )}

        {!selectedProject && (
          <div className="bg-slate-800/30 rounded-xl border border-dashed border-slate-600 p-12 text-center">
            <div className="text-4xl mb-4">&#x1F680;</div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">Select a Capstone Project</h3>
            <p className="text-slate-500">Click on a project above to view requirements and submit your work.</p>
          </div>
        )}

        {/* Back to assessments */}
        <div className="mt-12 pt-8 border-t border-slate-700 flex justify-between">
          <Link href="/assessments" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <span>&larr;</span> Assessment Dashboard
          </Link>
          <Link href="/certificate" className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2">
            View Certificate <span>&rarr;</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
