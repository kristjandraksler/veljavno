import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import CookieBanner from "@/components/cookie-banner";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veljavno — Sistem za pravočasne opomnike",
  description: "Vozniško, osebna, potni list — dodajte datume poteka in prejmite e-mail opomnik preden je prepozno. Enkratno plačilo od 4,99 €.",
  keywords: ["opomnik dokumenti", "vozniško dovoljenje poteka", "osebna izkaznica podaljšanje", "potni list", "Slovenija"],
  openGraph: {
    title: "Veljavno — Sistem za pravočasne opomnike",
    description: "Nikoli več potekle vozniške ali osebne izkaznice. Pravočasen e-mail opomnik za vse vaše dokumente.",
    url: "https://veljavno.si",
    siteName: "Veljavno",
    locale: "sl_SI",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl" suppressHydrationWarning className={`${geist.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N4TRKZKDCR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N4TRKZKDCR');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}