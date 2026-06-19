import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijava — Veljavno",
  description: "Prijavite se v vaš Veljavno račun in upravljajte opomnike za vaše dokumente.",
};

export default function PrijavaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}