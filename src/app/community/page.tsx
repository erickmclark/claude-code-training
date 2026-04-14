import Link from 'next/link';
import { parseChangelog } from '@/data/community/changelog-parser';
import { parseWhatsNew } from '@/data/community/whats-new-parser';
import { parseBorisTips } from '@/data/community/boris-tips-parser';
import { communityLinks } from '@/data/community/links';
import BorisTipOfTheDay from '@/src/components/community/BorisTipOfTheDay';
import WhatsNewFeed from '@/src/components/community/WhatsNewFeed';
import ChangelogTimeline from '@/src/components/community/ChangelogTimeline';
import CommunityLinks from '@/src/components/community/CommunityLinks';

export default function CommunityPage() {
  const changelog = parseChangelog();
  const whatsNew = parseWhatsNew();
  const tips = parseBorisTips();

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '100px 24px 60px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: 16 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none' }}>← Home</Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '8px',
            }}
          >
            Community & Updates
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-secondary)',
              lineHeight: 1.6,
            }}
          >
            Stay current with Claude Code — tips from Boris, weekly digests, and every release note.
            Content updates automatically from official sources.
          </p>
        </div>

        {/* Top section: Boris tip + Community links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '20px',
            marginBottom: '48px',
          }}
          className="community-top-grid"
        >
          <BorisTipOfTheDay tips={tips} />
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-hint)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              Community Links
            </h2>
            <CommunityLinks links={communityLinks} />
          </div>
        </div>

        {/* What's New section */}
        <div style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '20px',
            }}
          >
            What&apos;s New in Claude Code
          </h2>
          <WhatsNewFeed weeks={whatsNew} />
        </div>

        {/* Changelog section */}
        <div style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '20px',
            }}
          >
            Changelog
          </h2>
          <ChangelogTimeline versions={changelog} />
        </div>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 768px) {
          .community-top-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
