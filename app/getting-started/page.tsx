'use client';

import { useState } from 'react';
import Link from 'next/link';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        background: 'none',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 4,
        padding: '4px 10px',
        color: copied ? '#7ee787' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        fontSize: 11,
        fontFamily: 'var(--font-body)',
      }}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

function CodeBox({ code, label }: { code: string; label?: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-ink)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{label ?? 'terminal'}</span>
        <CopyButton text={code} />
      </div>
      <pre style={{ padding: '12px 16px', margin: 0, fontSize: 13, lineHeight: 1.6, color: '#e8e4de', fontFamily: "'Fira Code', 'Menlo', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {code}
      </pre>
    </div>
  );
}

type Platform = 'mac' | 'linux' | 'windows';

export default function GettingStartedPage() {
  const [platform, setPlatform] = useState<Platform>('mac');

  const installCommands: Record<Platform, { primary: string; label: string; note: string }> = {
    mac: {
      primary: 'curl -fsSL https://claude.ai/install.sh | bash',
      label: 'macOS Terminal (Terminal.app, iTerm2, etc.)',
      note: 'This downloads and installs Claude Code. It auto-updates in the background.',
    },
    linux: {
      primary: 'curl -fsSL https://claude.ai/install.sh | bash',
      label: 'Linux Terminal',
      note: 'Works on Ubuntu 20.04+, Debian 10+, and Alpine Linux 3.19+.',
    },
    windows: {
      primary: 'irm https://claude.ai/install.ps1 | iex',
      label: 'Windows PowerShell',
      note: 'Requires Git for Windows. Download it from git-scm.com/downloads/win first.',
    },
  };

  const cmd = installCommands[platform];

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      {/* Back Link */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 24px 0' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none' }}>← Home</Link>
      </div>

      {/* Header */}
      <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-coral-light)', padding: '48px 24px', textAlign: 'center', borderBottom: '1px solid var(--color-coral)' }}>
        <p style={{ fontSize: 13, color: 'var(--color-coral)', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Before You Begin
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>
          Install Claude Code
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
          Every lesson in this course requires Claude Code. Follow these steps to install it on your computer before starting any lessons.
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* What You Need */}
        <section className="animate-fade-in-up stagger-1" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)', flexShrink: 0 }}>1</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>What You Need</h2>
          </div>
          <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Account */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👤</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                    A paid Anthropic account
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>
                    You need a <strong>Claude Pro ($20/mo), Max, Team, or Enterprise</strong> subscription.
                    The free Claude.ai plan does not include Claude Code.
                    Sign up at <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-coral)', textDecoration: 'none', fontWeight: 600 }}>claude.ai</a>.
                  </p>
                </div>
              </div>
              {/* Computer */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💻</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                    A computer with a terminal
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>
                    macOS 13+, Ubuntu 20.04+, Debian 10+, or Windows 10+ with Git for Windows.
                    At least 4 GB of RAM. Internet connection required.
                  </p>
                </div>
              </div>
              {/* Terminal knowledge */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>⌨</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                    Know how to open a terminal
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>
                    <strong>Mac:</strong> Open Spotlight (Cmd+Space) and type &quot;Terminal&quot;.{' '}
                    <strong>Windows:</strong> Search for &quot;PowerShell&quot; in the Start menu.{' '}
                    <strong>Linux:</strong> Press Ctrl+Alt+T.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Install */}
        <section className="animate-fade-in-up stagger-2" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)', flexShrink: 0 }}>2</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>Install Claude Code</h2>
          </div>
          <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            {/* Platform tabs */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: '0 0 12px 0' }}>
              Select your operating system:
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {([
                {
                  key: 'mac' as Platform,
                  label: 'macOS',
                  icon: (color: string) => (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={color} aria-hidden="true">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  ),
                },
                {
                  key: 'linux' as Platform,
                  label: 'Linux',
                  icon: (color: string) => (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={color} aria-hidden="true">
                      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.05-.087.146-.257.134-.469-.01-.112-.022-.225-.082-.342-.067-.116-.183-.233-.33-.233-.128 0-.26.122-.326.222-.062.117-.148.23-.148.342 0 .093.023.187.061.276.035.1.076.188.087.23-.048.025-.085.054-.12.054zm-2.962-.059c.29 0 .553.203.735.53.2.332.305.775.305 1.255 0 .063-.004.124-.01.183a.731.731 0 00-.215-.027l-.24.065c.009-.104.023-.21.023-.32 0-.46-.075-.83-.215-1.043-.139-.21-.29-.29-.45-.29-.173 0-.337.09-.478.295-.138.2-.225.536-.225.951 0 .103-.004.26-.011.32-.018-.013-.04-.02-.064-.02a.71.71 0 00-.205.045c-.022-.144-.03-.27-.03-.436 0-.527.12-.987.308-1.312.19-.322.436-.51.725-.51zm1.612 1.09c.062 0 .11.053.142.117.03.066.04.173.04.282s-.015.212-.04.281c-.03.077-.088.117-.145.117s-.116-.057-.145-.126c-.03-.068-.038-.168-.038-.278 0-.112.008-.212.037-.281.027-.062.088-.112.15-.112zm-4.442.36c.184 0 .36.07.48.196.123.13.184.283.184.476a.6.6 0 01-.12.36.76.76 0 01-.284.256.75.75 0 00.025-.105c.013-.062.021-.133.021-.205 0-.146-.037-.297-.12-.42a.37.37 0 00-.317-.196.32.32 0 00-.241.117.43.43 0 00-.12.293c0 .12.04.244.12.34a.356.356 0 00.27.135c.047 0 .12-.013.15-.027-.03.067-.07.112-.129.17a.392.392 0 01-.285.126c-.175 0-.342-.084-.473-.213a.678.678 0 01-.211-.493c0-.193.07-.358.203-.487a.72.72 0 01.482-.212z" />
                    </svg>
                  ),
                },
                {
                  key: 'windows' as Platform,
                  label: 'Windows',
                  icon: (color: string) => (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={color} aria-hidden="true">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                    </svg>
                  ),
                },
              ]).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setPlatform(key)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: platform === key ? 600 : 400,
                    color: platform === key ? '#fff' : 'var(--color-secondary)',
                    backgroundColor: platform === key ? 'var(--color-coral)' : 'var(--color-sand)',
                    border: platform === key ? '1px solid var(--color-coral)' : 'var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {icon(platform === key ? '#fff' : 'var(--color-secondary)')}
                  {label}
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                Step A: Open {cmd.label}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                {platform === 'mac' && 'Press Cmd+Space, type "Terminal", and press Enter. A black or white window with a blinking cursor will appear.'}
                {platform === 'linux' && 'Press Ctrl+Alt+T to open the default terminal emulator. A window with a blinking cursor will appear.'}
                {platform === 'windows' && 'Click the Start menu, type "PowerShell", and click "Windows PowerShell". A blue window will appear. Make sure you have Git for Windows installed first.'}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                Step B: Paste this command and press Enter
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Click the &quot;copy&quot; button, then paste into your terminal ({platform === 'mac' ? 'Cmd+V' : 'Ctrl+V'}) and press Enter.
              </p>
              <CodeBox code={cmd.primary} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                {cmd.note}
              </p>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                Step C: Verify it worked
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Type this command and press Enter. You should see a version number like <code style={{ backgroundColor: 'var(--color-sand)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>2.1.92</code>.
              </p>
              <CodeBox code="claude --version" />
            </div>

            {/* Troubleshooting */}
            <div style={{ backgroundColor: 'var(--color-coral-light)', border: '1px solid var(--color-coral)', borderRadius: 'var(--radius-md)', padding: 16, marginTop: 20 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-coral-dark)', margin: '0 0 6px 0' }}>
                Not working?
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-body)', margin: 0, lineHeight: 1.6 }}>
                If you see &quot;command not found&quot;, close your terminal and open a new one, then try <code style={{ fontSize: 11 }}>claude --version</code> again.
                {platform === 'windows' && ' On Windows, make sure Git for Windows is installed and added to your PATH.'}
                {' '}Still stuck? Try the alternative: <code style={{ fontSize: 11 }}>npm install -g @anthropic-ai/claude-code</code> (requires Node.js 18+).
              </p>
            </div>
          </div>
        </section>

        {/* Sign In */}
        <section className="animate-fade-in-up stagger-3" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)', flexShrink: 0 }}>3</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>Sign In to Your Account</h2>
          </div>
          <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', margin: '0 0 16px 0', lineHeight: 1.6 }}>
              Type <code style={{ backgroundColor: 'var(--color-sand)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>claude</code> in your terminal and press Enter. Here&apos;s what happens:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {[
                { step: '1', text: 'Your web browser opens automatically to the Anthropic sign-in page' },
                { step: '2', text: 'Sign in with the email address you used for your Claude subscription' },
                { step: '3', text: 'Click "Authorize" to connect Claude Code to your account' },
                { step: '4', text: 'Switch back to your terminal — you\'ll see a welcome message and a blinking cursor' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', flexShrink: 0 }}>{step}</div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-body)', margin: 0, lineHeight: 1.5 }}>{text}</p>
                </div>
              ))}
            </div>
            <CodeBox code={`claude\n# Your browser opens automatically\n# Sign in → Click "Authorize" → Return to terminal`} />

            <div style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-md)', padding: 16, marginTop: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-secondary)', margin: 0, lineHeight: 1.6 }}>
                <strong>Tip:</strong> If the browser doesn&apos;t open automatically, press <code style={{ fontSize: 11 }}>c</code> in the terminal to copy the login URL, then paste it into your browser manually.
              </p>
            </div>
          </div>
        </section>

        {/* First Session */}
        <section className="animate-fade-in-up stagger-4" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)', flexShrink: 0 }}>4</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>Try Your First Command</h2>
          </div>
          <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', margin: '0 0 16px 0', lineHeight: 1.6 }}>
              Once you see the Claude Code prompt (a blinking cursor after the welcome message), you&apos;re ready. Type a question or task and press Enter:
            </p>
            <CodeBox code={`> what can you help me with?\n\n# Claude responds with a list of things it can do.\n# Try asking it about your project:\n> explain what this project does`} label="claude code session" />

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)', margin: '24px 0 8px 0' }}>
              Useful commands to know:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { cmd: '/help', desc: 'See all commands' },
                { cmd: '/init', desc: 'Create a CLAUDE.md file' },
                { cmd: 'Shift+Tab', desc: 'Toggle plan mode' },
                { cmd: 'Esc', desc: 'Stop Claude mid-response' },
                { cmd: '/clear', desc: 'Reset the conversation' },
                { cmd: '/model', desc: 'Change the AI model' },
              ].map(({ cmd: c, desc }) => (
                <div key={c} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-sm)' }}>
                  <code style={{ fontSize: 12, color: 'var(--color-coral)', fontWeight: 600, fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap' }}>{c}</code>
                  <span style={{ fontSize: 12, color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You're Ready */}
        <section className="animate-fade-in-up stagger-5">
          <div style={{ backgroundColor: 'var(--color-coral-light)', border: '1px solid var(--color-coral)', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>
              You&apos;re Ready
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-secondary)', margin: '0 0 24px 0', lineHeight: 1.6, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
              Claude Code is installed and connected. Start your first lesson and practice every technique in real time.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/lesson/1"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: 'var(--color-coral)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                }}
              >
                Start Lesson 1 →
              </Link>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#fff',
                  color: 'var(--color-ink)',
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  border: 'var(--border)',
                }}
              >
                Browse All Lessons
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
