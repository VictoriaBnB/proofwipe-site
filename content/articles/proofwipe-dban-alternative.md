# The modern DBAN alternative for SSDs and NVMe drives

If you have used DBAN (Darik's Boot and Nuke) to wipe drives before disposal, you know the routine: put it on a USB stick or CD, boot the machine, and let it grind through the disk. It did the job for years on spinning hard drives. The trouble is that DBAN has not had a real update in about a decade, and almost every machine today runs an SSD or an NVMe drive, which DBAN was never built to handle properly. Here is what changed, and what to use instead.

## Why DBAN is not enough anymore

It does not properly sanitize SSDs. DBAN overwrites the drive from the outside, which worked on old spinning disks. Modern SSDs and NVMe drives use wear-leveling and keep spare, over-provisioned areas that an outside overwrite cannot reach, so data can survive a DBAN pass. DBAN's own project warns that it cannot guarantee secure erasure on solid-state drives. Overwriting a flash drive and calling it wiped is a false sense of security.

It does not verify anything. DBAN runs its passes and reports done. It never reads the drive back to confirm the data is actually gone, so you are trusting that it worked with no evidence either way.

It leaves you no record. When DBAN finishes, you have nothing to show for it. No certificate, no serial number, no proof to hand an auditor or keep on file. For a business disposing of client or employee data, "we ran DBAN" is not a defensible record.

It is unmaintained. The project effectively stopped years ago, and the official site now points serious users to a paid product. A free tool that no longer gets updates is a shaky thing to build your disposal process on.

## What to use instead

ProofWipe is built for the drives you actually have now, and for the record you actually need.

It handles SSDs and NVMe the right way. Alongside a standard overwrite (NIST 800-88 Clear), ProofWipe can trigger the drive's own firmware sanitize command (NIST 800-88 Purge), which erases the entire flash, including the spare areas an outside overwrite cannot reach. On a supported NVMe drive this often finishes in under two minutes, even on a nearly full drive.

It proves the drive is clean. ProofWipe reads the drive back after the wipe and confirms the data is gone, rather than assuming it worked.

It gives you a certificate for every drive. Each wipe produces a certificate listing the drive, its serial number, the method, the verification result, and the date, with a tamper-evident fingerprint. Anyone can check it at proofwipe.com/verify, right in their browser, nothing uploaded.

It boots from a USB stick, just like DBAN. Build the stick once, carry it machine to machine, and wipe each one's own internal drive, even machines with no working operating system. It also protects the drive it is running from, so you cannot wipe the wrong thing by accident.

And it is flat-priced. No per-drive fees. Wipe as many drives as you like.

## DBAN vs ProofWipe at a glance

| | DBAN | ProofWipe |
|---|---|---|
| Wipes spinning hard drives | Yes | Yes |
| Properly sanitizes SSD / NVMe | No | Yes, firmware Purge |
| Reads back to verify the wipe | No | Yes |
| Certificate of destruction | No | Yes, tamper-evident |
| Still maintained | No | Yes |
| Boots from a USB stick | Yes | Yes |
| Blocks wiping the wrong drive | No | Yes |
| Pricing | Free | Flat, no per-drive fees |

## Time to move off DBAN

DBAN was a great free tool for its era. But if you are wiping SSDs, need to prove the job was done, or are disposing of equipment for a business, it has aged out of the work. ProofWipe does what DBAN did, on the drives you have now, with the proof you need. Get it at proofwipe.com.
