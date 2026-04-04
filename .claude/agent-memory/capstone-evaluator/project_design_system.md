---
name: Design system usage
description: How to apply CSS custom properties, what tokens exist, and what to avoid
type: project
---

Design system lives in `src/styles/design-system.css`. All new UI uses inline styles with CSS vars.

**Palette:**
- `--color-cream` (#faf8f5) — page background
- `--color-sand` (#f0ece6) — subtle section bg, hover states
- `--color-border` (#e8e4de) — borders
- `--color-muted` (#c9c4bb) — disabled states
- `--color-coral` (#cc5c38) — primary accent, CTAs
- `--color-coral-dark` (#b84e2c) — hover for coral buttons
- `--color-coral-light` (#fce8e4) — coral tint backgrounds
- `--color-ink` (#1a1916) — headings
- `--color-body` (#3d3a35) — body text
- `--color-secondary` (#5c5750) — secondary text
- `--color-hint` (#9a9589) — placeholder, metadata

**Fonts:**
- `--font-display` (Lora serif) — headings, titles
- `--font-body` (DM Sans) — body text, labels, buttons

**Radius:**
- `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (14px), `--radius-full` (pill)

**Border shorthand:** `--border` = `0.5px solid var(--color-border)`

**NEVER use:** hardcoded hex colors, Tailwind color classes (bg-blue-500 etc.)
**ALWAYS use:** `style={{ color: 'var(--color-ink)' }}` pattern

**Why:** Old pages use dark Tailwind theme; new src/app pages use this design system. Mixing them causes visual inconsistency.
**How to apply:** Every new component should apply all colors and fonts via CSS var inline styles.
