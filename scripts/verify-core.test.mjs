/**
 * node --test coverage for the /verify page's pure logic (verify-core.mjs).
 *
 * Trust-model tests: everything displayed as verified must be provably under
 * the hash. The evidence block is only a pointer; forging it (outcome flip,
 * serial swap) while keeping the genuine log must NEVER produce a PASS beside
 * the forged value. The log-line formats parsed here are pinned app-side by
 * CertificateVerificationTests so the two repos cannot drift silently.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import {
  extractEvidence,
  extractVerifiedFacts,
  findEvidenceMismatches,
  normalizeHash,
  isSha256Hex,
  sha256Hex,
  verifyLogAgainstHash,
  verifyCertificatePair,
  describeOutcome,
} from '../src/scripts/verify-core.mjs';

const subtle = webcrypto.subtle;
const enc = new TextEncoder();

const CERT_ID = 'AAAABBBB-CCCC-DDDD-EEEE-FFFF00001111';

/** A realistic canonical wipe log — the same lines the real sessions write. */
const LOG_TEXT =
  `2026-07-08T03:04:05.0000000Z|ProofWipe session ${CERT_ID} started\n` +
  '2026-07-08T03:04:05.0000000Z|Target: \\\\.\\PhysicalDrive3 (1,000,204,886,016 bytes; 512 B logical / 4096 B physical sectors)\n' +
  '2026-07-08T03:04:05.0000000Z|Drive: WDC WD10EZEX-08WN4A0, serial WD-WCC6Y4PPXXXX (reliable: True), bus Sata, media Hdd (Confirmed)\n' +
  '2026-07-08T03:04:05.0000000Z|Hardware serial (certificate): S7G6NF2X985248\n' +
  '2026-07-08T03:04:05.0000000Z|Method: NIST 800-88 Clear (1-pass zeros) [nist-800-88-clear], 1 pass(es); verification: 10% sample\n' +
  '2026-07-08T03:09:06.0000000Z|pass 1 complete | 1,000,204,886,016 bytes\n' +
  '2026-07-08T03:10:06.0000000Z|Verification PASSED.\n' +
  '2026-07-08T03:10:07.0000000Z|Session ended: Succeeded (duration 00:06:02)\n';
const LOG_BYTES = enc.encode(LOG_TEXT);

async function makeCertHtml(overrides = {}) {
  const evidence = {
    schema: 'proofwipe-cert-evidence/1',
    certificateId: CERT_ID,
    outcome: 'Succeeded',
    sanitizationType: 'Clear',
    methodId: 'nist-800-88-clear',
    methodName: 'NIST 800-88 Clear (1-pass zeros)',
    serialNumber: 'S7G6NF2X985248',
    logEntries: 8,
    logSha256: await sha256Hex(LOG_BYTES, subtle),
    ...overrides,
  };
  return (
    '<!DOCTYPE html><html><body><div class="sheet">certificate body</div>' +
    `<script type="application/json" id="proofwipe-evidence">${JSON.stringify(evidence)}</script>` +
    '</body></html>'
  );
}

// ---- the happy path: displayed facts come from the verified bytes ----------

test('valid certificate + log pair passes, with facts parsed from the verified log', async () => {
  const verdict = await verifyCertificatePair(await makeCertHtml(), LOG_BYTES, subtle);
  assert.equal(verdict.status, 'pass');
  assert.equal(verdict.computed, verdict.expected);
  // Every displayed field is sourced from the hash-verified log, not the block:
  assert.equal(verdict.facts.outcome, 'Succeeded');
  assert.equal(verdict.facts.serialNumber, 'S7G6NF2X985248');
  assert.equal(verdict.facts.methodName, 'NIST 800-88 Clear (1-pass zeros)');
  assert.equal(verdict.facts.methodId, 'nist-800-88-clear');
  assert.equal(verdict.facts.certificateId, CERT_ID);
  assert.equal(verdict.facts.isPurge, false);
});

