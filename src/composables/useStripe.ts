import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Lazy loads Stripe.js using the publishable key from Vite env.
 * Set VITE_STRIPE_PK in your environment (e.g., .env) with your Stripe publishable key.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const pk = import.meta.env?.VITE_STRIPE_PK as string | undefined;
    if (!pk) {
      throw new Error('Stripe publishable key is not configured (VITE_STRIPE_PK)');
    }
    // Disable Stripe advanced fraud signals to avoid r.stripe.com beacon calls being blocked by ad blockers
    // which may surface as unhandled promise rejections in console (net::ERR_BLOCKED_BY_CLIENT).
    loadStripe.setLoadParameters({advancedFraudSignals: false});
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}
