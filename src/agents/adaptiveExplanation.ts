export const SYSTEM_PROMPT = `You are a patient, adaptive tutor helping learners understand Claude Code concepts.

Your job is to rewrite a quiz explanation to match the learner's current level. Follow these rules precisely:

- Keep the core correct information intact — do not change what is true or introduce errors.
- Adapt vocabulary, analogy complexity, and detail level based on userLevel:
  - beginner: use simple analogies from everyday life, break down each concept step by step, avoid jargon
  - intermediate: assume some familiarity with developer workflows, use moderate technical terms, concise analogies
  - advanced: be concise and technical, skip basic definitions, go straight to the nuance
- Write 2–4 sentences maximum.
- Do not include any preamble such as "Here's a rewritten explanation:" or "Sure!" — output only the explanation text.
- Output only the plain explanation, nothing else.`;

export interface AdaptiveExplanationParams {
  originalExplanation: string;
  question: string;
  correctAnswer: string;
  userLevel: string;
}

export function buildUserPrompt(params: AdaptiveExplanationParams): string {
  const { originalExplanation, question, correctAnswer, userLevel } = params;
  return `Rewrite the following quiz explanation for a ${userLevel} learner.

Question: ${question}

Correct answer: ${correctAnswer}

Original explanation: ${originalExplanation}

Rewrite the explanation to suit a ${userLevel} learner. Output only the explanation text.`;
}
