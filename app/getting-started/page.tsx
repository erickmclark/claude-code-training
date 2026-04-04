import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';

export default function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Getting Started
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Install Claude Code and start building in under 5 minutes.
        </p>
      </div>

      {/* Step 1: Prerequisites */}
      <div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">1</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prerequisites</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Account Required</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Claude Code requires a <strong>Claude Pro, Max, Teams, Enterprise, or Console (API)</strong> account.
              The free Claude.ai plan does not include Claude Code access.
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">System Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>macOS</strong> 13.0 (Ventura) or later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Linux:</strong> Ubuntu 20.04+ or Debian 10+</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Windows:</strong> Windows 10 (version 1809+) with WSL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>RAM:</strong> At least 4GB (8GB recommended)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Internet connection required</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Step 2: Install */}
      <div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">2</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Install Claude Code</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Native Installer <span className="text-xs text-emerald-600 font-normal">(Recommended)</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Zero dependencies, auto-updates in the background.
            </p>
            <CodeBlock code="curl -fsSL https://claude.ai/install.sh | bash" language="bash" />

            <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">
              npm Alternative <span className="text-xs text-gray-400 font-normal">(Legacy)</span>
            </h3>
            <CodeBlock code="npm install -g @anthropic-ai/claude-code" language="bash" />

            <h3 className="font-semibold text-gray-900 dark:text-white mt-6 mb-2">Verify Installation</h3>
            <CodeBlock code="claude --version" language="bash" />
          </div>
        </section>
      </div>

      {/* Step 3: Authenticate */}
      <div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">3</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authenticate</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Run <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">claude</code> for
              the first time. Your browser will open and ask you to sign in to your Anthropic account.
            </p>
            <CodeBlock code={`claude\n# → Browser opens → Sign in → Authorize the CLI`} language="bash" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Follow the browser prompts to authorize Claude Code. Once complete, return to your terminal — you&apos;re ready to go.
            </p>
          </div>
        </section>
      </div>

      {/* Step 4: API Key */}
      <div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">4</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get Your API Key (Optional)</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              If you&apos;re using a Console (API) account instead of a Pro/Max subscription, you&apos;ll need an API key.
            </p>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium flex items-center justify-center">1</span>
                <span>Go to <strong>console.anthropic.com</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium flex items-center justify-center">2</span>
                <span>Click <strong>&quot;API Keys&quot;</strong> in the sidebar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium flex items-center justify-center">3</span>
                <span>Click <strong>&quot;Create Key&quot;</strong> and copy the key</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium flex items-center justify-center">4</span>
                <span>Set it as an environment variable:</span>
              </li>
            </ol>
            <CodeBlock code="export ANTHROPIC_API_KEY=sk-ant-api03-..." language="bash" />
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Security:</strong> Never commit your API key to git. Add it to your shell profile (~/.zshrc or ~/.bashrc) or use a .env.local file.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Step 5: First Session */}
      <div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">5</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your First Session</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Navigate to any project directory and start Claude Code:
            </p>
            <CodeBlock code={`cd your-project\nclaude`} language="bash" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-3">Try these commands:</p>
            <CodeBlock code={`# See all available commands\n/help\n\n# Enter Plan Mode (read-only exploration)\n# Press Shift+Tab twice\n\n# Generate a CLAUDE.md for your project\n/init\n\n# Check what's loaded\n/memory`} language="bash" />
          </div>
        </section>
      </div>

      {/* Step 6: Recommended Setup */}
      <div>
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">6</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Setup</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Terminal</h4>
                <p>The Claude Code team recommends <strong>Ghostty</strong> for synchronized rendering, 24-bit color, and proper Unicode support. If using an IDE terminal, run <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/terminal-setup</code> first.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Configuration</h4>
                <p>Run <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/config</code> to set theme, notifications, and enable features like voice dictation and remote control.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">CLAUDE.md</h4>
                <p>Run <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">/init</code> in your project to auto-generate a CLAUDE.md with build commands and conventions.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Auto Mode</h4>
                <p>Enable auto mode to reduce permission prompts: <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">claude --enable-auto-mode</code></p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="text-center py-12 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to learn?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/lessons/1"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          >
            Start Lesson 1
          </Link>
          <Link
            href="/build"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
          >
            Build a Real Product
          </Link>
        </div>
      </div>
    </div>
  );
}
