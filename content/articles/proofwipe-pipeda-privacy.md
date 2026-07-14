# Wiping drives to meet PIPEDA and BC privacy rules

If your organization handles personal information in Canada, getting rid of old drives is not just an IT chore. Privacy law expects you to protect that information for its whole life, and that includes the day the hardware leaves your hands. This is a plain-language look at what the rules actually ask for when you dispose of storage, and how a verified wipe with a certificate helps you meet it. It is background information, not legal advice, so check anything specific against your own obligations.

## The rule most people miss: disposal is a privacy step

It is easy to think of privacy law as being about collecting and using data. It also covers getting rid of it. Under PIPEDA, the federal private-sector privacy law, an organization can only keep personal information as long as it needs it, and when it is no longer needed it has to be destroyed, erased, or made anonymous (Principle 4.5, Limiting Retention). The same law says personal information must be protected by safeguards appropriate to how sensitive it is, and it names disposal as one of the moments where a safeguard is required, so information is not exposed when you throw hardware away (Principle 4.7, Safeguards).

Put those two together and the message is simple. When a drive holds personal information you no longer need, you are expected to actually remove that information, not just stop using the machine. A laptop sitting in a closet, or sold with a quick reformat, still has the data on it, and that is the gap the rules are pointing at.

## In BC, the public sector has its own version

If you work for a BC public body, a ministry, a health authority, a school district, a local government, your rules come from FOIPPA, the Freedom of Information and Protection of Privacy Act, not PIPEDA. It lands in the same place. Section 30 says a public body must protect personal information in its custody or control by making reasonable security arrangements against risks like unauthorized access, collection, use, disclosure, or disposal. Section 31 governs how long personal information has to be kept before it can go. Reasonable security arrangements against unauthorized disposal is exactly the box a proper wipe checks: the data is gone in a controlled way, and you can show it.

BC private-sector organizations fall under PIPA BC rather than PIPEDA, but the disposal expectation is the same shape: protect personal information with reasonable security, including when you dispose of it.

## Where PIAs and STRAs come in

Anyone who has worked in BC government knows the PIA and the STRA. A Privacy Impact Assessment looks at how a system or process handles personal information and whether it meets FOIPPA, and the disposal and retention of that information is part of what a PIA covers. A Security Threat and Risk Assessment looks at the security risks around a system and how they are controlled. End-of-life for the hardware, how drives get sanitized when a device is retired, is a real line item in both.

This is where a lot of processes are thin. It is one thing to write "drives are securely wiped at end of life" in a PIA. It is another to be able to show, per drive, that it happened, what method was used, and that someone verified it. A wipe that produces a certificate turns that sentence into evidence. When a reviewer asks how retired laptops are handled, you have a record for each one instead of a promise.

## What "securely wiped" actually needs to mean

The rules ask for the data to be genuinely unrecoverable, not just hidden. Two things matter for that.

First, the method has to suit the drive. Almost every machine now runs a solid-state or NVMe drive, and those keep spare, over-provisioned areas that a plain overwrite cannot reach. NIST 800-88, the recognized guideline for sanitizing media, separates a Clear (overwrite) from a Purge (the drive's own firmware sanitize command). On flash storage, Purge is the method that actually reaches everything. Using the right one is what makes "wiped" true rather than approximate.

Second, you need proof. "We deleted everything" is not a record. A defensible disposal step leaves you something in writing that names the drive and its serial number, states the method, confirms the wipe was verified by reading the drive back, and is dated. That is the artifact a PIA reviewer, an auditor, or a client can actually rely on.

## How ProofWipe fits

ProofWipe is built to be that disposal step. It runs a NIST 800-88 Clear or Purge, picks the right sanitize command for the drive, reads the drive back to confirm the data is gone, and writes a tamper-evident certificate for each drive. The certificate lists the drive, its serial number, the method, the verification result, and the date, and it carries a fingerprint so it cannot be quietly altered. Anyone can check one at proofwipe.com/verify, in their browser, with nothing uploaded.

For a retention and disposal policy, that gives you the two pieces the rules are really asking for: the data is actually removed in a way that fits modern drives, and you have a per-drive record that it was done. It slots straight into the disposal section of a PIA or an STRA, and into the "reasonable security arrangements" language in FOIPPA s.30 or the safeguards and retention principles in PIPEDA.

None of this is legal advice, and no tool makes you compliant on its own. Compliance is about your whole process, your policies, your retention schedule, your records, and where sanitizing drives fits into it. What ProofWipe does is make the disposal step something you can stand behind and show, instead of something you hope was good enough. Get it at proofwipe.com, and see the full walkthrough in our guide to wiping and reselling workstations.
