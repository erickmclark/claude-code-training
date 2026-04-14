'use client';

import { useState } from 'react';
import Link from 'next/link';
import { caseStudies } from '@/data/case-studies';

type Filter = 'all' | 'enterprise' | 'startup';

export default function CaseStudiesPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered =
    filter === 'all'
      ? caseStudies
      : caseStudies.filter((c) => c.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Back Link */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none' }}>← Home</Link>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Real Companies, Real Results
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          See how teams from startups to Fortune 500 enterprises use Claude Code to ship faster and build things that weren&apos;t possible before.
        </p>
      </div>

      {/* Filter */}
      <div className="flex justify-center gap-3 mb-12">
        {(['all', 'enterprise', 'startup'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'all' ? 'All Companies' : f === 'enterprise' ? 'Enterprise' : 'Startups'}
          </button>
        ))}
      </div>

      {/* Case Study Cards */}
      <div className="space-y-6">
        {filtered.map((cs) => {
          const isExpanded = expanded === cs.id;
          return (
            <div
              key={cs.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : cs.id)}
                className="w-full text-left p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{cs.icon}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {cs.company}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cs.category === 'enterprise'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
                          {cs.category === 'enterprise' ? 'Enterprise' : 'Startup'}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">{cs.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-lg font-bold text-blue-600">{cs.keyMetric}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600 sm:hidden mt-2">{cs.keyMetric}</p>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-8 pb-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                        What They Built
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {cs.whatTheyBuilt}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                        Technical Approach
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {cs.technicalApproach}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                        Value Delivered
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {cs.valueDelivered}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                        Outcome
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {cs.outcome}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <a
                      href={cs.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Source: {cs.sourceName} →
                    </a>
                    {['spotify', 'stripe', 'vulcan'].includes(cs.id) && (
                      <Link
                        href="/build"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                      >
                        Recreate this →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
