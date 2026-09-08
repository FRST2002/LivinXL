export const DEFAULT_ANNUAL_RATE = 7;
export const MAX_TERM_MONTHS = 180;
export const MIN_TERM_MONTHS = 12;

export interface AnnuityResult {
  principal: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  months: number;
  annualRatePercent: number;
}

/**
 * Annuity (annuïtair) calculation: equal monthly payments over the term,
 * consisting of a mix of interest and principal.
 */
export function calculateAnnuity(
  principal: number,
  annualRatePercent: number,
  months: number
): AnnuityResult {
  const safePrincipal = Math.max(0, principal);
  const safeMonths = Math.max(1, Math.round(months));
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyPayment: number;
  if (safePrincipal <= 0) {
    monthlyPayment = 0;
  } else if (monthlyRate === 0) {
    monthlyPayment = safePrincipal / safeMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, safeMonths);
    monthlyPayment = (safePrincipal * monthlyRate * factor) / (factor - 1);
  }

  const totalRepayment = monthlyPayment * safeMonths;
  const totalInterest = totalRepayment - safePrincipal;

  return {
    principal: safePrincipal,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    months: safeMonths,
    annualRatePercent,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

export function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Math.max(0, value));
}
