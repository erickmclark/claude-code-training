'use client';

import { useState } from 'react';
import Link from 'next/link';
import { guidedBuilds } from '@/data/guided-build';
import { GuidedBuild } from '@/types/lesson';
import CodeBlock from '@/components/CodeBlock';
import { toggleBuildStep, getBuildProgress } from '@/utils/progress';

export default function BuildPage() {
  const [selectedBuild, setSelectedBuild] = useState<GuidedBuild | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleSelectBuild = (build: GuidedBuild) => {
    setSelectedBuild(build);
    setCompletedSteps(getBuildProgress(build.id));
  };

  const handleToggleStep = (stepId: number) => {
    if (!selectedBuild) return;
    toggleBuildStep(selectedBuild.id, stepId);
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  // Build selection view
  if (!selectedBuild) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Build a Real Product
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-2">
            Follow step-by-step guides to recreate what real companies built with Claude Code.
          </p>
          <p className="text-sm text-gray-400">
            Requires Claude Code installed. <Link href="/getting-started" className="text-blue-600 hover:underline">Get started here</Link>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guidedBuilds.map((build) => (
            <button
              key={build.id}
              onClick={() => handleSelectBuild(build)}
              className="h-full flex flex-col text-left bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-5xl">{build.icon}</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-1">
                {build.title}
              </h2>
              <p className="text-sm text-blue-600 font-medium mb-3">{build.subtitle}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                {build.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">
                  {build.difficulty}
                </span>
                <span>{build.duration}</span>
                <span>{build.steps.length} steps</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Guided build view
  const progress = Math.round((completedSteps.length / selectedBuild.steps.length) * 100);
  const allComplete = completedSteps.length === selectedBuild.steps.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedBuild(null)}
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All Builds
        </button>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{selectedBuild.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {selectedBuild.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{selectedBuild.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-10 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {completedSteps.length} of {selectedBuild.steps.length} steps complete
          </span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Completion celebration */}
      {allComplete && (
        <div className="mb-10 p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Build Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You just recreated what {selectedBuild.company} built with Claude Code. You&apos;ve mastered real-world AI-assisted development.
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-6">
        {selectedBuild.steps.map((step) => {
          const isComplete = completedSteps.includes(step.id);
          return (
            <div
              key={step.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all ${
                isComplete
                  ? 'border-emerald-200 dark:border-emerald-800'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              {/* Step header */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleStep(step.id)}
                    className={`mt-1 shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isComplete
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                    }`}
                  >
                    {isComplete && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Step {step.id}: {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {step.description}
                    </p>

                    {/* What you build */}
                    <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                      <p className="text-xs font-semibold text-blue-600 mb-1">WHAT YOU BUILD</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{step.whatYouBuild}</p>
                    </div>

                    {/* Techniques */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {step.techniques.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Prompt to give Claude */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Prompt to give Claude Code
                      </p>
                      <CodeBlock code={step.prompt} language="text" />
                    </div>

                    {/* Checkpoint */}
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-xs font-semibold text-emerald-600 mb-1">CHECKPOINT</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{step.checkpoint}</p>
                    </div>

                    {/* Boris Tip */}
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                      <p className="text-xs font-semibold text-amber-600 mb-1">BORIS TIP</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">{step.borisTip}</p>
                    </div>

                    {/* Official Docs Tip */}
                    {step.officialTip && (
                      <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-sand)', borderLeft: '3px solid var(--color-ink)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>📖 OFFICIAL DOCS</p>
                        <p className="text-sm" style={{ color: 'var(--color-body)' }}>{step.officialTip}</p>
                      </div>
                    )}

                    {/* Related lessons */}
                    {step.lessonIds.length > 0 && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <span>Related lessons:</span>
                        {step.lessonIds.map((id) => (
                          <Link
                            key={id}
                            href={`/lessons/${id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Lesson {id}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
