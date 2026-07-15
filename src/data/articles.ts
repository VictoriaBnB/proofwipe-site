/**
 * The article/guide registry: the single source of truth for the Resources
 * hub (/resources), the "Related" cross-links at the foot of each article, and
 * footer ordering. Keep titles short (nav/card friendly); summaries are one
 * line. Order is the display order on the hub.
 */
export interface Article {
  href: string;
  title: string;
  summary: string;
}

export const articles: Article[] = [
  {
    href: '/how-it-works',
    title: 'How ProofWipe wipes a drive, and proves it',
    summary:
      'The exact method: NIST 800-88 Clear or Purge, read-back verification, fail-closed honesty, and a tamper-evident certificate anyone can check. Nothing taken on faith.',
  },
  {
    href: '/guides/wipe-and-resell-workstations',
    title: 'How to wipe & resell workstations',
    summary:
      'The full step-by-step: build a bootable stick, wipe each machine to NIST 800-88, and keep a verified certificate for every PC. No IT team required.',
  },
  {
    href: '/drive-health-resale-grade',
    title: 'Drive health & resale grading',
    summary:
      'ProofWipe reads SMART/NVMe health data and grades each drive Healthy, Caution, or Failing before you wipe, with the grade recorded on the certificate for the buyer.',
  },
  {
    href: '/wipe-a-server',
    title: 'How to wipe a server (multi-drive / RAID)',
    summary:
      'Present each disk individually (break hardware RAID to HBA), then batch-wipe SATA / NVMe / SAS drives in Windows or boot the stick, each verified, with its own certificate.',
  },
  {
    href: '/wipe-laptop-soldered-storage',
    title: 'Wipe a laptop with soldered storage',
    summary:
      'Can’t remove the drive? Sanitize a soldered SSD in place with a firmware Purge (Surface and ultrabooks included) with no disassembly, and a certificate to prove it.',
  },
  {
    href: '/nist-800-88-clear-vs-purge',
    title: 'NIST 800-88 Clear vs Purge',
    summary:
      'The difference between the two levels in plain terms, and why any SSD or NVMe drive needs Purge, not just an overwrite.',
  },
  {
    href: '/dban-alternative',
    title: 'DBAN alternative for SSD / NVMe',
    summary:
      'Why DBAN’s overwrite can’t properly sanitize modern flash, leaves no proof, and is unmaintained, and what to use instead.',
  },
  {
    href: '/certificate-of-data-destruction',
    title: 'What a certificate of data destruction should show',
    summary:
      'Drive and serial, method, verification result, date, and a tamper-evident fingerprint. How to tell a real, verifiable certificate from a typed-in template.',
  },
  {
    href: '/pipeda-data-destruction',
    title: 'PIPEDA & BC privacy: wiping drives for compliance',
    summary:
      'How PIPEDA, BC FOIPPA, and privacy impact assessments treat drive disposal, and how a verified wipe with a certificate supports it. Background, not legal advice.',
  },
];

/**
 * Resolution pool for the Related component: the articles above plus a few
 * non-article destinations (e.g. the verifier) that make sense to cross-link.
 */
const extraLinks: Article[] = [
  {
    href: '/verify',
    title: 'Verify a certificate',
    summary:
      'Check any ProofWipe certificate against its wipe log, entirely in your browser, with nothing uploaded.',
  },
];

const byHref = new Map<string, Article>(
  [...articles, ...extraLinks].map((a) => [a.href, a]),
);

/** Resolve an ordered list of hrefs into Article records (skips unknowns). */
export function relatedFor(hrefs: string[]): Article[] {
  return hrefs.map((h) => byHref.get(h)).filter((a): a is Article => a !== undefined);
}
