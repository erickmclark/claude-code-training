'use client';

/**
 * ContentCard – "scenario" variant
 *
 * Compact card with content on the left and an avatar photo on the right.
 * Renders the AI-enriched "In practice" use-case scenario in lesson steps.
 */

interface ContentCardProps {
  quote: string;
  name: string;
  role?: string;
  industry?: string;
  techniques?: string[];
  lessonHref?: string;
  eyebrow?: string;
}

function avatarSrc(name: string): string {
  const idx = ((name.charCodeAt(0) % 10) + 1);
  return `/images/avatars/avatar-${idx}.jpg`;
}

export default function ContentCard({
  quote,
  name,
  role,
  industry,
  techniques,
  lessonHref,
  eyebrow = 'In practice',
}: ContentCardProps) {
  return (
    <div
      style={{
        border: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {/* Main grid: content left, avatar panel right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px',
        }}
      >
        {/* ── Left: content ── */}
        <div style={{ padding: '24px 28px 20px' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'var(--color-coral)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-coral)',
              }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Quote */}
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              lineHeight: 1.6,
              fontStyle: 'italic',
              color: 'var(--color-body)',
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: `\u201c${quote}\u201d` }}
          />

          {/* Attribution */}
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                width: 24,
                height: 1,
                backgroundColor: 'var(--color-border)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              {name}
            </span>
            {(role || industry) && (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--color-hint)',
                }}
              >
                {[role, industry].filter(Boolean).join(' · ')}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: avatar panel ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 12px',
            borderLeft: 'var(--border)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc(name)}
            alt={name}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-coral)',
              marginBottom: 8,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-ink)',
              textAlign: 'center',
            }}
          >
            {name}
          </span>
          {role && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                color: 'var(--color-hint)',
                textAlign: 'center',
                marginTop: 2,
              }}
            >
              {role}
            </span>
          )}
        </div>
      </div>

      {/* ── Footer: tags + optional link ── */}
      {((techniques && techniques.length > 0) || lessonHref) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 28px',
            backgroundColor: 'var(--color-sand)',
            borderTop: 'var(--border)',
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {techniques?.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--color-secondary)',
                  backgroundColor: 'var(--color-cream)',
                  border: 'var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {lessonHref && (
            <a
              href={lessonHref}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-coral)',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              View lesson &rsaquo;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
