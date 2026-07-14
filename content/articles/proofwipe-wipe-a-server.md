# How to securely wipe a server with multiple drives

Wiping a server is not quite the same as wiping a laptop. Servers hold several drives, often behind a RAID controller, and sometimes a mix of SATA, NVMe, and SAS. ProofWipe handles multi-drive servers, and the trick is presenting the drives the right way so each one is sanitized properly and gets its own certificate. Here is how.

## First, understand how the drives are attached

How your server's drives are connected decides your approach.

Direct-attached SATA or NVMe drives are the straightforward case. ProofWipe can overwrite each one (NIST 800-88 Clear) or trigger the drive's firmware sanitize (NIST 800-88 Purge), and verify the result.

Drives behind a hardware RAID controller show up as a single logical volume, not as individual disks. To sanitize the actual drives, and to get a certificate for each one, you need the controller to present each disk on its own. More on that next.

SAS drives can be securely overwritten and verified. Firmware Purge is a SATA and NVMe feature, so SAS drives get a verified overwrite rather than a firmware sanitize.

## Break the RAID first

This is the step people miss. If your drives are in a hardware RAID array, ProofWipe, like any drive-level tool, only sees the array as one logical disk. Overwriting that logical volume wipes the addressable data, but it cannot reach each member drive's spare areas, and you end up with a single certificate for the array instead of one per drive.

So before you wipe, put the controller into HBA, JBOD, or pass-through mode, or pull the drives and attach them directly. Now each physical disk appears on its own, with its real type, and ProofWipe can sanitize and certify each one individually. This is standard practice for proper drive sanitization, not a ProofWipe quirk.

One specific case: servers running Intel VMD or RST RAID mode on NVMe block the low-level commands a firmware Purge needs. Switch the BIOS to AHCI or direct NVMe mode and Purge becomes available. Otherwise ProofWipe falls back to a verified overwrite.

## Two ways to wipe the drives

Once the drives are presented individually, you have two workflows.

Batch wipe in Windows, fastest for many drives. Attach the drives to a Windows machine running ProofWipe, directly or through an HBA, and the desktop app wipes them in parallel, each in its own isolated session with its own certificate. One drive failing or being unplugged never affects the others. The machine's own system drive is protected and cannot be batch-wiped this way, which is exactly what the bootable stick is for.

Wipe from the bootable stick, for the server's own drives in place. Boot the server from a ProofWipe USB stick and wipe its drives one at a time. This is how you sanitize a server's own boot drive, and any drive the machine will not release while running. A firmware Purge per drive is only minutes, so even a full bay of drives goes quickly, just sequentially rather than in parallel.

A common pattern is to pull the data drives and batch-wipe them in the desktop app, then boot the server from the stick to handle its own boot drive. Or for a hands-off single pass, boot from the stick and work through every bay in order.

## What you get

Every drive that is sanitized gets its own certificate: the drive, its serial number, the method, the verification result, and the date, with a tamper-evident fingerprint. For a server decommission that is a clean, per-drive paper trail you can file or hand to whoever takes the hardware.

## A few server realities worth knowing

Present drives individually. Hardware RAID has to be broken to HBA or pass-through mode for per-drive sanitization and certificates.

SATA and NVMe drives support firmware Purge, with an automatic fall-back to a verified overwrite where a controller does not allow it. SAS drives get a verified overwrite.

Switch Intel VMD or RST NVMe mode to AHCI or direct NVMe in the BIOS if you want firmware Purge on those drives.

ProofWipe runs on Windows and on its bootable WinPE stick. It does not run under Linux or ESXi, so use the stick rather than the server's own operating system.

Wiping a server right is mostly about presenting the drives so each one can be sanitized and certified on its own. Do that, and ProofWipe handles the rest. See the full step-by-step in our guide to wiping and reselling workstations, or get ProofWipe at proofwipe.com.
