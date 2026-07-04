# Claims for sign-off

Every compliance, standards, and comparative claim on the ProofWipe site is
listed here for line-by-line approval. Source of truth: `src/data/claims.ts`.

## Status: ✅ SIGN-OFF COMPLETE (2026-07-03)

All claims are approved. The automated guard sweep (`npm run guards`, runs on
every build) enforces that any future `needs-signoff` claim cannot ship, and
its sanctioned-exception list is empty.

Standing guardrails (permanent, decision-final):

- **NIST SP 800-88 stays fully generic** — no revision number anywhere, no
  "latest/current" implication, `revisionLine` empty, NIST deliberately
  **unlinked** (every working deep link is revision-specific).
- **CSE ITSP.40.006 name-only** — no version printed; the verified
  cyber.gc.ca link is used with name-only anchor text.
- **Never the word "certified"** outside the approved not-certified disclaimer.
- **Competitors are never named** — comparisons are vs physical shredding and
  typical unverified wiping only.

---

## A. Standards vocabulary

| ID | String | Status |
| -- | ------ | ------ |
| `standards.nist.name` | "NIST SP 800-88" (generic, no revision) | ✅ approved |
| `standards.nist.revisionLine` | empty — **owner decision 2026-07-03: stays fully generic, no revision line** | ✅ decision final |
| `standards.nist.url` | blank — **owner decision 2026-07-03: no NIST link** (all deep links are revision-specific; verified 2026-07-03: Rev. 2 final Sept 2025, Rev. 1 withdrawn/superseded) | ✅ decision final |
| `standards.cse.name` | "CSE ITSP.40.006" name-only, **no version printed** (verified 2026-07-03: current publication is v2, effective 2017-07-01) | ✅ decision final |
| `standards.cse.url` | `https://www.cyber.gc.ca/en/guidance/it-media-sanitization-itsp40006` — verified live, linked with name-only anchor text | ✅ approved |

## B. Capability / compliance claims

| ID | Claim | Status |
| -- | ----- | ------ |
| `notCertified` | "ProofWipe implements published sanitization standards. It is not a third-party-certified product." | ✅ approved |
| `implementsTaxonomy` | "ProofWipe implements the Clear and Purge sanitization categories defined by NIST SP 800-88." | ✅ approved 2026-07-03 |
| `verification` | "Every wipe is verified by read-back sampling (1%, 10%, or 100%)… SHA-256 log hash." | ✅ approved 2026-07-03 |
| `certEveryOutcome` | "A certificate is generated for every outcome — including cancelled or partial wipes." | ✅ approved 2026-07-03 |
| `failClosed` | "Fail-closed by design: ProofWipe refuses to touch the system or application disk…" | ✅ approved 2026-07-03 |
| `offline` | "Offline by design — no phone-home, no telemetry. Licensing uses offline keys." | ✅ approved 2026-07-03 |
| `resale` | "Sanitize and resell workstations instead of shredding them… diverting e-waste." | ✅ approved 2026-07-03 |
| `cseAligned` | "Its methods align with the media-sanitization guidance in CSE ITSP.40.006, relevant to Canadian public-sector buyers." | ✅ **approved 2026-07-03** (currently unused in page copy — available) |

## C. Comparative claims

| ID | Claim | Status |
| -- | ----- | ------ |
| `vsShredding` | "Shredding destroys resale value and creates e-waste. Verified sanitization preserves the hardware for resale while still documenting that data is gone." | ✅ **approved 2026-07-03** as written (rendered on Home) |
| `functionalClass` | "ProofWipe is the same functional class of tool as leading drive-erasure software…" | ✅ **approved 2026-07-03** (competitors stay generic, never named; currently unused in page copy — available) |

---

## No open decisions

Future claim changes: add to `src/data/claims.ts` with `status:
'needs-signoff'`, record here, and get owner approval before flipping. The
build fails automatically if an unsigned claim reaches the rendered HTML.
