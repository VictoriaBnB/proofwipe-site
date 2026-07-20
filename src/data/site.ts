/**
 * Site-wide configuration and navigation.
 * Product/marketing constants live here; standards & compliance claims live in
 * ./claims.ts (single source of truth for anything needing sign-off).
 */

export const site = {
  name: 'ProofWipe',
  /** One-line positioning statement. */
  tagline: 'Verified disk sanitization you can prove.',
  /** Canonical origin (no trailing slash). */
  url: 'https://proofwipe.com',
  /** Secondary domain that 301-redirects to the canonical one. */
  altDomain: 'proofwipe.ca',
  /** Contact + sales inbox. Update before launch. */
  contactEmail: 'proofwipe@gmail.com', // confirmed by owner 2026-07-03
  /** GitHub organisation / repo for the project. */
  github: 'https://github.com/proofwipe', // TODO(signoff): confirm URL
  description:
    'ProofWipe securely sanitizes disks so government and business workstations can be resold instead of shredded, with read-back verification and tamper-evident certificates for every wipe.',
} as const;

/** Primary navigation (header). */
export const primaryNav = [
  { label: 'Features', href: '/features' },
  { label: 'Bootable USB', href: '/bootable-usb' },
  { label: 'Standards', href: '/standards' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Verify', href: '/verify' },
  { label: 'Download', href: '/download' },
] as const;

/** Footer link groups. */
export const footerNav = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Bootable USB edition', href: '/bootable-usb' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Download', href: '/download' },
    ],
  },
  {
    heading: 'Compliance',
    links: [
      { label: 'Standards & compliance', href: '/standards' },
      { label: 'Verify a certificate', href: '/verify' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'How ProofWipe works', href: '/how-it-works' },
      { label: 'How to wipe & resell workstations', href: '/guides/wipe-and-resell-workstations' },
      { label: 'Drive health & resale grading', href: '/drive-health-resale-grade' },
      { label: 'How to wipe a server (multi-drive / RAID)', href: '/wipe-a-server' },
      { label: 'Wipe a laptop with soldered storage', href: '/wipe-laptop-soldered-storage' },
      { label: 'NIST 800-88 Clear vs Purge', href: '/nist-800-88-clear-vs-purge' },
      { label: 'DBAN alternative for SSD / NVMe', href: '/dban-alternative' },
      { label: 'Certificate of data destruction', href: '/certificate-of-data-destruction' },
      { label: 'Certificate database', href: '/certificate-database' },
      { label: 'PIPEDA & BC privacy compliance', href: '/pipeda-data-destruction' },
      { label: 'All resources', href: '/resources' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/about#contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
] as const;
