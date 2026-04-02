import Link from 'next/link';

const lessons = [
  {
    id: 1,
    title: 'Parallel Execution',
    description: 'Run 5+ Claude Code sessions simultaneously',
    icon: '⚡',
    difficulty: 'Beginner',
    duration: '15 min',
  },
  {
    id: 2,
    title: 'Plan Mode Mastery',
    description: 'Build perfect plans before coding',
    icon: '📋',
    difficulty: 'Beginner',
    duration: '10 min',
  },
  {
    id: 3,
    title: 'CLAUDE.md Files',
    description: 'Teach Claude not to repeat mistakes',
    icon: '📝',
    difficulty: 'Beginner',
    duration: '12 min',
  },
  {
    id: 4,
    title: 'Git Worktrees',
    description: 'Isolated parallel work without conflicts',
    icon: '🌳',
    difficulty: 'Intermediate',
    duration: '20 min',
  },
  {
    id: 5,
    title: 'Voice Dictation',
    description: 'Speak 3x faster than typing',
    icon: '🎤',
    difficulty: 'Beginner',
    duration: '5 min',
  },
  {
    id: 6,
    title: 'Verification Loops',
    description: 'Give Claude a way to test its work',
    icon: '✅',
    difficulty: 'Intermediate',
    duration: '15 min',
  },
  {
    id: 7,
    title: '/batch Parallelization',
    description: 'Spawn 10+ subagents for big tasks',
    icon: '🚀',
    difficulty: 'Advanced',
    duration: '25 min',
  },
  {
    id: 8,
    title: 'Custom Agents',
    description: 'Create specialized agents for specific work',
    icon: '🤖',
    difficulty: 'Advanced',
    duration: '20 min',
  },
  {
    id: 9,
    title: 'Slash Commands',
    description: 'Keyboard shortcuts for common tasks',
    icon: '⌨️',
    difficulty: 'Intermediate',
    duration: '12 min',
  },
  {
    id: 10,
    title: 'Hooks & Automation',
    description: 'Run code at lifecycle events',
    icon: '🔗',
    difficulty: 'Advanced',
    duration: '20 min',
  },
  {
    id: 11,
    title: 'Mobile Control',
    description: 'Code from anywhere on your phone',
    icon: '📱',
    difficulty: 'Intermediate',
    duration: '10 min',
  },
  {
    id: 12,
    title: 'Advanced Mastery',
    description: 'Combine all techniques for 10x productivity',
    icon: '🏆',
    difficulty: 'Expert',
    duration: '30 min',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Claude Code Mastery</h1>
            <div className="text-sm text-slate-400">Learn from Boris Cherny's techniques</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Interactive Training Platform</h2>
          <p className="text-xl text-slate-300 mb-8">
            Master the techniques that Boris Cherny uses to build 10x faster with Claude Code.
            Learn hands-on with real examples from NightPivot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-blue-400">12</div>
              <div className="text-slate-300">Interactive Lessons</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-green-400">2.5h</div>
              <div className="text-slate-300">Total Time to Master</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-purple-400">10x</div>
              <div className="text-slate-300">Speed Improvement</div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { path: 'Beginner', lessons: '1, 2, 3', color: 'blue' },
              { path: 'Intermediate', lessons: '4, 5, 6, 9, 11', color: 'green' },
              { path: 'Advanced', lessons: '7, 8, 10', color: 'purple' },
              { path: 'Mastery', lessons: 'All + Projects', color: 'amber' },
            ].map((item) => (
              <div
                key={item.path}
                className={`rounded-lg p-4 border-2 border-${item.color}-500/30 bg-${item.color}-500/10`}
              >
                <h4 className={`font-bold text-${item.color}-400 mb-2`}>{item.path}</h4>
                <p className="text-sm text-slate-300">{item.lessons}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Lessons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                <div className="group cursor-pointer bg-slate-700/50 rounded-lg p-6 border border-slate-600 hover:border-blue-500 hover:bg-slate-700/80 transition-all">
                  <div className="text-4xl mb-4">{lesson.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">
                    {lesson.title}
                  </h4>
                  <p className="text-slate-300 mb-4">{lesson.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      lesson.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                      lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {lesson.difficulty}
                    </span>
                    <span className="text-slate-400">{lesson.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Build 10x Faster?</h3>
          <p className="text-slate-300 mb-6">Start with Lesson 1 and master Claude Code in 2.5 hours</p>
          <Link href="/lessons/1">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Start Learning →
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
