"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CalendarDays, Gauge, Handshake, Landmark, LogOut, MapPinned } from "lucide-react";
import { cn } from "@/lib/format";

const navItems = [
  { href: "/", label: "Cruscotto", icon: Gauge },
  { href: "/operators", label: "Operatori Economici", icon: Landmark },
  { href: "/tenders", label: "Gare", icon: Handshake },
  { href: "/works", label: "Categorie / ID Opera", icon: MapPinned },
  { href: "/calendar", label: "Calendario", icon: CalendarDays }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-panel lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white">
            <Image src="/ac-studio-logo.png" alt="AC Studio" width={28} height={28} className="h-7 w-7 object-contain" priority />
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-ink">AC STUDIO</div>
            <div className="text-xs text-muted">My Tender CRM</div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-app hover:text-ink")}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <form action="/auth/signout" method="post" className="lg:pt-3">
            <button className="flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-app hover:text-ink" type="submit">
              <LogOut className="h-4 w-4" />
              Esci
            </button>
          </form>
        </nav>
      </aside>
      <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
