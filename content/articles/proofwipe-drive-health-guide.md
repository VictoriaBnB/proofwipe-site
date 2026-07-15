# Check a drive's health and grade it for resale, before you wipe

If you resell or refurbish used machines, two questions matter before a drive goes back out the door: is the data gone, and is the drive any good? ProofWipe now answers both in one pass. Every time it lists a drive it also reads that drive's built-in health data and gives it a simple resale grade, so you know what you are selling before you wipe it, and the buyer sees the same information on the certificate. Here is how it works and how to use it.

## What the health check does

Modern drives keep track of their own condition. SATA and SAS drives expose SMART data (things like reallocated sectors and whether the drive itself predicts failure), and NVMe drives expose a health log (wear level, spare capacity, media errors). ProofWipe reads that information the moment it lists your drives, turns it into a plain grade, and shows it to you before you do anything.

It is entirely read-only. The health check only reads the drive's own reported data, it never writes to the drive, and it runs even on drives that are protected and cannot be wiped, so you can check the health of any drive you plug in, including your own system disk.

## What the grades mean

ProofWipe sorts each drive into one of four grades:

Healthy means the drive's own indicators look good. No reallocated or pending sectors on a spinning drive, low wear and full spare on an SSD, and the drive is not predicting its own failure. This is a drive you can resell with confidence.

Caution means something is worth knowing about but the drive is not failing. A few reallocated sectors, an SSD that has used most of its rated write life, or spare capacity getting low. A Caution drive can still be perfectly usable, but you would want to disclose it or price it accordingly.

Failing means the drive is telling you it is in trouble: its own SMART status predicts failure, it has a meaningful number of bad sectors, or an NVMe drive is reporting critical warnings or many media errors. A Failing drive is a candidate for physical destruction rather than resale.

Health unavailable means ProofWipe could not read the drive's health data, usually because the drive does not expose it or is behind an adapter that blocks it (common with some USB-to-SATA bridges). ProofWipe never guesses a grade. If it cannot read the data, it says so plainly rather than showing you a green light it cannot back up.

One thing worth understanding: wear is not the same as failure. An SSD that has used up its rated write endurance is flagged as a strong Caution labeled as wear, not as Failing, because such a drive often keeps working fine. ProofWipe keeps those two stories separate so the grade means what it says.

## Where you see it

The grade shows up in two places. On screen, each drive gets a colored health badge when you select it, and the drive details panel lists the key underlying values (things like power-on hours, percentage of write life used, spare capacity, and any bad-sector counts), so you can look past the grade to the numbers if you want. You see all of this before you arm a wipe, so a Caution or Failing grade is a heads-up while you can still act on it.

Then, once you wipe the drive, the grade and the key health values are recorded on the certificate, in their own read-only pre-wipe section. That means the certificate you hand a buyer shows both that the data was verifiably destroyed and what condition the drive was in, in one tamper-evident document. The health data is part of what the certificate's fingerprint covers, so it cannot be quietly changed later.

## Using it in a resale workflow

The natural way to use this is to triage as you go. Plug in or boot the machine, look at the grade, and sort: Healthy drives go to resale, Caution drives get disclosed or priced down, Failing drives get pulled for destruction instead of sale. Then wipe the ones you are keeping, and the certificate carries the grade forward automatically. You end up with a clean record for each drive that says both "this is wiped" and "this is the shape it was in," which is exactly what a buyer or a refurbisher wants to see.

The health grade is available on the Pro and Business tiers. Get ProofWipe at proofwipe.com, and see the full resale walkthrough in our guide to wiping and reselling workstations.
