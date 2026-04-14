'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RubricItem {
  criteria: string;
  description: string;
  points: number;
}

interface CapstoneProject {
  title: string;
  description: string;
  goal: string;
  requirements: string[];
  deliverables: string[];
  estimatedHours: number;
  techniques: string[];
  rubric: RubricItem[];
}

const DOMAINS = [
  { label: 'E-commerce Platform', icon: '🛒' },
  { label: 'Developer Tools CLI', icon: '🔧' },
  { label: 'Analytics Dashboard', icon: '📊' },
  { label: 'Social Media App', icon: '💬' },
  { label: 'Project Management Tool', icon: '📋' },
  { label: 'AI-Powered Chatbot', icon: '🤖' },
  { label: 'Health & Fitness Tracker', icon: '💪' },
];

function getSessionId(): string {
  const key = 'capstone-session-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function CapstonePage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [project, setProject] = useState<CapstoneProject | null>(null);
  const [generating, setGenerating] = useState(false);
  const [checkedReqs, setCheckedReqs] = useState<Set<number>>(new Set());
  const [submission, setSubmission] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string; strengths: string[]; improvements: string[] } | null>(null);

  const handleGenerate = async (domain: string) => {
    setSelectedDomain(domain);
    setGenerating(true);
    setProject(null);
    setCheckedReqs(new Set());
    setEvaluation(null);

    try {
      const res = await fetch('/api/capstone/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          skillLevel: 'advanced',
          sessionId: getSessionId(),
        }),
      });
      const data = await res.json();
      if (data.project) setProject(data.project);
    } catch { /* silently fail */ }
    finally { setGenerating(false); }
  };

  const handleSubmit = async () => {
    if (!project || !submission.trim()) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/agents/evaluate-capstone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'advanced',
          projectDescription: project.description,
          submissionText: submission,
          checklist: project.requirements.filter((_, i) => checkedReqs.has(i)),
        }),
      });
      const data = await res.json();
      if (data.score !== undefined) setEvaluation(data);
    } catch { /* silently fail */ }
    finally { setEvaluating(false); }
  };

  const toggleReq = (i: number) => {
    setCheckedReqs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ borderBottom: 'var(--border)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none' }}>← Back to Lessons</Link>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)' }}>Module 6 — Capstone Project</span>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>
            Capstone Project
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            AI generates a unique project tailored to your interests. Build it using Claude Code and submit for evaluation.
          </p>
        </div>

        {/* Domain picker — shown when no project yet */}
        {!project && !generating && (
          <div className="animate-fade-in-up">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 16px 0' }}>
              Choose Your Domain
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
              {DOMAINS.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => handleGenerate(label)}
                  className="card-hover"
                  style={{
                    padding: '16px',
                    backgroundColor: '#fff',
                    border: 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{label}</div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="Or type your own domain..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  border: 'var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fff',
                  color: 'var(--color-ink)',
                }}
              />
              <button
                onClick={() => customDomain.trim() && handleGenerate(customDomain.trim())}
                disabled={!customDomain.trim()}
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  backgroundColor: customDomain.trim() ? 'var(--color-coral)' : 'var(--color-sand)',
                  color: customDomain.trim() ? '#fff' : 'var(--color-hint)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: customDomain.trim() ? 'pointer' : 'default',
                }}
              >
                Generate →
              </button>
            </div>
          </div>
        )}

        {/* Generating spinner */}
        {generating && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--color-sand)', borderTopColor: 'var(--color-coral)', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-secondary)' }}>
              AI is generating your unique capstone project...
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)' }}>
              Powered by Claude Opus — tailored to &quot;{selectedDomain}&quot;
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Generated project */}
        {project && !generating && (
          <div className="animate-fade-in-up">
            {/* Project overview */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ backgroundColor: 'var(--color-coral)', color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)', padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>
                  Your Project
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
                  ~{project.estimatedHours} hours
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>
                {project.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                {project.description}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', fontStyle: 'italic', margin: 0 }}>
                Goal: {project.goal}
              </p>
            </div>

            {/* Techniques */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>
                Techniques to Demonstrate
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.techniques.map((t) => (
                  <span key={t} style={{ fontSize: 12, fontFamily: 'var(--font-body)', padding: '4px 10px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral-light)', color: 'var(--color-coral)', fontWeight: 500 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements checklist */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>
                Requirements ({checkedReqs.size}/{project.requirements.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.requirements.map((req, i) => (
                  <button
                    key={i}
                    onClick={() => toggleReq(i)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                      backgroundColor: checkedReqs.has(i) ? 'var(--color-coral-light)' : 'transparent',
                      border: checkedReqs.has(i) ? '1px solid var(--color-coral)' : 'var(--border)',
                      borderRadius: 'var(--radius-sm)', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: 4, border: checkedReqs.has(i) ? '2px solid var(--color-coral)' : '2px solid var(--color-muted)', backgroundColor: checkedReqs.has(i) ? 'var(--color-coral)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                      {checkedReqs.has(i) ? '✓' : ''}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--color-body)', lineHeight: 1.5 }}>{req}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>
                Deliverables
              </h3>
              {project.deliverables.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-coral)', marginTop: 7, flexShrink: 0 }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-body)', margin: 0, lineHeight: 1.5 }}>{d}</p>
                </div>
              ))}
            </div>

            {/* Rubric */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>
                Rubric (100 points)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.rubric.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < project.rubric.length - 1 ? 'var(--border)' : 'none' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 2px 0' }}>{r.criteria}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)', margin: 0 }}>{r.description}</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--color-coral)', flexShrink: 0, marginLeft: 12 }}>{r.points}pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>
                Submit Your Project
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: '0 0 12px 0' }}>
                Describe what you built, link to your repo, and explain which techniques you used.
              </p>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                rows={6}
                placeholder="Paste your GitHub repo URL, describe what you built, and list the Claude Code techniques you demonstrated..."
                style={{
                  width: '100%', padding: '12px', fontSize: 13, fontFamily: 'var(--font-body)',
                  border: 'var(--border)', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-cream)', color: 'var(--color-ink)',
                  resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!submission.trim() || evaluating}
                style={{
                  marginTop: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  backgroundColor: submission.trim() && !evaluating ? 'var(--color-coral)' : 'var(--color-sand)',
                  color: submission.trim() && !evaluating ? '#fff' : 'var(--color-hint)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  cursor: submission.trim() && !evaluating ? 'pointer' : 'default',
                  width: '100%',
                }}
              >
                {evaluating ? 'Evaluating...' : 'Submit for AI Evaluation'}
              </button>
            </div>

            {/* Evaluation results */}
            {evaluation && (
              <div className="animate-scale-in" style={{ backgroundColor: '#fff', border: `2px solid ${evaluation.score >= 80 ? 'var(--color-coral)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-display)', color: evaluation.score >= 80 ? 'var(--color-coral)' : 'var(--color-secondary)' }}>
                    {evaluation.score}/100
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)', padding: '4px 12px',
                    borderRadius: 'var(--radius-full)', textTransform: 'uppercase',
                    backgroundColor: evaluation.score >= 80 ? 'var(--color-coral-light)' : 'var(--color-sand)',
                    color: evaluation.score >= 80 ? 'var(--color-coral)' : 'var(--color-hint)',
                  }}>
                    {evaluation.score >= 80 ? 'Passed' : 'Needs Improvement'}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6, marginBottom: 16 }}>
                  {evaluation.feedback}
                </p>
                {evaluation.strengths.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6 }}>Strengths</p>
                    {evaluation.strengths.map((s, i) => (
                      <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-body)', margin: '0 0 4px 0', paddingLeft: 12 }}>✓ {s}</p>
                    ))}
                  </div>
                )}
                {evaluation.improvements.length > 0 && (
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6 }}>Areas to Improve</p>
                    {evaluation.improvements.map((s, i) => (
                      <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-body)', margin: '0 0 4px 0', paddingLeft: 12 }}>→ {s}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generate new project */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={() => { setProject(null); setSelectedDomain(null); setEvaluation(null); setSubmission(''); setCheckedReqs(new Set()); localStorage.removeItem('capstone-session-id'); }}
                style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Generate a different project →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
