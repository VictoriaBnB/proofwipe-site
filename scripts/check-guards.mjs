#!/usr/bin/env node
/**
 * Post-build guard sweep. Fails the build (exit 1) if the generated site
 * violates any standing rule:
 *
 *  1. Forbidden strings: "VerifWipe" (old working title), competitor names
 *     (owner decision 2026-07-03: never named).
 *  2. NIST revision leakage: no "Rev. 1/2", "Revision 1/2", "800-88r1/r2",
 *     and no "latest"/"most current" near standards wording.
 *  3. "certified": allowed ONLY inside the approved not-certified disclaimer
 *     or the FAQ question quoting it.
 *  4. Unsigned claims: any claims.ts entry with status 'needs-signoff' must
 *     not appear in the built HTML.
 *
 * Run automatically via the npm "postbuild" hook.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const CLAIMS = new URL('../src/data/claims.ts', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    // dist/samples holds APP-GENERATED artifacts (the downloadable sample
    // certificate). Their wording (e.g. NIST revision text) is governed by the
    // app's own tests, not the site copy rules — skip them here.
    if (statSync(p).isDirectory()) { if (name !== 'samples') out.push(...htmlFiles(p)); }
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = htmlFiles(DIST).map((p) => ({ path: p, text: readFileSync(p, 'utf8') }));
const failures = [];

// --- 1. Forbidden strings ---------------------------------------------------
const forbidden = [/verifwipe/i, /blancco/i, /killdisk/i];
for (const f of files)
  for (const re of forbidden)
    if (re.test(f.text)) failures.push(`${f.path}: forbidden string ${re}`);

// --- 2. Revision leakage ------------------------------------------------------
const revision = [/\brev(?:ision)?\.?\s?[12]\b/i, /800-88\s?r[12]\b/i, /\b(latest|most current)\b[^.]{0,60}800-88/i, /800-88[^.]{0,60}\b(latest|most current)\b/i];
for (const f of files)
  for (const re of revision)
    if (re.test(f.text)) failures.push(`${f.path}: revision leakage ${re}`);

// --- 3. "certified" outside the approved disclaimer --------------------------
const allowedCertified = [
  'not a third-party-certified product', // approved disclaimer
  'Is ProofWipe certified',              // FAQ question answered BY the disclaimer
  // Benign "given a certificate" sense in the wipe-a-server guide's verbatim
  // owner copy — NOT the third-party-certification claim this rule guards.
  'sanitized and certified on its own',
];
for (const f of files) {
  const stripped = allowedCertified.reduce((t, a) => t.split(a).join(''), f.text);
  if (/certified/i.test(stripped)) failures.push(`${f.path}: "certified" outside approved disclaimer`);
}

// --- 4. Unsigned claims must not render --------------------------------------
const claimsSrc = readFileSync(CLAIMS, 'utf8');

/**
 * Owner-sanctioned pending exceptions: claims still 'needs-signoff' that the
 * owner explicitly directed to keep rendered while wording is confirmed in
 * CLAIMS-FOR-SIGNOFF.md. Empty since 2026-07-03 (all claims approved); add
 * entries here only with an explicit owner direction.
 */
const sanctionedPending = [];

const unsigned = [];
const blockRe = /text:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*status:\s*'needs-signoff'/g;
let m;
while ((m = blockRe.exec(claimsSrc)) !== null) unsigned.push(m[1].replace(/\\'/g, "'"));
for (const f of files)
  for (const text of unsigned) {
    if (sanctionedPending.some((s) => text.startsWith(s))) continue;
    // Compare on a distinctive prefix to survive HTML entity encoding of dashes etc.
    const probe = text.slice(0, 60);
    if (probe.length > 20 && f.text.includes(probe))
      failures.push(`${f.path}: unsigned claim rendered: "${probe}..."`);
  }

// --- Report -------------------------------------------------------------------
if (failures.length) {
  console.error('\n✗ GUARD SWEEP FAILED:\n' + failures.map((f) => '  - ' + f).join('\n'));
  process.exit(1);
}
console.log(`✓ Guard sweep passed (${files.length} pages, ${unsigned.length} unsigned claims gated).`);
