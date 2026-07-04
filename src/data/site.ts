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
  contactEmail: 'hello@proofwipe.com', // TODO(signoff): confirm real address
  /** GitHub organisation / repo for the project. */
  github: 'https://github.com/proofwipe', // TODO(signoff): confirm URL
  description:
    'ProofWipe securely sanitizes disks so government and business workstations can be resold instead of shredded — with read-back verification and tamper-evident certificates for every wipe.',
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
