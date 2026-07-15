#!/usr/bin/env python3
"""
Generate per-page Open Graph images (1200x630) as branded HTML, one per page.
Emits HTML into scripts/og/out/, which build-og.sh screenshots to public/og/.
On-brand: ProofWipe logo + wordmark, site palette + sans font, an accent
eyebrow, the page title, and a small relevant motif. No em dashes in copy.
"""
import io, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)
LOGO = "file:///C:/Users/RWERK/Downloads/proofwipe-site/public/logo.png"

# motif: 'cert' (default) or 'drive' (Clear vs Purge)
PAGES = [
    ("home", "Verified disk sanitization", "Verified disk sanitization you can prove", "cert"),
    ("how-it-works", "How it works", "How ProofWipe wipes a drive, and proves it", "cert"),
    ("certificate-of-data-destruction", "Guide", "What a certificate of data destruction should show", "cert"),
    ("pipeda-data-destruction", "Compliance", "Wiping drives to meet PIPEDA and BC privacy rules", "cert"),
    ("nist-800-88-clear-vs-purge", "Standards explained", "NIST 800-88 Clear vs Purge", "drive"),
    ("wipe-laptop-soldered-storage", "Guide", "How to wipe a laptop with soldered storage", "cert"),
    ("wipe-a-server", "Guide", "How to wipe a server with multiple drives", "cert"),
    ("dban-alternative", "Switching tools", "The modern DBAN alternative for SSDs and NVMe", "cert"),
    ("wipe-and-resell-workstations", "Guide", "How to securely wipe and resell your old workstations", "cert"),
    ("drive-health-resale-grade", "Guide", "Check a drive's health and grade it for resale", "drive"),
]

CERT_MOTIF = """
<svg width="210" height="176" viewBox="0 0 210 176" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="14" width="130" height="150" rx="12" fill="#F4F6F9" stroke="#5A6472" stroke-width="2"/>
  <rect x="60" y="40" width="90" height="9" rx="4" fill="#3E7BFA"/>
  <rect x="60" y="62" width="90" height="7" rx="3" fill="#C3CBD6"/>
  <rect x="60" y="80" width="90" height="7" rx="3" fill="#C3CBD6"/>
  <rect x="60" y="98" width="62" height="7" rx="3" fill="#C3CBD6"/>
  <circle cx="150" cy="132" r="28" fill="#158048"/>
  <path d="M137 132 l9 9 l17 -20" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""

DRIVE_MOTIF = """
<svg width="252" height="150" viewBox="0 0 252 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="20" width="150" height="110" rx="12" fill="#fff" stroke="#E4E8EE" stroke-width="2"/>
  <rect x="18" y="40" width="90" height="70" rx="8" fill="#EAF1FF" stroke="#3E7BFA" stroke-width="2"/>
  <rect x="116" y="40" width="26" height="70" rx="6" fill="#FDECEA" stroke="#CD3A3F" stroke-width="2"/>
  <rect x="176" y="46" width="72" height="58" rx="10" fill="#EAF1FF" stroke="#3E7BFA" stroke-width="2"/>
  <circle cx="212" cy="75" r="17" fill="#3E7BFA"/>
  <path d="M204 75 l5 5 l10 -12" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""

TEMPLATE = """<!doctype html><html><head><meta charset="utf-8"><style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html, body {{ width:1200px; height:630px; }}
  body {{ font-family:'Segoe UI', system-ui, -apple-system, Roboto, sans-serif; background:#ffffff; position:relative; overflow:hidden; }}
  .glow {{ position:absolute; top:-280px; right:-180px; width:760px; height:760px; border-radius:50%;
           background:radial-gradient(closest-side, rgba(62,123,250,.16), transparent 70%); }}
  .bar {{ position:absolute; left:0; top:0; bottom:0; width:14px; background:#3E7BFA; }}
  .wrap {{ position:absolute; inset:0; padding:74px 84px 66px; display:flex; flex-direction:column; }}
  .brand {{ display:flex; align-items:center; gap:16px; }}
  .brand img {{ width:52px; height:52px; border-radius:12px; }}
  .brand .name {{ font-size:34px; font-weight:700; color:#141922; letter-spacing:-0.5px; }}
  .eyebrow {{ margin-top:52px; font-size:23px; font-weight:600; color:#3E7BFA; }}
  .title {{ margin-top:16px; font-size:54px; line-height:1.1; font-weight:800; color:#141922; max-width:860px; letter-spacing:-1px; }}
  .foot {{ margin-top:auto; display:flex; align-items:flex-end; justify-content:space-between; }}
  .url {{ font-size:25px; font-weight:600; color:#5A6472; }}
  .motif {{ margin-bottom:-6px; }}
</style></head><body>
  <div class="glow"></div>
  <div class="bar"></div>
  <div class="wrap">
    <div class="brand"><img src="{logo}" alt=""><span class="name">ProofWipe</span></div>
    <div class="eyebrow">{eyebrow}</div>
    <div class="title">{title}</div>
    <div class="foot">
      <div class="url">proofwipe.com</div>
      <div class="motif">{motif}</div>
    </div>
  </div>
</body></html>"""

for slug, eyebrow, title, motif in PAGES:
    m = DRIVE_MOTIF if motif == "drive" else CERT_MOTIF
    doc = TEMPLATE.format(logo=LOGO, eyebrow=html.escape(eyebrow), title=html.escape(title), motif=m)
    io.open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8", newline="\n").write(doc)
    print("wrote", slug + ".html")
print("done:", len(PAGES), "pages")
