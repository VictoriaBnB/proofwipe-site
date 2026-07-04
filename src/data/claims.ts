/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH — standards strings & compliance/comparative claims
 * ============================================================================
 *
 * Every sentence in the site that makes a compliance, standards, or comparative
 * claim MUST come from this file. Nothing is invented in page copy.
 *
 * RULES (per project owner):
 *  - Reference "NIST SP 800-88" GENERICALLY. Do NOT print a revision number
 *    anywhere. Do NOT imply "latest" / "current" / "Rev. 2".
 *  - Reference "CSE ITSP.40.006" by name only (no version label) until signed
 *    off. `revisionLine` placeholders below make adding a specific revision
 *    sentence a one-line change later.
 *  - Never say "certified". ProofWipe IMPLEMENTS the standards; it is not
 *    third-party certified.
 *  - `status: 'needs-signoff'` claims MUST NOT be rendered in production copy.
 *    A build check can grep for them. Flip to 'approved' only after the owner
 *    signs off (tracked in CLAIMS-FOR-SIGNOFF.md).
 */

export type ClaimStatus = 'approved' | 'needs-signoff';

export interface Claim {
  id: string;
  /** The exact text that may appear on the site. */
  text: string;
  status: ClaimStatus;
  /** Optional note for the sign-off document. */
  note?: string;
}

/* ---------------------------------------------------------------------------
 * Standards vocabulary (names only — no revision numbers).
 * ------------------------------------------------------------------------- */
export const standards = {
  nist: {
    name: 'NIST SP 800-88',
    /**
     * Deliberately EMPTY. When the owner signs off on a specific revision, add
     * the one-line sentence here (e.g. "Implements the Clear and Purge
     * techniques of NIST SP 800-88 Revision N.") and reference
     * `standards.nist.revisionLine` wherever a revision statement belongs.
     */
    revisionLine: '', // TODO(signoff): revision wording pending owner decision
    url: 'https://csrc.nist.gov/pubs/sp/800/88/', // landing page, revision-agnostic
  },
  cse: {
    name: 'CSE ITSP.40.006',
    longName:
      'Communications Security Establishment (CSE) — IT Media Sanitization',
    revisionLine: '', // TODO(signoff): version wording pending owner decision
    // TODO(verify): confirm current published version + canonical URL before
    // linking on the Standards page.
    url: '', // left blank until verified
  },
} as const;

/* ---------------------------------------------------------------------------
 * The Clear / Purge / Destroy taxonomy (unchanged across revisions).
 * ------------------------------------------------------------------------- */
export const taxonomy = {
  clear: {
    term: 'Clear',
    short:
      'Overwrites user-addressable storage so data cannot be recovered with standard tools.',
  },
  purge: {
    term: 'Purge',
    short:
      'Uses the drive’s own firmware sanitize commands to render data recovery infeasible even with laboratory techniques.',
  },
  destroy: {
    term: 'Destroy',
    short:
      'Physical destruction (shredding, disintegration). ProofWipe is the alternative to Destroy — it enables resale.',
  },
} as const;

/* ---------------------------------------------------------------------------
 * Compliance / capability claims. Each is individually sign-off tracked.
 * ------------------------------------------------------------------------- */
export const claims: Record<string, Claim> = {
  implementsTaxonomy: {
    id: 'implementsTaxonomy',
    text: 'ProofWipe implements the Clear and Purge sanitization categories defined by NIST SP 800-88.',
    status: 'approved',
    note: 'APPROVED by owner 2026-07-03 as written.',
  },
  notCertified: {
    id: 'notCertified',
    text: 'ProofWipe implements published sanitization standards. It is not a third-party-certified product.',
    status: 'approved',
    note: 'Disclaimer — safe to show. Keeps us honest about "implements, not certified".',
  },
  cseAligned: {
    id: 'cseAligned',
    text: 'Its methods align with the media-sanitization guidance in CSE ITSP.40.006, relevant to Canadian public-sector buyers.',
    status: 'needs-signoff',
    note: 'Verify current CSE ITSP.40.006 version and that "align with" is accurate & non-overclaiming.',
  },
  verification: {
    id: 'verification',
    text: 'Every wipe is verified by read-back sampling (1%, 10%, or 100%) and documented with a tamper-evident certificate secured by a SHA-256 log hash.',
    status: 'approved',
    note: 'APPROVED by owner 2026-07-03 (capability copy matches product).',
  },
  certEveryOutcome: {
    id: 'certEveryOutcome',
    text: 'A certificate is generated for every outcome — including cancelled or partial wipes.',
    status: 'approved',
    note: 'APPROVED by owner 2026-07-03 (capability copy matches product).',
  },
  failClosed: {
    id: 'failClosed',
    text: 'Fail-closed by design: ProofWipe refuses to touch the system or application disk. A drive is wipeable only when it is positively determined to be safe.',
    status: 'approved',
    note: 'APPROVED by owner 2026-07-03 (capability copy matches product).',
  },
  offline: {
    id: 'offline',
    text: 'Offline by design — no phone-home, no telemetry. Licensing uses offline keys.',
    status: 'approved',
    note: 'APPROVED by owner 2026-07-03 (capability copy matches product).',
  },
  resale: {
    id: 'resale',
    text: 'Sanitize and resell workstations instead of shredding them — recovering asset value and diverting e-waste.',
    status: 'approved',
    note: 'APPROVED by owner 2026-07-03 (ESG framing approved).',
  },
};

/* ---------------------------------------------------------------------------
 * Comparative claims (ProofWipe vs shredding / other tools). HIGH scrutiny.
 * ------------------------------------------------------------------------- */
export const comparisons: Record<string, Claim> = {
  vsShredding: {
    id: 'vsShredding',
    text: 'Shredding destroys resale value and creates e-waste. Verified sanitization preserves the hardware for resale while still documenting that data is gone.',
    status: 'needs-signoff',
    note: 'PENDING: owner wants it factual and non-disparaging; exact sentence to be confirmed in CLAIMS-FOR-SIGNOFF.md.',
  },
  functionalClass: {
    id: 'functionalClass',
    text: 'ProofWipe is the same functional class of tool as leading drive-erasure software, with a modern, trustworthy workflow.',
    status: 'needs-signoff',
    note: 'Deliberately does NOT name competitors on-site. Confirm whether to name any.',
  },
};

/**
 * Helper: returns the claim text, or throws in dev if an unsigned claim is used
 * where only approved copy is allowed. Pages decide whether to gate on status.
 */
export function claimText(c: Claim): string {
  return c.text;
}
