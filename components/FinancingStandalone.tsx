"use client";

import { useState } from "react";
import FinancingCalculator from "@/components/FinancingCalculator";
import { PRICE_MAX, PRICE_MIN } from "@/lib/pricing";

export default function FinancingStandalone() {
  const [amount, setAmount] = useState(9000);

  return (
    <FinancingCalculator
      amount={amount}
      onAmountChange={setAmount}
      minAmount={PRICE_MIN}
      maxAmount={PRICE_MAX}
    />
  );
}
