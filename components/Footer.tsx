import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/getting-started" className="hover:text-gray-900 dark:hover:text-white transition-colors">Getting Started</Link></li>
              <li><Link href="/lessons/1" className="hover:text-gray-900 dark:hover:text-white transition-colors">Lesson 1</Link></li>
              <li><Link href="/skills" className="hover:text-gray-900 dark:hover:text-white transition-colors">Create Skills</Link></li>
              <li><Link href="/workflow" className="hover:text-gray-900 dark:hover:text-white transition-colors">Workflow</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Practice</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/build" className="hover:text-gray-900 dark:hover:text-white transition-colors">Guided Builds</Link></li>
              <li><Link href="/test" className="hover:text-gray-900 dark:hover:text-white transition-colors">Take the Test</Link></li>
              <li><Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/case-studies" className="hover:text-gray-900 dark:hover:text-white transition-colors">Case Studies</Link></li>
              <li><a href="https://code.claude.com/docs" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Claude Code Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">About</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built from Boris Cherny&apos;s 72+ tips and techniques used by the Claude Code team at Anthropic.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
          Claude Code Mastery — Interactive Training Platform
        </div>
      </div>
    </footer>
  );
}
