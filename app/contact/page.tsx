import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { IconCompass, IconWrench } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met LivinXL voor vragen over aluminium veranda's, financiering of dealerschap.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Neem contact met ons op"
        description="Heeft u een vraag over de LivinXL Vista, financiering of dealerschap? Vul het formulier in en we reageren zo snel mogelijk."
      />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ContactForm />

        <div className="flex flex-col gap-6">
          <div className="card flex gap-4 p-6">
            <IconCompass className="h-8 w-8 shrink-0 text-copper" />
            <div>
              <h3 className="text-base font-bold text-anthracite-700">Adviesgesprek plannen</h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite-500">
                Liever direct in gesprek? Geef dit aan in het bericht, dan plannen we een
                adviesgesprek in op een moment dat u past.
              </p>
            </div>
          </div>
          <div className="card flex gap-4 p-6">
            <IconWrench className="h-8 w-8 shrink-0 text-copper" />
            <div>
              <h3 className="text-base font-bold text-anthracite-700">Service & garantie</h3>
              <p className="mt-2 text-sm leading-relaxed text-anthracite-500">
                Heeft u een vraag over een reeds geplaatste veranda? Vermeld dit bij het onderwerp,
                dan komt uw bericht direct bij de juiste collega terecht.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
