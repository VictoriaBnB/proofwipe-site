# ProofWipe — Marketing Website

Static marketing site for **ProofWipe** (proofwipe.com), built with
[Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com) and
deployed to **Cloudflare Pages**. Dark "enterprise security console" theme,
zero client JS by default, privacy-forward (cookieless analytics, no third-party
trackers).

> Positioning: **"Verified disk sanitization you can prove."**

---

## Prerequisites

- Node.js 18+ (developed on Node 24)
- npm 9+

## Local development

```bash
cd website
npm install
npm run dev        # http://localhost:4321
```

## Build & preview

```bash
npm run build      # outputs static site to ./dist
npm run preview    # serve the production build locally
```

`npm run check` runs Astro's type/diagnostics check.

---

## Project structure

```
website/
├─ public/                 Static assets served as-is
│  ├─ _headers             Cloudflare Pages security headers (CSP/HSTS/etc.)
│  ├─ _redirects           Same-origin path redirects (NOT the .ca->.com one)
│  ├─ robots.txt
│  ├─ logo.png             ProofWipe mark
│  └─ favicon.svg, site.webmanifest
├─ src/
│  ├─ components/          Nav, Footer (reused across pages)
│  ├─ data/
│  │  ├─ site.ts           Site config + navigation
│  │  └─ claims.ts         ⭐ SINGLE SOURCE OF TRUTH for standards/compliance
│  ├─ layouts/BaseLayout.astro   <head>, SEO, OG, JSON-LD, skip link
│  ├─ pages/               One file per route (index, 404, ...)
│  └─ styles/global.css    Tailwind import + design tokens (@theme)
├─ astro.config.mjs
└─ README.md
```

### Design tokens

The app palette lives in `src/styles/global.css` under `@theme` and generates
Tailwind utilities (`bg-bg`, `bg-panel`, `bg-card`, `text-text`, `text-muted`,
`text-accent`, `border-border`, `text-success/warning/danger`, …).

| Token   | Hex       | Token    | Hex       |
| ------- | --------- | -------- | --------- |
| bg      | `#14161A` | text     | `#E8EAED` |
| panel   | `#1B1E24` | muted    | `#98A1B0` |
| card    | `#22262E` | accent   | `#3E7BFA` |
| border  | `#2F3541` | success  | `#30A46C` |

---

## Standards & compliance copy — read before editing

All standards strings and compliance/comparative claims live in **one file**:
`src/data/claims.ts`. Page copy must reference that file — never hardcode a
claim inline.

Rules enforced there:

- Reference **"NIST SP 800-88" generically** — **no revision number anywhere**,
  and never imply "latest"/"current". A one-line `revisionLine` placeholder is
  ready for when the owner signs off on specific wording.
- **"CSE ITSP.40.006"** by name only until its current version is verified and
  signed off.
- **Never say "certified."** ProofWipe *implements* the standards.
- Claims marked `status: 'needs-signoff'` must **not** ship in production copy.
  Track approvals in [`CLAIMS-FOR-SIGNOFF.md`](./CLAIMS-FOR-SIGNOFF.md).

---

## Deploy — Cloudflare Pages

DNS for both domains is already at Cloudflare, so hosting + DNS + redirects +
analytics all live in one place.

### 1. Create the Pages project

- Connect the GitHub repo.
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `website`
- Framework preset: Astro (or "None").

### 2. Custom domains

Add **both** custom domains to the same Pages project:

- `proofwipe.com` (and `www.proofwipe.com`)
- `proofwipe.ca` (and `www.proofwipe.ca`)

### 3. Wiring the two domains (canonical .com + .ca 301)

`proofwipe.com` is canonical. `proofwipe.ca` must **301-redirect** to it. A
Pages `_redirects` file can't do a cross-domain redirect, so use a Cloudflare
**Redirect Rule** (Rules → Redirect Rules) on the `proofwipe.ca` zone:

- **When:** `http.host in {"proofwipe.ca" "www.proofwipe.ca"}`
- **Then:** Static/Dynamic redirect →
  `concat("https://proofwipe.com", http.request.uri.path)`
- **Status:** 301 (Permanent), **Preserve query string:** on.

Also add `www.proofwipe.com` → `proofwipe.com` if you want a single canonical
host.

### 4. Security headers

`public/_headers` is applied automatically by Pages (HSTS, CSP, etc.). If you
add a provider (analytics, forms), update the CSP allowlist there.

### 5. Analytics

Cloudflare **Web Analytics** (cookieless, no consent banner needed). Enable it
in the Cloudflare dashboard for `proofwipe.com`; the beacon domain
(`static.cloudflareinsights.com`) is already allowed in the CSP. Cloudflare can
auto-inject the beacon, or add the snippet in the polish step.

---

## Placeholders awaiting owner input

- Real **SHA-256 checksum** + **GitHub Releases** download URL (Download page).
- **Pricing:** Pro is "Contact us" for v1 — no numbers.
- **Standards revision wording** (kept generic until sign-off).
- **CSE ITSP.40.006** current version + canonical URL (verify before linking).
- Contact address / GitHub org URL in `src/data/site.ts`.
- Redacted sample **certificate** (a clearly-labelled "illustrative" mock is
  used until provided).
