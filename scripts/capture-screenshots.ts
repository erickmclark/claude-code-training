/**
 * VHS screenshot capture script.
 *
 * Runs all .tape files in public/tapes/ through the `vhs` CLI tool,
 * which generates GIFs and PNGs in public/screenshots/ automatically.
 *
 * Requirements:
 *   brew install charmbracelet/tap/vhs
 *
 * Run:
 *   npx tsx scripts/capture-screenshots.ts
 *   — or —
 *   npm run capture:screenshots
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const TAPES_DIR = path.resolve(__dirname, '..', 'public', 'tapes');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'screenshots');

function main() {
  // Verify VHS is installed
  try {
    execSync('which vhs', { stdio: 'ignore' });
  } catch {
    console.error('Error: vhs is not installed. Run: brew install charmbracelet/tap/vhs');
    process.exit(1);
  }

  // Ensure directories exist
  fs.mkdirSync(TAPES_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Find all .tape files
  const tapes = fs.readdirSync(TAPES_DIR).filter((f) => f.endsWith('.tape'));

  if (tapes.length === 0) {
    console.log('No .tape files found in public/tapes/. Create one to get started.');
    console.log('\nExample tape file (public/tapes/plan-mode.tape):');
    console.log('  Output public/screenshots/plan-mode.gif');
    console.log('  Set FontSize 14');
    console.log('  Set Width 800');
    console.log('  Set Height 500');
    console.log('  Set Theme "Monokai"');
    console.log('  Type "claude"');
    console.log('  Enter');
    console.log('  Sleep 2s');
    return;
  }

  console.log(`Found ${tapes.length} tape file(s). Capturing...\n`);

  let success = 0;
  let failed = 0;

  for (const tape of tapes) {
    const tapePath = path.join(TAPES_DIR, tape);
    const name = path.basename(tape, '.tape');
    console.log(`  → ${name}`);

    try {
      execSync(`vhs "${tapePath}"`, {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'pipe',
        timeout: 120000, // 2 min max per tape
      });
      console.log(`    ✓ Generated`);
      success++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`    ✗ Failed: ${message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
  console.log(`Screenshots saved to: ${OUTPUT_DIR}/`);
}

main();
