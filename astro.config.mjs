// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical site URL. proofwipe.ca 301-redirects to this at the Cloudflare
// edge (see README + public/_redirects notes).
const SITE = 'https://proofwipe.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Fully prerendered static site: no SSR adapter. Deployed to Cloudflare as
  // a Worker serving static assets only (see README); any SESSION/IMAGES
  // bindings on the Worker are Cloudflare runtime defaults, unused by this build.
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit /features.html rather than /features/index.html so URLs stay clean
    // and Cloudflare's static-asset serving resolves them without trailing slashes.
    format: 'file',
  },
  integrations: [
    sitemap({
      // Legal/utility pages that don't need to rank.
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
