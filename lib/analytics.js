/**
 * Safe, privacy-preserving client analytics helper for PiBi Open Intelligence
 * Integrates directly with the configured Google Analytics (@next/third-parties/google).
 *
 * STRICT PRIVACY RULE: Never track student emails, phone numbers, or confidential data.
 */

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  // Sanitize to prevent accidental PII leakage
  const safeParams = { ...params };
  delete safeParams.email;
  delete safeParams.phone;
  delete safeParams.dob;
  delete safeParams.password;
  delete safeParams.raw_data;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, safeParams);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...safeParams });
    }
  } catch (err) {
    console.debug('[Analytics] Event error:', err);
  }
}
