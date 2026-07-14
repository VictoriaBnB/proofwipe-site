# NIST 800-88 Clear vs Purge: what's the difference, and which do you need?

If you have looked into wiping drives properly, you have run into NIST 800-88. It is the guideline most organizations point to for sanitizing storage before disposal or reuse, and it defines a few levels of wiping. The two you will actually choose between are Clear and Purge. Here is what each one means in plain terms, and how to pick.

## The three levels, briefly

NIST 800-88 describes three levels of sanitization: Clear, Purge, and Destroy. They step up in how thoroughly the data is removed.

Clear removes data using normal write commands, so it cannot be recovered with ordinary software tools. Purge goes further, using stronger methods that also reach areas normal writes cannot, so the data cannot be recovered even in a lab. Destroy is physical, shredding or degaussing the drive so it can never be used again.

## Clear: overwrite the drive

Clear works by overwriting the drive's storage, usually with zeros or a pattern, so the old data is written over. It is simple, it works on any drive, and once it is done the data is gone as far as any normal recovery tool is concerned.

Its limitation shows up on solid-state drives. SSDs and NVMe drives spread data around for wear-leveling and keep spare, over-provisioned areas that a normal overwrite does not touch, so on flash storage a Clear pass can leave data in places it could not reach. On old spinning hard drives, Clear is thorough. On SSDs, it is a reasonable baseline but not the strongest option.

## Purge: let the drive sanitize itself

Purge uses the drive's own built-in sanitize commands, ATA Secure Erase on SATA drives and NVMe Sanitize on NVMe drives, to erase the entire flash, including the spare and reallocated areas an overwrite cannot reach. Because the drive's controller does the work internally, it is both more complete and much faster than overwriting. On a supported NVMe drive a Purge often finishes in a couple of minutes.

For SSDs and NVMe, Purge is the right choice. It is the level that actually accounts for how flash storage works.

## Destroy: only when the drive is done

Destroy means physically shredding or degaussing the drive. It is the most final option, but it also ends the drive's life, so it kills any resale or reuse value, and it is overkill when a verified Purge has already made the data unrecoverable. Save it for drives that failed, cannot be sanitized, or that policy specifically requires be destroyed.

## So which do you use?

If you are reusing or reselling the drive or the machine, you want Clear or Purge, not Destroy. On a spinning hard drive, Clear is fine. On any SSD or NVMe drive, which is nearly everything now, use Purge. And whichever you use, verify it, read the drive back afterward to confirm the data is actually gone, and keep a record.

ProofWipe does both Clear and Purge, picks the right sanitize command for the drive, reads it back to verify, and produces a certificate that states which NIST 800-88 level was used and that it was verified. Get it at proofwipe.com.