test('altered log fails the hash check', async () => {
  const tampered = new Uint8Array(LOG_BYTES);
  tampered[tampered.length - 5] ^= 0x01;
  const verdict = await verifyCertificatePair(await makeCertHtml(), tampered, subtle);
  assert.equal(verdict.status, 'fail');
  assert.notEqual(verdict.computed, verdict.expected);
  assert.equal(verdict.facts, undefined); // nothing is presented as verified
});

// ---- THE integrity gap: forged evidence block + genuine log ----------------

test('forged evidence outcome (Failed session shown as Succeeded) is a FAIL, never a green pass', async () => {
  // A genuine log of a FAILED session…
  const failedLog = enc.encode(LOG_TEXT
    .replace('Session ended: Succeeded', 'Session ended: Failed')
    .replace('Verification PASSED.', 'Session aborted by error: IOException: device lost'));
  // …with a forged certificate claiming Success (hash updated to the real log,
  // so the hash check alone would pass).
  const forgedCert = await makeCertHtml({
    outcome: 'Succeeded',
    logSha256: await sha256Hex(failedLog, subtle),
  });

  const verdict = await verifyCertificatePair(forgedCert, failedLog, subtle);
  assert.equal(verdict.status, 'fail');
  assert.match(verdict.reason, /do not match the hash-verified log/);
  const mm = verdict.mismatches.find((m) => m.field === 'outcome');
  assert.equal(mm.stated, 'Succeeded');   // what the forged certificate claims
  assert.equal(mm.verified, 'Failed');    // what the hash-verified log proves
  // The verified truth is still available for honest display:
  assert.equal(verdict.facts.outcome, 'Failed');
});

test('forged evidence serial (swapped drive) is a FAIL, never a green pass', async () => {
  const forgedCert = await makeCertHtml({ serialNumber: 'TOTALLY-DIFFERENT-DRIVE' });
  const verdict = await verifyCertificatePair(forgedCert, LOG_BYTES, subtle);
  assert.equal(verdict.status, 'fail');
  const mm = verdict.mismatches.find((m) => m.field === 'serialNumber');
  assert.equal(mm.stated, 'TOTALLY-DIFFERENT-DRIVE');
  assert.equal(mm.verified, 'S7G6NF2X985248');
});

test('forged evidence method is a FAIL', async () => {
  const forgedCert = await makeCertHtml({ methodId: 'dod-5220-22-m', methodName: 'DoD 5220.22-M (3-pass)' });
  const verdict = await verifyCertificatePair(forgedCert, LOG_BYTES, subtle);
  assert.equal(verdict.status, 'fail');
  assert.ok(verdict.mismatches.some((m) => m.field === 'methodId'));
});

test('altered certificate hash also fails (cert and log must agree)', async () => {
  const verdict = await verifyCertificatePair(await makeCertHtml({ logSha256: 'a'.repeat(64) }), LOG_BYTES, subtle);
  assert.equal(verdict.status, 'fail');
});

// ---- verified-fact extraction ----------------------------------------------

test('facts parse from purge logs and messages containing pipes', () => {
  const purgeLog =
    `2026-07-08T03:04:05.0000000Z|ProofWipe firmware Purge session ${CERT_ID} started\n` +
    '2026-07-08T03:04:05.0000000Z|Hardware serial (certificate): S6XPNJ0T123456\n' +
    '2026-07-08T03:04:05.0000000Z|Method: NVMe Firmware Purge (Sanitize / Format) [nvme-firmware-purge]\n' +
    '2026-07-08T03:09:06.0000000Z|Sanitize in progress: 50 %|snapshot\n' +
    '2026-07-08T03:10:07.0000000Z|Session ended: Succeeded (duration 00:06:02)\n';
  const facts = extractVerifiedFacts(purgeLog);
  assert.equal(facts.isPurge, true);
  assert.equal(facts.methodId, 'nvme-firmware-purge');
  assert.equal(facts.serialNumber, 'S6XPNJ0T123456');
  assert.equal(facts.outcome, 'Succeeded');
});

