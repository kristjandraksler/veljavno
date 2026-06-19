import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registracija — Veljavno",
  description: "Ustvarite brezplačen račun in nastavite opomnike za vaše dokumente. Enkratno plačilo od 4,99 €.",
};

export default function RegistracijaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}