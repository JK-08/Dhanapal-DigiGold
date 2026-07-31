// src/screens/mpin/mpinHelpers.ts
// Shared helpers for the Forgot-MPIN screen flow (Send OTP → Verify OTP → New MPIN).

/** Mask a mobile number as "98XXXX4321" — first 2 & last 4 digits visible. */
export function maskMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= 6) return digits;
  const head = digits.slice(0, 2);
  const tail = digits.slice(-4);
  return `${head}${'X'.repeat(digits.length - 6)}${tail}`;
}
