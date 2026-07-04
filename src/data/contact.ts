/**
 * Contact form configuration: SINGLE PLACE to wire the form up.
 *
 * The form posts to Formspree (no backend needed; endpoint is whitelisted in
 * public/_headers CSP under form-action / connect-src). Submissions deliver to
 * the inbox configured in the Formspree dashboard (proofwipe@gmail.com).
 *
 * LIVE (2026-07-03): form mvzjdwlp created by owner; endpoint
 * https://formspree.io/f/mvzjdwlp. If the ID is ever cleared, the page falls
 * back to a safe "form not yet wired" state with disabled fields. It will
 * NEVER render a dead POST.
 */

export const contact = {
  /** Formspree form ID (empty = form renders disabled). */
  formspreeId: 'mvzjdwlp', // live 2026-07-03, endpoint https://formspree.io/f/mvzjdwlp

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
