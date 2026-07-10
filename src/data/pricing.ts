/**
 * PRICING — the single site-side source of truth for money, trial, and refund.
 *
 * MIRRORS the app's ProofWipe.Core PricingConfig (they cannot share a compile
 * unit). Keep these in sync when either side changes:
 *   trialDays  ↔ PricingConfig.TrialDays  (currently 7)
 *   refundDays ↔ PricingConfig.RefundDays (currently 14)
 *
 * Payment Links are TEST MODE for now. Do NOT swap in live links until the
 * Phase 7 Stripe test-mode E2E passes and the license-key pool is seeded
 * (payments/E2E-CHECKLIST.md). Prefer env vars at build time so the live
 * switch is a deploy-config change, not a code edit.
 */

export const pricing = {
  trialDays: 7, // ↔ PricingConfig.TrialDays
  refundDays: 14, // ↔ PricingConfig.RefundDays

  currency: 'USD',

  tiers: {
    pro: {
      name: 'Pro',
      priceLabel: '$99',
      cadence: 'one-time',
      renewalLabel: '$39/yr optional renewal (new versions + support)',
      // Stripe Payment Link (TEST MODE). Build-time override:
      //   PUBLIC_STRIPE_LINK_PRO=... npm run build
      paymentLink:
        import.meta.env.PUBLIC_STRIPE_LINK_PRO ??
        'https://buy.stripe.com/test_PLACEHOLDER_PRO',
    },
    business: {
      name: 'Business',
      priceLabel: '$499',
      cadence: 'one-time',
      renewalLabel: '$199/yr optional renewal (new versions + support)',
      paymentLink:
        import.meta.env.PUBLIC_STRIPE_LINK_BUSINESS ??
        'https://buy.stripe.com/test_PLACEHOLDER_BUSINESS',
    },
  },

  /** True while any link is still a test/placeholder — the page shows a non-live note. */
  get isTestMode(): boolean {
    return (
      this.tiers.pro.paymentLink.includes('test_') ||
      this.tiers.business.paymentLink.includes('test_')
    );
  },
} as const;
