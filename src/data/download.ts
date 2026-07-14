/**
 * Download page data: SINGLE PLACE to update when a release ships.
 *
 * Live values below point at the public proofwipe-releases repo. When cutting a
 * new release, update `version` + `sha256` (the SHA-256 of the exact exe you
 * upload) here.
 */

export const download = {
  /** Real release values are wired in; the page shows the live link + checksum. */
  isPlaceholder: false,

  /** GitHub Releases page for the project. */
  releasesUrl: 'https://github.com/VictoriaBnB/proofwipe-releases/releases',

  /** Direct link to the latest release asset. */
  latestAssetUrl:
    'https://github.com/VictoriaBnB/proofwipe-releases/releases/latest/download/ProofWipe.exe',

  /** Displayed version string. */
  version: '1.4.1',

  fileName: 'ProofWipe.exe',

  /** SHA-256 of the shipped exe. NEVER publish a fake one. */
  sha256: '7a7b47ff34648af1b6575603c3991b38cf63ecd7c5ad28d446e3b62e6f5f0cd7',

  requirements: [
    'Windows 10 or Windows 11 (x64)',
    'Administrator rights (the app requests elevation on launch)',
    'No installation: a single portable .exe that runs from a USB stick',
    'No network connection required: offline by design',
  ],
} as const;
