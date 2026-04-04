import Anthropic from '@anthropic-ai/sdk';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface EvaluateCapstoneParams {
  level: string;
  projectDescription: string;
  submissionText: string;
  checklist: string[];
}

export interface ChecklistResult {
  item: string;
  passed: boolean;
  feedback: string;
}

export interface EvaluationResult {
  score: number;
  checklistResults: ChecklistResult[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

const SYSTEM_PROMPT = `You are an expert evaluator for a Claude Code training platform. Your role is to assess student capstone project submissions and provide constructive, encouraging feedback.

You evaluate projects based on these Claude Code techniques and best practices:
- Parallel Execution: Running multiple Claude Code sessions simultaneously
- Plan Mode: Using Shift+Tab to enter planning mode before implementation
- CLAUDE.md Files: Creating persistent instruction files for Claude sessions
- Git Worktrees: Isolating parallel development branches
- Verification Loops: Automated testing and feedback loops
- Voice Dictation: Using voice input for faster prompting
- /batch Parallelization: Fanning out work to parallel agents
- Custom Agents: Creating specialized agent configurations
- Slash Commands: Building reusable workflow commands
- Hooks & Automation: Setting up PreToolUse/PostToolUse hooks
- Mobile Control: Using remote control features

When evaluating, be:
- Specific and actionable in your feedback
- Encouraging but honest about areas for improvement
- Focused on whether techniques were genuinely applied vs. just mentioned
- Generous with scores when clear effort was made

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON structure.`;

function buildUserPrompt(params: EvaluateCapstoneParams): string {
  const { level, projectDescription, submissionText, checklist } = params;
  const checklistStr = checklist.map((item, i) => `${i + 1}. ${item}`).join('\n');

  return `Evaluate this capstone project submission for the "${level}" level.

## Project Description
${projectDescription}

## Student Submission
${submissionText}

## Checklist Items to Evaluate
${checklistStr}

Please evaluate each checklist item and provide overall feedback.

Respond with this exact JSON structure:
{
  "score": <number 0-100>,
  "checklistResults": [
    {
      "item": "<checklist item text>",
      "passed": <true or false>,
      "feedback": "<1-2 sentence specific feedback for this item>"
    }
  ],
  "overallFeedback": "<2-4 sentences of overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}

Scoring guide:
- 90-100: Exceptional — all criteria met with clear mastery
- 75-89: Strong — most criteria met, good understanding shown
- 60-74: Developing — some criteria met, meaningful effort visible
- 40-59: Partial — basic attempts made but missing key elements
- Below 40: Incomplete — significant gaps in meeting requirements`;
}

export async function evaluateCapstone(
  params: EvaluateCapstoneParams
): Promise<EvaluationResult> {
  if (!client) {
    // Return a mock result when no API key is configured
    return {
      score: 0,
      checklistResults: params.checklist.map((item) => ({
        item,
        passed: false,
        feedback:
          'Add an ANTHROPIC_API_KEY to .env.local to enable AI-powered evaluation.',
      })),
      overallFeedback:
        'Configure ANTHROPIC_API_KEY in .env.local to receive personalized feedback on your capstone project.',
      strengths: ['Project submitted for review'],
      improvements: [
        'Add ANTHROPIC_API_KEY to enable evaluation',
        'Resubmit for AI-powered scoring',
      ],
    };
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(params) }],
  });

  const text =
    message.content[0]?.type === 'text' ? message.content[0].text : '';

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  const parsed = JSON.parse(cleaned) as EvaluationResult;

  // Validate the structure minimally
  if (
    typeof parsed.score !== 'number' ||
    !Array.isArray(parsed.checklistResults) ||
    typeof parsed.overallFeedback !== 'string' ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.improvements)
  ) {
    throw new Error('Invalid evaluation response structure from AI');
  }

  return parsed;
}
