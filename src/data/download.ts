/**
 * Download page data — SINGLE PLACE to update when a release ships.
 *
 * TODO(owner): every field below marked PLACEHOLDER must be replaced with real
 * values before launch. The page renders an explicit "placeholder" notice while
 * `isPlaceholder` is true — flip it to false once the real values are in.
 */

export const download = {
  /** Set to false once the real release URL + checksum are filled in. */
  isPlaceholder: true,

  /** PLACEHOLDER — real GitHub Releases page for the project. */
  releasesUrl: 'https://github.com/proofwipe/proofwipe/releases', // TODO(owner)

  /** PLACEHOLDER — direct link to the latest release asset. */
  latestAssetUrl:
    'https://github.com/proofwipe/proofwipe/releases/latest', // TODO(owner)

  /** PLACEHOLDER — displayed version string. */
  version: 'v1.1', // TODO(owner): confirm shipped version

  fileName: 'ProofWipe.exe',

  /** PLACEHOLDER — real SHA-256 of the shipped exe. NEVER publish a fake one. */
  sha256: '', // TODO(owner): paste real checksum; page shows "pending" while empty

  requirements: [
    'Windows 10 or Windows 11 (x64)',
    'Administrator rights (the app requests elevation on launch)',
    'No installation — a single portable .exe that runs from a USB stick',
    'No network connection required — offline by design',
  ],
} as const;
