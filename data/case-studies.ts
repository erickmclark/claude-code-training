import { CaseStudy } from '@/types/lesson';

export const caseStudies: CaseStudy[] = [
  {
    id: 'spotify',
    company: 'Spotify',
    tagline: 'Background coding agent shipping 650+ PRs/month',
    category: 'enterprise',
    icon: '🎵',
    whatTheyBuilt:
      'A background coding agent integrated with their Fleet Management system — an internal framework for applying automated code changes across thousands of repositories. Engineers trigger autonomous code changes from Slack. The agent scans codebases, generates migrations, runs tests, and merges pull requests without manual intervention. Engineers on morning commutes can request bug fixes from Slack on their phones, receive a new app version pushed back to Slack, and merge to production before arriving at the office.',
    technicalApproach:
      'Built with the Claude Agent SDK to handle complex semantic transformations that were previously too difficult to script. Moved from deterministic AST manipulation and regex-based scripts to high-level intent-based agents that understand code semantics. Integrated with Slack for triggering at scale across hundreds of engineers. The system runs autonomously in the background, queuing and processing migration tasks.',
    valueDelivered:
      'Democratized large-scale code changes across the organization — engineers no longer need specialized AST expertise to perform fleet-wide transformations. Previously impossible migrations (complex semantic changes) are now routine. Enabled a workflow where developers review and ship code from their phones during commutes.',
    keyMetric: '90% reduction in migration time',
    outcome:
      '650+ pull requests per month generated and merged into production. 50+ features shipped throughout 2025. Best developers haven\'t written a single line of code since December — they review and approve AI-generated changes instead.',
    sourceUrl: 'https://claude.com/customers/spotify',
    sourceName: 'Anthropic Customer Story',
  },
  {
    id: 'stripe',
    company: 'Stripe',
    tagline: '1,300 AI-generated PRs shipped per week',
    category: 'enterprise',
    icon: '💳',
    whatTheyBuilt:
      'Deployed Claude Code to 1,370 engineers with a zero-configuration enterprise rollout. Built "minions" — AI coding agents that ship code triggered by Slack emoji reactions. Any engineer can react to a message with a specific emoji and a minion agent picks up the task, writes the code, runs tests, and opens a PR. Collaborated with Anthropic to produce a signed enterprise binary that satisfied Stripe\'s security compliance requirements.',
    technicalApproach:
      'Zero-configuration rollout that worked immediately on every developer\'s machine. Signed enterprise binary co-developed with Anthropic to address security team concerns. AI assistants are framed internally as "capable new engineers who need context, not replacements." Integrated Claude Code alongside five other coding assistants rather than mandating a single tool. Years of investment in developer experience — comprehensive documentation, blessed paths, robust CI/CD — directly translated to higher AI agent success rates.',
    valueDelivered:
      'Dramatic acceleration of large-scale code migrations that previously consumed weeks of engineer time. Foundation for AI-powered agents that will maintain Stripe\'s 5.5 nines of reliability. Shifted engineering culture to treat AI assistants as collaborators that need onboarding context.',
    keyMetric: '10,000-line migration in 4 days (vs. 10 weeks)',
    outcome:
      'One team migrated 10,000 lines of Scala to Java in four days — a project estimated at ten engineering weeks without AI. Minion agents now ship approximately 1,300 pull requests per week, often triggered by a simple Slack emoji.',
    sourceUrl: 'https://claude.com/customers/stripe',
    sourceName: 'Anthropic Customer Story',
  },
  {
    id: 'doctolib',
    company: 'Doctolib',
    tagline: '40% faster feature shipping across engineering',
    category: 'enterprise',
    icon: '🏥',
    whatTheyBuilt:
      'Rolled out Claude Code across their entire engineering team to modernize their healthcare platform development. Replaced legacy testing infrastructure that had accumulated years of technical debt. Rebuilt test suites and accelerated the feature development pipeline end-to-end.',
    technicalApproach:
      'Full engineering team adoption of Claude Code as the primary AI coding assistant. Used Claude Code to analyze, understand, and replace legacy testing infrastructure. Applied verification loops to ensure new test infrastructure matched the coverage and reliability of the old system.',
    valueDelivered:
      'Freed significant engineering time that was previously spent maintaining and fighting outdated test infrastructure. Engineers can now focus on feature development instead of test maintenance. Faster iteration cycles mean healthcare features reach patients sooner.',
    keyMetric: '40% faster feature shipping',
    outcome:
      'Replaced legacy testing infrastructure in hours instead of the weeks it would have taken manually. Achieved 40% faster feature shipping across the engineering organization.',
    sourceUrl: 'https://venturebeat.com/orchestration/anthropic-says-claude-code-transformed-programming-now-claude-cowork-is',
    sourceName: 'VentureBeat',
  },
  {
    id: 'nyse',
    company: 'New York Stock Exchange',
    tagline: 'Jira ticket to committed code via AI agents',
    category: 'enterprise',
    icon: '📈',
    whatTheyBuilt:
      'Internal AI agents using Claude Code and the Claude Agent SDK that automate the engineering workflow from Jira ticket to committed code. CTO Sridhar Masam described it as "rewiring our engineering process" with AI-powered development agents.',
    technicalApproach:
      'Claude Agent SDK for building internal development agents. Jira integration that reads ticket requirements and translates them into implementation tasks. Agents write code, run validation, and commit changes — taking a ticket from specification to delivered code.',
    valueDelivered:
      'Engineering process transformation at one of the world\'s most critical financial institutions. Reduced the gap between ticket creation and code delivery. Demonstrated that even heavily-regulated, mission-critical financial infrastructure can adopt AI-powered development.',
    keyMetric: 'Ticket-to-code automation',
    outcome:
      'Automated the pipeline from Jira ticket to committed code via AI agents. CTO publicly committed to Claude Code as a core part of NYSE\'s engineering transformation.',
    sourceUrl: 'https://venturebeat.com/orchestration/anthropic-says-claude-code-transformed-programming-now-claude-cowork-is',
    sourceName: 'VentureBeat',
  },
  {
    id: 'humanlayer',
    company: 'HumanLayer',
    tagline: 'Context engineering practices used across YC ecosystem',
    category: 'startup',
    icon: '🧑‍💻',
    whatTheyBuilt:
      'An API and SDK enabling AI agents to request human feedback, input, and approvals across Slack, email, and SMS. Later built CodeLayer — a system that runs multiple Claude agent sessions in parallel using git worktrees and remote cloud workers. Pioneered "12-Factor Agents" best practices for building reliable LLM applications.',
    technicalApproach:
      'Claude Agent SDK with Opus 4 and Sonnet 4 for headless agent execution. Worktree isolation for running parallel Claude sessions safely. Documented context engineering patterns — separating research, planning, and implementation into distinct sessions to prevent context contamination. Published the "12-Factor Agents" framework.',
    valueDelivered:
      'Solved the trust problem for AI agents handling sensitive operations (database drops, financial transactions, etc.). Created tooling that lets companies deploy autonomous AI agents with human-in-the-loop safety. Context engineering practices spread across the YC ecosystem.',
    keyMetric: 'Multiple enterprise pilot contracts closed',
    outcome:
      'Closed several large enterprise pilot contracts by Q4 2025. Founder Dexter Horthy\'s context engineering documentation went viral in the developer community and is now used as a reference across the YC ecosystem.',
    sourceUrl: 'https://claude.com/blog/building-companies-with-claude-code',
    sourceName: 'Claude Blog',
  },
  {
    id: 'vulcan',
    company: 'Vulcan Technologies',
    tagline: '$11M seed, $1B+ annual savings for Virginia',
    category: 'startup',
    icon: '🏛️',
    whatTheyBuilt:
      'An AI-powered regulatory analysis platform that identifies redundant and duplicative regulatory requirements for government agencies. The platform ingests thousands of pages of regulations, analyzes them for overlaps and conflicts, and produces actionable reports for policymakers.',
    technicalApproach:
      'Initial prototype built entirely through Claude using copy-paste scripts before Claude Code existed. Post-launch, multiplied development velocity using Claude Code for full product development. Founders without traditional engineering backgrounds mastered the tool through structured prompts and systematic context management.',
    valueDelivered:
      'Reduced home prices by $24,000 annually in Virginia by identifying regulatory burden. Demonstrated that non-engineers can build production software with Claude Code. Proved that AI-native startups can win government contracts over established consulting firms.',
    keyMetric: '$1B+ annual citizen savings in Virginia',
    outcome:
      'Won state and federal government contracts over established consulting firms within one month of launch. Secured $11 million seed funding from top VCs. Virginia\'s governor signed Executive Order 51 mandating agentic AI regulatory review across all state agencies.',
    sourceUrl: 'https://claude.com/blog/building-companies-with-claude-code',
    sourceName: 'Claude Blog',
  },
  {
    id: 'ramp',
    company: 'Ramp',
    tagline: '80% faster incident investigation',
    category: 'enterprise',
    icon: '💰',
    whatTheyBuilt:
      'Integrated Claude Code into their development workflow specifically for incident investigation and response. Engineers use Claude Code to quickly trace through codebases during outages, identify root causes, and generate fixes under time pressure.',
    technicalApproach:
      'Claude Code integrated into the incident response workflow. Engineers use it to analyze logs, trace code paths, and generate fixes during live incidents. The speed of AI-assisted investigation dramatically reduces mean time to resolution.',
    valueDelivered:
      'Faster incident resolution means less downtime for Ramp\'s financial operations customers. Engineers spend less time in high-stress debugging sessions. Incident postmortems are more thorough because Claude Code helps trace the full impact.',
    keyMetric: '80% reduction in investigation time',
    outcome:
      '80% reduction in incident investigation time. Engineers can resolve production issues faster, directly improving reliability for Ramp\'s financial services customers.',
    sourceUrl: 'https://www.anthropic.com/product/claude-code',
    sourceName: 'Anthropic',
  },
];

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.id === id);
}
