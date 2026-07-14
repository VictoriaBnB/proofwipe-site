# How to securely wipe a laptop with soldered storage

More and more laptops ship with the storage soldered directly to the motherboard. Many ultrabooks, most Microsoft Surface devices, and a growing number of business laptops no longer have a drive you can unscrew and pull out. That breaks the old way of disposing of machines securely, so here is how to handle it.

## Why soldered storage is a problem for disposal

For years the secure-disposal routine was simple: remove the drive and shred it. When the storage is soldered on, you cannot remove it without destroying the whole machine. So you are left with two bad options. Physically destroy a perfectly good laptop just to kill the data, throwing away its resale and reuse value. Or hand it on and hope the "delete and reformat" you did is enough, which it is not, because deleted and reformatted data is easy to recover.

Neither is acceptable if the machine held business, client, or personal data.

## The answer: wipe the storage in place

You do not need to remove soldered storage to securely erase it. You sanitize it right where it sits, using the drive's own firmware, and you get a record proving it was done.

The approach is the same one you would use to wipe any machine's own drive. Build a bootable USB stick with a wiping tool. Boot the laptop from the stick instead of its operating system. Run a firmware sanitize, NIST 800-88 Purge, which tells the soldered SSD's own controller to erase its entire flash. Verify it by reading the drive back. Save the certificate.

No disassembly, no shredding, no destroyed hardware. The data is gone, the laptop still works and still has resale value, and you have proof.

## Why firmware Purge is the right method here

Soldered storage is almost always flash, an SSD or an NVMe module. Overwriting flash from the outside can leave data behind in the spare areas that wear-leveling uses. A firmware Purge, using the drive's built-in NVMe Sanitize or Secure Erase command, erases the whole thing, including those areas, and it does it in minutes. It is both the most thorough and the fastest option for exactly the kind of storage that gets soldered on.

## Do it with ProofWipe

ProofWipe boots from a USB stick, runs a verified NIST 800-88 Purge on the machine's own soldered drive, and writes a tamper-evident certificate you can keep or hand off. It protects the drive it is running from, so you cannot wipe the wrong thing, and there are no per-drive fees. Get it at proofwipe.com, and see the full walkthrough in our guide to wiping and reselling workstations.
