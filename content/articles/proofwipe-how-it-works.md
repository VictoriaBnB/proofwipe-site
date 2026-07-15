# How ProofWipe wipes a drive, and how it proves it

It is fair to be skeptical of any tool that says "trust me, the data is gone." A wipe you cannot check is just a hope. So here is exactly what ProofWipe does when it sanitizes a drive, and exactly how the certificate lets anyone confirm it, with nothing taken on faith.

## Two methods, both from NIST 800-88

ProofWipe follows NIST 800-88, the guideline most organizations point to for sanitizing storage. It gives you the two methods that guideline defines for reuse and resale.

Clear overwrites the whole drive using normal write commands, so the old data is written over and cannot be recovered with ordinary software. On a traditional spinning hard drive, where every part of the disk is directly writable, that is thorough and complete. Solid-state drives are built differently. They constantly move data around for wear-leveling and hold spare, over-provisioned areas that normal write commands never reach, so an overwrite by itself can leave copies behind in those hidden areas. That is not a weakness in the overwrite, it is simply how flash hardware works, and it is exactly why ProofWipe reaches for the second method on those drives instead of trusting an overwrite alone. You do not have to know any of this in the moment, because ProofWipe detects the drive and applies the right method for you.

Purge uses the drive's own built-in sanitize command, ATA Secure Erase on SATA drives and NVMe Sanitize on NVMe drives, to erase the entire flash, including the spare and over-provisioned areas that an outside overwrite cannot reach. The drive's controller does the work internally, so it is both more complete and much faster. On a supported NVMe drive it often finishes in a couple of minutes. For any SSD or NVMe drive, this is the method that actually accounts for how flash storage works, and ProofWipe picks the right command for the drive automatically.

## It reads the drive back to verify

This is the part most tools skip. After the wipe, ProofWipe reads the drive back and checks that it is actually clean, rather than reporting success the moment the command returns. If the read-back does not come out the way a sanitized drive should, it does not claim the wipe worked. Verification is the difference between "we sent the erase command" and "we confirmed the data is gone."

## It fails honestly

ProofWipe is built to never report success it cannot back up. If a drive is disconnected partway through, if a command is refused, or if verification does not pass, it stops and records the wipe as failed rather than clean. A cancelled run is marked as partial, not complete. The whole design is fail-closed: when anything is uncertain, the result is the cautious one, so a certificate that says verified really means verified.

## It protects the drive it runs from

Whether you run the desktop app or boot a machine from the USB stick, ProofWipe will not let you wipe the drive it is currently running from. You cannot erase the wrong thing by accident, and to start any wipe you arm it in two steps, confirming the exact drive by its own identifier. That double check is deliberate. Wiping is irreversible, so the tool makes you point at the right target twice before it will touch it.

## How the certificate proves the job

Every sanitized drive gets its own certificate. It lists the drive, its serial number, the method used, the read-back verification result, and the date and time. Alongside it, ProofWipe writes a matching log of what happened.

The certificate carries a tamper-evident fingerprint. It is a SHA-256 hash computed over the canonical log of the wipe, so the certificate and the log are cryptographically tied together. If anyone changed a single character of either one afterward, the fingerprint would no longer match, and the check would fail. That is what makes it evidence rather than a printout.

Anyone can verify a certificate at proofwipe.com/verify. It recomputes the fingerprint right in the browser and confirms it matches the record. Nothing gets uploaded, the whole check happens on their side, so a buyer, an auditor, or a client can confirm a certificate is genuine without sending anything to us or to you.

## What this adds up to

The point of all of it is that you do not have to take the result on trust. The method suits the drive, the wipe is verified by reading it back, the tool refuses to overstate what it did, and the certificate can be independently checked by anyone who holds it. That is what a defensible wipe looks like: not just done, but provably done. See it for yourself at proofwipe.com.
