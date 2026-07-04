# Claims for sign-off

Every compliance, standards, and comparative claim on the ProofWipe site is
listed here for line-by-line approval. Source of truth: `src/data/claims.ts`.

**Nothing marked `needs-signoff` is rendered in production copy until approved.**
When you approve an item, we flip its `status` to `approved` in `claims.ts`.

Guardrails already baked in:

- No revision number for **NIST SP 800-88** anywhere; no "latest/current".
- **CSE ITSP.40.006** by name only until version verified + signed off.
- Never the word **"certified."**

---

## A. Standards vocabulary

| ID | String | Status |
| -- | ------ | ------ |
| `standards.nist.name` | "NIST SP 800-88" (generic, no revision) | ✅ approved by rule |
| `standards.nist.revisionLine` | _(empty placeholder — add revision sentence on sign-off)_ | ⏳ pending your wording |
| `standards.cse.name` | "CSE ITSP.40.006" (name only) | ⏳ verify version, no label yet |
| `standards.cse.url` | _(blank — verify canonical URL before linking)_ | ⏳ to verify |

## B. Capability / compliance claims

| ID | Claim | Status |
| -- | ----- | ------ |
| `notCertified` | "ProofWipe implements published sanitization standards. It is not a third-party-certified product." | ✅ approved (disclaimer) |
| `implementsTaxonomy` | "ProofWipe implements the Clear and Purge sanitization categories defined by NIST SP 800-88." | ✅ **approved 2026-07-03** as written |
| `verification` | "Every wipe is verified by read-back sampling (1%, 10%, or 100%)… SHA-256 log hash." | ✅ **approved 2026-07-03** (capability copy) |
| `certEveryOutcome` | "A certificate is generated for every outcome — including cancelled or partial wipes." | ✅ **approved 2026-07-03** (capability copy) |
| `failClosed` | "Fail-closed by design: ProofWipe refuses to touch the system or application disk…" | ✅ **approved 2026-07-03** (capability copy) |
| `offline` | "Offline by design — no phone-home, no telemetry. Licensing uses offline keys." | ✅ **approved 2026-07-03** (capability copy) |
| `resale` | "Sanitize and resell workstations instead of shredding them… diverting e-waste." | ✅ **approved 2026-07-03** (ESG framing approved) |
| `cseAligned` | "Its methods align with the media-sanitization guidance in CSE ITSP.40.006…" | ⏳ needs sign-off + version/URL verification |

## C. Comparative claims (highest scrutiny)

| ID | Claim | Status |
| -- | ----- | ------ |
| `vsShredding` | "Shredding destroys resale value and creates e-waste. Verified sanitization preserves the hardware for resale while still documenting that data is gone." | ⏳ **pending exact-sentence confirmation.** Owner direction (2026-07-03): keep factual and non-disparaging. Current sentence remains on Home; confirm or amend it here. |
| `functionalClass` | "ProofWipe is the same functional class of tool as leading drive-erasure software…" | ⏳ needs sign-off. Owner decision (2026-07-03): competitors stay **generic** — never name specific products; comparisons are vs physical shredding and typical unverified wiping only. |

---

## Open decisions for you

1. **NIST revision wording** — supply the exact sentence (or confirm we keep it
   fully generic with no revision line).
2. **CSE ITSP.40.006** — confirm the current version you want referenced and the
   canonical URL to link (we'll verify independently too).
3. **`vsShredding` exact sentence** — confirm or amend the sentence quoted above
   (direction received: factual, non-disparaging).
4. ~~Competitor naming~~ — **decided 2026-07-03: generic only, never named.**
5. ~~ESG/sustainability angle~~ — **approved 2026-07-03.**
