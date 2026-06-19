import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate program — Veljavno",
  description: "Priporočite Veljavno in zaslužite 30% provizije za vsako uspešno prodajo. Brez omejitev.",
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}