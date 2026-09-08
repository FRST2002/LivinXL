"use client";

import { useState } from "react";
import { IconPlus } from "@/components/icons";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-anthracite-700/8 rounded-2xl border border-anthracite-700/8 bg-white shadow-card">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-semibold text-anthracite-700 sm:text-base">{item.question}</span>
              <IconPlus
                className={`h-5 w-5 shrink-0 text-copper transition-transform duration-200 ${
                  open ? "rotate-45" : ""
                }`}
              />
            </button>
            {open && (
              <div className="px-6 pb-6">
                <p className="text-sm leading-relaxed text-anthracite-500">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
