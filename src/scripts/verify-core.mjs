/**
 * verify-core: the pure logic behind /verify. Everything runs client-side —
 * files are read in the browser, hashed with WebCrypto, and compared. Nothing
 * is uploaded, stored, or sent anywhere (no server, no cookies, no registry).
 *
 * TRUST MODEL — what is under the hash and what is not:
 *  - The wipe-log FILE BYTES are what the certificate's SHA-256 covers. Every
 *    fact displayed as verified (outcome, serial, method, certificate ID) is
 *    parsed FROM THOSE VERIFIED BYTES, so tampering with any of them breaks
 *    the hash.
 *  - The certificate's embedded evidence block is NOT under the hash. It is
 *    used only as a pointer to the expected hash, and then cross-checked
 *    against the verified log: any disagreement is a FAIL, never a green pass
 *    beside a forged value.
 *
 * What a match proves: the record is unaltered since issuance. What it
 * deliberately does NOT prove: who issued it, or that a wipe physically
 * occurred. An offline, no-phone-home tool has no honest way to prove origin
 * (an embedded signing key would be extractable), so this page does not
 * pretend to.
 *
 * The log-line formats parsed here are pinned by tests in the ProofWipe app
 * repo (CertificateVerificationTests.Log_lines_the_verify_page_parses_are_pinned)
 * so the two cannot drift apart silently.
 *
 * Kept framework-free and DOM-free so `node --test` covers it directly.
 */

const EVIDENCE_RE =
  /<script\s+type="application\/json"\s+id="proofwipe-evidence">([\s\S]*?)<\/script>/;

/** Fields the evidence block must carry to be usable as a hash pointer. */
const REQUIRED = ['schema', 'certificateId', 'outcome', 'methodName', 'logSha256'];

/**
 * Extract and validate the machine-readable evidence block from a ProofWipe
 * HTML certificate. Returns the parsed object, or null when the document has
 * no usable block (e.g. an older certificate that predates it). The block is
 * a CONVENIENCE POINTER to the expected hash — never the source of truth for
 * displayed facts (those come from the hash-verified log).
 */