test('unavailable hardware serial stays unavailable — never borrowed from the evidence block', async () => {
  const noSerialLog = enc.encode(LOG_TEXT.replace(
    'Hardware serial (certificate): S7G6NF2X985248',
    'Hardware serial (certificate): UNAVAILABLE — NVMe Identify blocked by controller'));
  const facts = extractVerifiedFacts(new TextDecoder().decode(noSerialLog));
  assert.equal(facts.serialNumber, null);
  assert.match(facts.serialUnavailable, /^UNAVAILABLE/);
  // Evidence claiming a concrete serial is NOT cross-failed (nothing concrete
  // to compare) but also NOT displayed as verified — the UI shows the log's
  // UNAVAILABLE record. Mismatch list must not invent a comparison:
  const cert = await makeCertHtml({ logSha256: await sha256Hex(noSerialLog, subtle) });
  const verdict = await verifyCertificatePair(cert, noSerialLog, subtle);
  assert.equal(verdict.status, 'pass');
  assert.equal(verdict.facts.serialNumber, null);
});

test('cancelled and partial outcomes are surfaced honestly from the log', async () => {
  const cancelledLog = enc.encode(LOG_TEXT.replace('Session ended: Succeeded', 'Session ended: Cancelled'));
  const cert = await makeCertHtml({ outcome: 'Cancelled', logSha256: await sha256Hex(cancelledLog, subtle) });
  const verdict = await verifyCertificatePair(cert, cancelledLog, subtle);
  assert.equal(verdict.status, 'pass');           // the RECORD is intact…
  const outcome = describeOutcome(verdict.facts.outcome);
  assert.equal(outcome.tone, 'warn');             // …and still says partial
  assert.match(outcome.label, /PARTIAL/);
  assert.equal(describeOutcome('VerificationFailed').tone, 'bad');
});

// ---- old certs + manual mode -------------------------------------------------

test('certificate without an evidence block is unusable, never a false verdict', async () => {
  const verdict = await verifyCertificatePair('<html><body>old certificate</body></html>', LOG_BYTES, subtle);
  assert.equal(verdict.status, 'unusable');
  assert.match(verdict.reason, /manual mode/);
});

test('malformed or wrong-schema evidence blocks are rejected', async () => {
  assert.equal(extractEvidence('<script type="application/json" id="proofwipe-evidence">not json</script>'), null);
  assert.equal(extractEvidence(await makeCertHtml({ schema: 'someone-elses/9' })), null);
  assert.equal(extractEvidence(await makeCertHtml({ logSha256: 'tooshort' })), null);
  assert.equal(extractEvidence(null), null);
});

test('manual mode: verified facts come from the log once the pasted hash matches', async () => {
  const hash = await sha256Hex(LOG_BYTES, subtle);
  const pasted = ' ' + hash.toUpperCase().match(/.{8}/g).join(' ') + '\n';
  const verdict = await verifyLogAgainstHash(LOG_BYTES, pasted, subtle);
  assert.equal(verdict.match, true);
  assert.equal(verdict.facts.outcome, 'Succeeded');
  assert.equal(verdict.facts.serialNumber, 'S7G6NF2X985248');
  assert.ok(isSha256Hex(normalizeHash(pasted)));
});

test('manual mode rejects non-hash input instead of failing silently', async () => {
  await assert.rejects(() => verifyLogAgainstHash(LOG_BYTES, 'not-a-hash', subtle), /64 hexadecimal/);
});

test('mismatch detector compares only concrete, present fields', () => {
  const facts = extractVerifiedFacts(LOG_TEXT);
  assert.deepEqual(findEvidenceMismatches({
    outcome: 'Succeeded', certificateId: CERT_ID.toLowerCase(),
    methodId: 'nist-800-88-clear', methodName: 'NIST 800-88 Clear (1-pass zeros)',
    serialNumber: 'S7G6NF2X985248',
  }, facts), []);
});
