/**
 * Analytics configuration: Cloudflare Web Analytics (cookieless, no
 * cross-site tracking; fits the no-trackers privacy posture).
 *
 * TWO WAYS TO ENABLE (owner picks one, do NOT do both, or page views are
 * double-counted):
 *
 *  A) Dashboard auto-injection: enable Web Analytics for proofwipe.com in the
 *     Cloudflare dashboard and let Cloudflare inject the beacon at the edge.
 *     In that case LEAVE `token` EMPTY here.
 *
 *  B) Manual snippet: create a Web Analytics site in the dashboard, copy its
 *     token, and paste it below. BaseLayout renders the beacon only when the
 *     token is non-empty: analytics is safely OFF until then.
 *
 * Either way, the beacon host (static.cloudflareinsights.com) is already
 * allowed in the CSP (public/_headers, script-src + connect-src).
 */

export const analytics = {
  /** PLACEHOLDER: Cloudflare Web Analytics site token. Empty = beacon off. */
  token: '', // TODO(owner): paste token for option B, or leave empty for option A
} as const;

export const isAnalyticsEnabled = analytics.token.length > 0;
