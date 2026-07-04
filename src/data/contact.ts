/**
 * Contact form configuration — SINGLE PLACE to wire the form up.
 *
 * The form posts to Formspree (no backend needed; endpoint is whitelisted in
 * public/_headers CSP under form-action / connect-src). Submissions deliver to
 * the inbox configured in the Formspree dashboard (proofwipe@gmail.com).
 *
 * TODO(owner): create the form at https://formspree.io, paste its ID below
 * (the short code from the endpoint URL, e.g. "mqkrjzyv" from
 * https://formspree.io/f/mqkrjzyv). While `formspreeId` is empty the page
 * renders a safe "form not yet wired" state with disabled fields — it will
 * NEVER render a dead POST.
 */

export const contact = {
  /** PLACEHOLDER — Formspree form ID. Empty = form renders disabled. */
  formspreeId: '', // TODO(owner): paste real Formspree form ID

  /** Plain-email fallback, always shown next to the form. */
  email: 'proofwipe@gmail.com',

  /**
   * Honeypot field name. Formspree natively discards submissions where
   * `_gotcha` is filled in; the field is visually hidden from humans.
   */
  honeypotField: '_gotcha',
} as const;

export const formEndpoint = contact.formspreeId
  ? `https://formspree.io/f/${contact.formspreeId}`
  : '';

export const isFormConfigured = contact.formspreeId.length > 0;
