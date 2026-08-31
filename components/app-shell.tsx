"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { L, useLang } from "@/lib/i18n";
import { LangToggle } from "./lang-toggle";
import { Disclaimer } from "./ui";

const NAV: { href: string; fr: string; en: string; icon: string }[] = [
  { href: "/today", fr: "Aujourd'hui", en: "Today", icon: "◉" },
  { href: "/coach", fr: "Coach", en: "Coach", icon: "✎" },
  { href: "/skills", fr: "Compétences", en: "Skills", icon: "▤" },
  { href: "/writing", fr: "Écriture", en: "Writing", icon: "¶" },
  { href: "/speaking", fr: "Oral", en: "Speaking", icon: "◍" },
  { href: "/review", fr: "Révision", en: "Review", icon: "⟳" },
  { href: "/mocks", fr: "Examens blancs", en: "Mock exams", icon: "▦" },
  { href: "/progress", fr: "Progrès", en: "Progress", icon: "∿" },
  { href: "/settings", fr: "Réglages", en: "Settings", icon: "⚙" },
];

const MOBILE_NAV = NAV.filter((n) => ["/today", "/coach", "/skills", "/review", "/progress"].includes(n.href));

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useApp((s) => s.profile);
  const onboarded = useApp((s) => s.onboarded);
  const reconcileStreak = useApp((s) => s.reconcileStreak);
  const lang = useLang();
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!profile) router.replace("/signin");
    else if (!onboarded) router.replace("/onboarding");
    else reconcileStreak();
  }, [hydrated, profile, onboarded, router, reconcileStreak]);

  if (!hydrated || !profile || !onboarded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-3">
        <div className="text-center">
          <div className="font-display text-xl font-semibold text-accent">Lumen Français</div>
          <div className="mt-2 text-sm">Chargement… / Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-line bg-white px-4 py-6 md:flex">
        <div className="flex items-center justify-between px-2">
          <Link href="/today" className="font-display text-lg font-semibold tracking-tight text-accent">
            Lumen Français
          </Link>
        </div>
        <div className="mt-3 px-2">
          <LangToggle />
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/today" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-paper-2 hover:text-ink"
                }`}
              >
                <span aria-hidden className="w-4 text-center">{n.icon}</span>
                {L(lang, n.fr, n.en)}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 pt-4 text-[11px] leading-relaxed text-ink-3">
          {L(lang, "Estimations pédagogiques — pas des résultats officiels.", "Pedagogical estimates — not official results.")}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar with language toggle */}
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-2.5 md:hidden">
          <Link href="/today" className="font-display text-base font-semibold text-accent">Lumen Français</Link>
          <LangToggle />
        </div>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-6 md:pb-10">{children}</main>
        <footer className="hidden border-t border-line bg-white px-6 py-4 md:block">
          <Disclaimer compact lang={lang} />
        </footer>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-white md:hidden" aria-label="Navigation">
        {MOBILE_NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/today" && pathname.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${
                active ? "text-accent" : "text-ink-3"
              }`}
            >
              <span aria-hidden className="text-base leading-none">{n.icon}</span>
              {L(lang, n.fr, n.en)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
