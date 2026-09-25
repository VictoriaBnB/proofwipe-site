/**
 * The ProofWipe how-to video (YouTube, privacy-enhanced embed, click-to-load).
 * GENERATED from proofwipe-video-tools/tutorial (narration + real timings) by
 * site-data.mjs: chapters and transcript match the published video exactly.
 */
export const video = {
  id: 'lZ50vLbBH7Q',
  title: 'How to securely wipe a drive, and prove it',
  description:
    'A step-by-step walkthrough: the ProofWipe desktop app, a NIST 800-88 wipe with 100% read-back verification, building a bootable USB, the BIOS boot menu and Secure Boot, a firmware Purge of an internal NVMe SSD, and checking the certificate at proofwipe.com/verify.',
  uploadDate: '2026-09-25',
  durationSec: 387,
  poster: '/video/proofwipe-how-to-poster.jpg',
  posterWebp: '/video/proofwipe-how-to-poster.webp',
  posterSmall: '/video/proofwipe-how-to-poster-640.webp',
  pagePath: '/video/how-to-wipe-a-drive',
  chapters: [
  {
    t: 0,
    title: "Why deleting isn’t enough",
    text: "This is ProofWipe. In the next few minutes, you’ll learn how to securely wipe a computer’s drives, so the machine can be resold or reused, and walk away with a certificate that proves it. Deleting files, or even reformatting a drive, doesn’t actually remove the data. Free recovery tools can bring it right back. ProofWipe implements the NIST 800-88 Clear and Purge methods, aligned with Canada’s CSE guidance. Then it checks the result, and certifies it."
  },
  {
    t: 34,
    title: "The ProofWipe app",
    text: "Start by running ProofWipe. It’s a single portable file, so you can run it straight from a USB stick, with nothing to install. Windows asks for administrator permission. ProofWipe needs that to talk to your drives directly. Every drive in the machine is listed, with its model, its capacity, and its real serial number. Notice the drive Windows is running from is marked protected. ProofWipe will never let you wipe it from inside Windows. Protection is fail-closed. If ProofWipe can’t be certain a drive is safe to wipe, it stays protected. You can also run a read-only audit on any drive, even a protected one. It reads the drive and reports what it finds, without writing a single byte."
  },
  {
    t: 85,
    title: "Wipe a spare or external drive",
    text: "Second drives, external drives, and USB sticks can be wiped right here in Windows. Step one: select the drive. Step two: choose a wipe method. NIST Clear overwrites the whole drive, and works on anything. Firmware purge needs a direct connection to the drive, so it’s greyed out for USB sticks. Hover over any option for plain-English guidance on when to use it. Step three: verification. Choose 100%. After wiping, ProofWipe reads back every single byte, to prove the data is really gone. Step four: type your name. It’s printed on the certificate. Step five: arm the drive, by typing its identifier. That proves you’re looking at the exact drive you mean to erase. Click start batch. A final review lists exactly what will be destroyed, and only then do you confirm. Now you get live progress, speed, and time remaining. When the wipe finishes, the read-back verification runs on its own. Verified. A PDF and HTML certificate are saved automatically."
  },
  {
    t: 163,
    title: "Make the bootable USB",
    text: "But what about the laptop’s own drive, the one Windows runs from? For that, you boot the machine from a ProofWipe USB stick. Click Create bootable USB. The first time, ProofWipe installs Microsoft’s free boot tools for you. There’s no command line involved. Pick a spare USB stick, 2 GB or larger. Your system disk will never appear in this list. Everything on the stick will be erased, so make sure it’s a spare. Then click Erase and build. Your license is copied onto the stick automatically. And one stick can wipe every machine in the rack."
  },
  {
    t: 210,
    title: "Boot the machine from the stick",
    text: "Now take the stick to the machine you’re wiping. Plug it in, power it on, and start tapping the boot menu key. On Dell and Lenovo, that’s F12. On HP, it’s F9. On ASUS and Acer, try F12, or escape. In the boot menu, pick the entry for your USB stick, and press enter. The machine starts ProofWipe, instead of Windows. Nothing on the internal drive is running now, so it can finally be wiped."
  },
  {
    t: 240,
    title: "Surface & Secure Boot",
    text: "On a Microsoft Surface, hold volume down, press and release power, and keep holding volume down until the logo appears. If a machine refuses to start from the stick, open its UEFI settings, and turn Secure Boot off for the wipe. Just remember to turn it back on when you’re done."
  },
  {
    t: 263,
    title: "Wipe the internal drive",
    text: "Accept the terms, then check the drive list. The USB stick you booted from is always protected. The internal drive now shows as wipeable. Take a second to check its model and serial number against the machine in front of you. For solid-state drives, choose firmware Purge. The drive erases itself, including hidden spare areas that an overwrite can’t reach. Choose 100% verification, for a full read-back. Arm it, by typing the last four characters of the drive’s serial number. If the serial can’t be used, ProofWipe shows you its device ID instead. Final confirmation. Type ERASE. A firmware purge can’t be cancelled once the drive starts erasing. On a 256 GB NVMe drive, a purge takes about two minutes. Final readable state: confirmed zeros. Every region ProofWipe read back is empty. If a drive refuses the purge command, nothing is written, and you’re offered NIST Clear instead. A failure is never reported as a success."
  },
  {
    t: 330,
    title: "Your certificate",
    text: "The certificate and its log are written to the USB stick, so the proof leaves the machine with you. It records the drive, its serial number, the method, the verification result, the operator, and the date and time. A SHA-256 fingerprint ties the certificate to its log. If anyone changes either one, it no longer matches. Keep a copy in your records for every machine. It’s your proof, for clients and for auditors."
  },
  {
    t: 359,
    title: "Verify a certificate online",
    text: "Anyone can check a certificate at proofwipe.com/verify. Drop in the certificate and its log. The check runs right in your browser, and nothing is uploaded. A match means the certificate is exactly as ProofWipe wrote it. That’s it. Wipe it, verify it, and prove it. Get ProofWipe at proofwipe.com."
  }
],
} as const;

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
export const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${s % 60}S`;
