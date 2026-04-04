import { NextRequest } from 'next/server';
import { evaluateCapstone } from '@/src/agents/capstoneEvaluator';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { level, projectDescription, submissionText, checklist } = body as {
    level?: unknown;
    projectDescription?: unknown;
    submissionText?: unknown;
    checklist?: unknown;
  };

  if (!level || typeof level !== 'string') {
    return Response.json(
      { error: 'Missing required field: level' },
      { status: 400 }
    );
  }
  if (!projectDescription || typeof projectDescription !== 'string') {
    return Response.json(
      { error: 'Missing required field: projectDescription' },
      { status: 400 }
    );
  }
  if (!submissionText || typeof submissionText !== 'string') {
    return Response.json(
      { error: 'Missing required field: submissionText' },
      { status: 400 }
    );
  }
  if (!Array.isArray(checklist) || checklist.length === 0) {
    return Response.json(
      { error: 'Missing required field: checklist (must be a non-empty array)' },
      { status: 400 }
    );
  }

  const checklistStrings = checklist.filter(
    (item): item is string => typeof item === 'string'
  );

  try {
    const result = await evaluateCapstone({
      level,
      projectDescription,
      submissionText,
      checklist: checklistStrings,
    });
    return Response.json(result);
  } catch (err) {
    console.error('Capstone evaluation error:', err);
    return Response.json(
      { error: 'Evaluation failed. Please try again.' },
      { status: 500 }
    );
  }
}
