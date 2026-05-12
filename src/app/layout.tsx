import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
import { Roboto, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const montserratHeading = Montserrat({subsets:['latin'],variable:'--font-heading'});

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Technical CRM",
  description: "Gestionale locale per società, professionisti, certificazioni, servizi e gare"
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={cn("font-sans", roboto.variable, montserratHeading.variable)}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
