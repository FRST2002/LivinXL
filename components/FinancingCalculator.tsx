"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_ANNUAL_RATE,
  MAX_TERM_MONTHS,
  MIN_TERM_MONTHS,
  calculateAnnuity,
  formatCurrency,
  formatCurrencyPrecise,
} from "@/lib/finance";

export interface FinancingCalculatorChange {
  principal: number;
  downPayment: number;
  termMonths: number;
  monthlyPayment: number;
}

type Props = {
  amount: number;
  onAmountChange?: (value: number) => void;
  minAmount?: number;
  maxAmount?: number;
  amountLabel?: string;
  className?: string;
  /** Force a single-column layout, for use in a narrow sidebar. */
  compact?: boolean;
  /** Show the total interest cost line. Off by default in the configurator, where only the monthly payment matters. */
  showInterest?: boolean;
  /** Reports the current selection (term, down payment, resulting monthly payment) whenever it changes. */
  onChange?: (change: FinancingCalculatorChange) => void;
};

function formatTerm(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${months} maanden`;
  if (rest === 0) return `${years} jaar (${months} mnd)`;
  return `${years} jr ${rest} mnd (${months} mnd)`;
}

export default function FinancingCalculator({
  amount,
  onAmountChange,
  minAmount = 0,
  maxAmount = amount,
  amountLabel = "Verandaprijs",
  className,
  compact = false,
  showInterest = true,
  onChange,
}: Props) {
  const [downPayment, setDownPayment] = useState(0);
  const [termMonths, setTermMonths] = useState(120);

  const clampedDownPayment = Math.min(downPayment, amount);
  const principal = Math.max(0, amount - clampedDownPayment);

  const result = useMemo(
    () => calculateAnnuity(principal, DEFAULT_ANNUAL_RATE, termMonths),
    [principal, termMonths]
  );

  useEffect(() => {
    onChange?.({
      principal,
      downPayment: clampedDownPayment,
      termMonths,
      monthlyPayment: result.monthlyPayment,
    });
    // onChange is intentionally excluded: parents pass a new function each render,
    // and we only want to report when the actual calculation changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal, clampedDownPayment, termMonths, result.monthlyPayment]);

  return (
    <div className={`card p-6 sm:p-8 ${className ?? ""}`}>
      <div className={`grid grid-cols-1 gap-8 ${compact ? "" : "lg:grid-cols-2"}`}>
        <div className="flex flex-col gap-7">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="fc-amount" className="field-label mb-0">
                {amountLabel}
              </label>
              <span className="text-lg font-bold text-anthracite-700">{formatCurrency(amount)}</span>
            </div>
            {onAmountChange ? (
              <>
                <input
                  id="fc-amount"
                  type="range"
                  min={minAmount}
                  max={maxAmount}
                  step={50}
                  value={amount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-anthracite-700/10 accent-copper"
                />
                <div className="mt-1 flex justify-between text-xs text-anthracite-400">
                  <span>{formatCurrency(minAmount)}</span>
                  <span>{formatCurrency(maxAmount)}</span>
                </div>
              </>
            ) : (
              <p className="mt-2 text-xs text-anthracite-400">
                Bepaald op basis van uw configuratie hierboven.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="fc-down" className="field-label mb-0">
                Aanbetaling
              </label>
              <span className="text-lg font-bold text-anthracite-700">
                {formatCurrency(clampedDownPayment)}
              </span>
            </div>
            <input
              id="fc-down"
              type="range"
              min={0}
              max={amount}
              step={50}
              value={clampedDownPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-anthracite-700/10 accent-copper"
            />
            <div className="mt-1 flex justify-between text-xs text-anthracite-400">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(amount)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="fc-term" className="field-label mb-0">
                Looptijd
              </label>
              <span className="text-lg font-bold text-anthracite-700">{formatTerm(termMonths)}</span>
            </div>
            <input
              id="fc-term"
              type="range"
              min={MIN_TERM_MONTHS}
              max={MAX_TERM_MONTHS}
              step={6}
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-anthracite-700/10 accent-copper"
            />
            <div className="mt-1 flex justify-between text-xs text-anthracite-400">
              <span>{MIN_TERM_MONTHS} maanden</span>
              <span>{MAX_TERM_MONTHS} maanden</span>
            </div>
          </div>

          <p className="text-xs text-anthracite-400">
            Indicatieve jaarrente: <span className="font-semibold text-anthracite-600">{DEFAULT_ANNUAL_RATE}%</span> (annuïtair)
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-anthracite-700 p-6 text-offwhite-200 sm:p-7">
          <div>
            <h3 className="eyebrow text-copper-300">Indicatieve berekening</h3>
            <dl className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <dt className="text-sm text-offwhite-300/80">Financieringsbedrag</dt>
                <dd className="text-sm font-semibold text-white">{formatCurrency(principal)}</dd>
              </div>
              <div
                className={`flex items-center justify-between ${
                  showInterest ? "border-b border-white/10 pb-3" : ""
                }`}
              >
                <dt className="text-sm text-offwhite-300/80">Maandbedrag</dt>
                <dd className="text-xl font-bold text-copper-200">
                  {formatCurrencyPrecise(result.monthlyPayment)}
                  <span className="ml-1 text-xs font-medium text-offwhite-400/70">/ mnd</span>
                </dd>
              </div>
              {showInterest && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-offwhite-300/80">Rentekosten</dt>
                  <dd className="text-sm font-semibold text-white">{formatCurrency(result.totalInterest)}</dd>
                </div>
              )}
            </dl>
          </div>

          <p className="mt-6 rounded-lg bg-white/5 px-3 py-2 text-xs leading-relaxed text-offwhite-200/90">
            U zit niet vast aan één maandbedrag: u kunt altijd kosteloos en renteloos extra aflossen.
            Zet het maandbedrag laag en los af wanneer het u uitkomt.
          </p>

          <p className="mt-4 text-xs leading-relaxed text-offwhite-400/70">
            Dit is een indicatieve berekening. De daadwerkelijke rente, voorwaarden en acceptatie
            hangen af van de persoonlijke en financiële situatie. Aan deze berekening kunnen geen
            rechten worden ontleend. Dit is geen definitief kredietaanbod.
          </p>
        </div>
      </div>
    </div>
  );
}
