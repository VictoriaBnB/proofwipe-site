/**
 * PRICING — the single site-side source of truth for money, trial, and refund.
 *
 * MIRRORS the app's ProofWipe.Core PricingConfig (they cannot share a compile
 * unit). Keep these in sync when either side changes:
 *   trialDays  ↔ PricingConfig.TrialDays  (currently 7)
 *   refundDays ↔ PricingConfig.RefundDays (currently 14)
 *
 * Payment Links are LIVE (Phase 7 E2E passed; webhook fulfilment verified
 * end-to-end in production, key pool seeded). Env vars still override at
 * build time if a link ever needs to be swapped without a code edit.
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
      // Stripe Payment Link (LIVE). Build-time override:
      //   PUBLIC_STRIPE_LINK_PRO=... npm run build
      paymentLink:
        import.meta.env.PUBLIC_STRIPE_LINK_PRO ??
        'https://buy.stripe.com/eVqcN5fLnd8ggODggAaEE04',
    },
    business: {
      name: 'Business',
      priceLabel: '$499',
      cadence: 'one-time',
      renewalLabel: '$199/yr optional renewal (new versions + support)',
      paymentLink:
        import.meta.env.PUBLIC_STRIPE_LINK_BUSINESS ??
        'https://buy.stripe.com/cNi7sLar33xGaqf9ScaEE05',
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
