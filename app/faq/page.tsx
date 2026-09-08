import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import FaqAccordion from "@/components/FaqAccordion";
import { IconArrowRight } from "@/components/icons";
import { FAQ_ITEMS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Veelgestelde vragen over de LivinXL Vista veranda, financiering, montage en dealerschap.",
};

export default function FaqPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="FAQ"
        title="Veelgestelde vragen"
        description="Staat uw vraag er niet bij? Neem gerust contact met ons op."
      />

      <div className="mt-10 max-w-3xl">
        <FaqAccordion items={FAQ_ITEMS} />
      </div>

      <div className="mt-10 flex max-w-3xl flex-col items-start gap-4 rounded-2xl bg-anthracite-700 p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-offwhite-200">Nog vragen die hier niet worden beantwoord?</p>
        <Link href="/contact" className="btn-primary">
          Neem contact op
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
