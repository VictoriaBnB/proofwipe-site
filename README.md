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

## Deploy — Cloudflare Worker (static assets)

The site is deployed as a **Cloudflare Worker with static assets** (the
Workers-based successor to Pages), connected to this GitHub repo. The build is
fully prerendered (`output: 'static'`, no SSR adapter) — the Worker serves
files from `dist/` only. Any SESSION/IMAGES bindings shown on the Worker are
Cloudflare runtime defaults and are unused by this build.

DNS for both domains is already at Cloudflare, so hosting + DNS + redirects +
analytics all live in one place.

### 1. The Worker (already connected)

- **Connected repo:** this repository, builds on push to `main`.
- **Build command:** `npm run build`
- **Build output directory:** `dist`

### 2. Custom domain

Attach the canonical host under the Worker's **Settings → Domains & Routes**:

- Add `proofwipe.com` as a **Custom Domain** (Cloudflare creates/validates the
  DNS record automatically since the zone is on the same account).
- Add `www.proofwipe.com` too if you want it served directly, or redirect it
  (step 3) for a single canonical host.

### 3. Wiring the two domains (canonical .com + .ca 301)

`proofwipe.com` is canonical. `proofwipe.ca` must **301-redirect** to it. The
`_redirects` file can't do a cross-domain redirect, so use a Cloudflare
**Redirect Rule** (Rules → Redirect Rules) on the `proofwipe.ca` zone:

- **When:** `http.host in {"proofwipe.ca" "www.proofwipe.ca"}`
- **Then:** Static/Dynamic redirect →
  `concat("https://proofwipe.com", http.request.uri.path)`
- **Status:** 301 (Permanent), **Preserve query string:** on.

Optionally add the same pattern on the `.com` zone for
`www.proofwipe.com` → `proofwipe.com`.

### 4. Security headers

`public/_headers` (HSTS, CSP, etc.) is honoured by Cloudflare's static-asset
serving exactly as it was on Pages. If you add a provider (analytics, forms),
update the CSP allowlist there.

### 5. Analytics

Cloudflare **Web Analytics** (cookieless, no consent banner needed). Two ways
to enable — **pick exactly one** (both at once double-counts page views):

- **Option A — dashboard auto-injection:** enable Web Analytics for
  `proofwipe.com` in the Cloudflare dashboard and let it inject the beacon at
  the edge. Leave `token` empty in `src/data/analytics.ts`.
- **Option B — manual snippet:** create a Web Analytics site in the dashboard
  and paste its token into `src/data/analytics.ts`. The beacon renders only
  when the token is non-empty — analytics is safely off until then.

Either way the beacon host (`static.cloudflareinsights.com`) is already
allowed in the CSP (`public/_headers`, script-src + connect-src).

---

## Search (Pagefind)

Site search is [Pagefind](https://pagefind.app) — a static index built from the
rendered HTML at build time. No backend, no external calls (fits the
offline/privacy posture). It's the only JavaScript on the site.

- `postbuild` runs `pagefind --site dist`, which indexes every `data-pagefind-body`
  region (the page `<main>`; the 404 page is excluded via `data-pagefind-ignore`)
  and writes `dist/pagefind/`.
- The nav search box is a `[data-pagefind-search]` container; the widget is
  initialised by `public/js/search-init.js` (a static self-hosted file, so no
  inline script is needed under the strict CSP).
- CSP note: Pagefind uses WebAssembly, so `script-src` includes
  `'wasm-unsafe-eval'`. Everything is served from `'self'` — no external origin.

## Build guards

`npm run build` automatically runs `scripts/check-guards.mjs` (also available
as `npm run guards`), which **fails the build** if the generated HTML contains:

1. Forbidden strings — "VerifWipe" or competitor names (never named, by owner
   decision).
2. NIST revision leakage — any "Rev. 1/2" / "Revision 1/2" / "800-88r1/r2", or
   "latest / most current" near standards wording.
3. "certified" outside the approved not-certified disclaimer.
4. Any `needs-signoff` claim from `src/data/claims.ts` (except explicitly
   owner-sanctioned pending entries, documented in the script).

## Assets

Generated from the source logo (checkerboard background removed, real alpha
restored) by the Step 7 pipeline: `public/logo.png` (256px, ~17 KB),
`icon-192/512.png` (web manifest), `apple-touch-icon.png` (180px, opaque
panel background), `favicon.ico` (16/32/48) + `favicon.svg`, and
`public/og/proofwipe-og.png` (1200x630 social share card).

## Placeholders awaiting owner input

- Real **SHA-256 checksum** + **GitHub Releases** download URL (Download page).
- **Pricing:** Pro is "Contact us" for v1 — no numbers.
- **Standards revision wording** (kept generic until sign-off).
- **CSE ITSP.40.006** current version + canonical URL (verify before linking).
- ~~Formspree form ID~~ — **live** (`mvzjdwlp`, delivers to
  proofwipe@gmail.com).
- ~~Analytics choice~~ — **option A chosen**: token stays empty; owner enables
  Cloudflare Web Analytics from the dashboard once the domain is live.
- GitHub org URL in `src/data/site.ts`.
- Legal stubs: retention/rights wording in `/privacy`, bracketed sections in
  `/terms`; both are `noindex` until finalized.
- Redacted sample **certificate** (a clearly-labelled "illustrative" mock is
  used until provided).