export function extractEvidence(html) {
  if (typeof html !== 'string') return null;
  const m = EVIDENCE_RE.exec(html);
  if (!m) return null;
  let parsed;
  try {
    parsed = JSON.parse(m[1]);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  if (parsed.schema !== 'proofwipe-cert-evidence/1') return null;
  for (const field of REQUIRED) {
    if (typeof parsed[field] !== 'string' || parsed[field].length === 0) return null;
  }
  if (!isSha256Hex(normalizeHash(parsed.logSha256))) return null;
  return parsed;
}

/** Lowercase, strip whitespace/colons — accepts hashes as people paste them. */
export function normalizeHash(text) {
  return String(text ?? '').replace(/[\s:]/g, '').toLowerCase();
}

export function isSha256Hex(text) {
  return /^[0-9a-f]{64}$/.test(text);
}

/** SHA-256 of raw bytes, lowercase hex. `subtle` injectable for tests. */
export async function sha256Hex(bytes, subtle = globalThis.crypto?.subtle) {
  if (!subtle) throw new Error('WebCrypto is unavailable in this browser.');
  const digest = await subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/* ---------------------------------------------------------------------------
 * Verified facts: parsed from the HASH-VERIFIED log bytes only.
 * Canonical line: "{ISO-8601 timestamp}|{message}" (message may contain '|').
 * ------------------------------------------------------------------------- */

const SESSION_START_RE = /^ProofWipe (firmware Purge )?session ([0-9A-Fa-f-]{36}) started$/;
const HARDWARE_SERIAL_RE = /^Hardware serial \(certificate\): (.+)$/;
const METHOD_RE = /^Method: (.+) \[([a-z0-9-]+)\]/;
const SESSION_ENDED_RE = /^Session ended: ([A-Za-z]+) \(duration /;

/**
 * Extract the display facts from the canonical log text. Call this ONLY with
 * text whose bytes matched the expected hash: everything returned is then
 * provably under that hash. Missing fields stay null — the UI shows them as
 * not-verified rather than borrowing them from the (unhashed) evidence block.
 */
export function extractVerifiedFacts(logText) {
  const facts = {
    certificateId: null,
    isPurge: null,
    serialNumber: null,      // concrete hardware serial, when recorded
    serialUnavailable: null, // the recorded reason, when it was NOT readable
    methodName: null,
    methodId: null,
    outcome: null,           // LAST "Session ended:" line wins (there is one)
  };
  for (const line of String(logText ?? '').split('\n')) {
    const sep = line.indexOf('|');
    if (sep < 0) continue;
    const message = line.slice(sep + 1);

    let m;
    if ((m = SESSION_START_RE.exec(message)) && facts.certificateId === null) {
      facts.isPurge = m[1] !== undefined;
      facts.certificateId = m[2].toUpperCase();
    } else if ((m = HARDWARE_SERIAL_RE.exec(message)) && facts.serialNumber === null && facts.serialUnavailable === null) {
      if (m[1].startsWith('UNAVAILABLE')) facts.serialUnavailable = m[1];
      else facts.serialNumber = m[1];
    } else if ((m = METHOD_RE.exec(message)) && facts.methodName === null) {
      facts.methodName = m[1];
      facts.methodId = m[2];
    } else if ((m = SESSION_ENDED_RE.exec(message))) {
      facts.outcome = m[1];
    }
  }
  return facts;
}

/**
 * Cross-check the (unhashed) evidence block against the verified facts. Any
 * field the block states that contradicts the hash-verified log is a forgery
 * signal. Fields absent from the log are not compared (they are simply not
 * displayed as verified).
 */
export function findEvidenceMismatches(evidence, facts) {
  const mismatches = [];
  const check = (field, stated, verified) => {
    if (stated != null && verified != null && String(stated) !== String(verified)) {
      mismatches.push({ field, stated: String(stated), verified: String(verified) });
    }
  };
  check('outcome', evidence.outcome, facts.outcome);
  check('certificateId', evidence.certificateId?.toUpperCase(), facts.certificateId);
  check('methodId', evidence.methodId, facts.methodId);
  check('methodName', evidence.methodName, facts.methodName);
  // Serial: compare only when the verified log recorded a concrete serial.
  check('serialNumber', facts.serialNumber != null ? evidence.serialNumber : null, facts.serialNumber);
  return mismatches;
}

/**
 * Compare a wipe-log file's bytes against an expected hash (from the evidence
 * block or pasted from the printed certificate). Returns a full verdict plus
 * the facts parsed from the verified bytes — never throws on a mismatch, only
 * on unusable input. `facts` is null unless the hash matched.
 */
export async function verifyLogAgainstHash(logBytes, expectedHash, subtle) {
  const expected = normalizeHash(expectedHash);
  if (!isSha256Hex(expected)) {
    throw new Error('The expected hash is not 64 hexadecimal characters.');
  }
  const computed = await sha256Hex(logBytes, subtle);
  const match = computed === expected;
  const facts = match ? extractVerifiedFacts(new TextDecoder().decode(logBytes)) : null;
  return { match, computed, expected, facts };
}

/**
 * The outcome as recorded in the verified log — shown honestly, including
 * partial and cancelled. `tone` drives the UI colour only.
 */
export function describeOutcome(outcome) {
  switch (outcome) {
    case 'Succeeded':
      return { label: 'Succeeded — sanitization completed and verified', tone: 'ok' };
    case 'Cancelled':
      return { label: 'Cancelled — PARTIAL wipe; the media was not fully sanitized', tone: 'warn' };
    case 'VerificationFailed':
      return { label: 'Verification FAILED — the wipe could not be verified', tone: 'bad' };
    case 'Failed':
      return { label: 'Failed — the session did not complete', tone: 'bad' };
    default:
      return { label: `${outcome} (unrecognized outcome — inspect the log)`, tone: 'warn' };
  }
}

/**
 * Full verification of a certificate HTML + wipe-log pair.
 * Returns { status: 'pass' | 'fail' | 'unusable', ... }. On 'pass', `facts`
 * carries the display fields parsed from the hash-verified log — the ONLY
 * values the UI may present as verified. A hash match with an evidence block
 * that contradicts the log is a 'fail' (forged display fields), never a pass.
 */
export async function verifyCertificatePair(certHtml, logBytes, subtle) {
  const evidence = extractEvidence(certHtml);
  if (!evidence) {
    return {
      status: 'unusable',
      reason:
        'No machine-readable evidence block found. Older certificates can still be ' +
        'checked in manual mode using the SHA-256 printed on the certificate.',
    };
  }
  const { match, computed, expected, facts } = await verifyLogAgainstHash(
    logBytes,
    evidence.logSha256,
    subtle,
  );
  if (!match) {
    return { status: 'fail', reason: 'The wipe log does not hash to the value on the certificate.', computed, expected };
  }
  const mismatches = findEvidenceMismatches(evidence, facts);
  if (mismatches.length > 0) {
    return {
      status: 'fail',
      reason:
        'The log is intact, but the certificate’s summary fields do not match the ' +
        'hash-verified log — the certificate’s displayed values appear altered.',
      mismatches,
      facts,
      computed,
      expected,
    };
  }
  return { status: 'pass', facts, computed, expected };
}
