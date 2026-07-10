#!/usr/bin/env node
/**
 * Headless driver for the REAL /verify code path (src/scripts/verify-core.mjs).
 *
 *   node scripts/verify-cert-cli.mjs <cert.html> <wipe-log.txt>
 *
 * Prints a single JSON line: { status, reason?, computed?, expected?, ... }.
 * Used by the ProofWipe app's cross-repo E2E test to run genuine app-generated
 * certificates (Free / Pro / Business, plus tamper-mutated copies) through the
 * exact verifier the website ships — no duplicated logic, no drift.
 */
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import { verifyCertificatePair } from '../src/scripts/verify-core.mjs';

const [certPath, logPath] = process.argv.slice(2);
if (!certPath || !logPath) {
  console.error('usage: verify-cert-cli.mjs <cert.html> <wipe-log.txt>');
  process.exit(2);
}

const certHtml = await readFile(certPath, 'utf8');
const logBytes = new Uint8Array(await readFile(logPath));
const result = await verifyCertificatePair(certHtml, logBytes, webcrypto.subtle);
process.stdout.write(JSON.stringify(result));
