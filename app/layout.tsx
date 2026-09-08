import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LivinXL — Aluminium veranda's op maat",
    template: "%s | LivinXL",
  },
  description:
    "LivinXL levert en monteert aluminium veranda's op maat. Ontdek de LivinXL Vista, configureer uw veranda en vraag vrijblijvend een offerte aan. Meer ruimte. Zelfde adres.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={manrope.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
