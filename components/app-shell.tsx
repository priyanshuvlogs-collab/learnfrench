"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { useAuth, logoutAuth } from "@/lib/use-auth";
import { syncProgress } from "@/lib/sync";
import { L, useLang } from "@/lib/i18n";
import { LangToggle } from "./lang-toggle";
import { Badge, Disclaimer } from "./ui";

const NAV: { href: string; fr: string; en: string; icon: string }[] = [
  { href: "/today", fr: "Aujourd'hui", en: "Today", icon: "◉" },
  { href: "/coach", fr: "Coach", en: "Coach", icon: "✎" },
  { href: "/skills", fr: "Compétences", en: "Skills", icon: "▤" },
  { href: "/writing", fr: "Écriture", en: "Writing", icon: "¶" },
  { href: "/speaking", fr: "Oral", en: "Speaking", icon: "◍" },
  { href: "/grammar", fr: "Grammaire", en: "Grammar", icon: "ê" },
  { href: "/review", fr: "Révision", en: "Review", icon: "⟳" },
  { href: "/mocks", fr: "Examens blancs", en: "Mock exams", icon: "▦" },
  { href: "/resources", fr: "Ressources", en: "Resources", icon: "▷" },
  { href: "/syllabus", fr: "Syllabus", en: "Syllabus", icon: "☰" },
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
  const signIn = useApp((s) => s.signIn);
  const resetAll = useApp((s) => s.resetAll);
  const lang = useLang();
  const hydrated = useHydrated();
  const { user, loaded } = useAuth();

  useEffect(() => {
    if (!hydrated || !loaded) return;
    // server session is the source of truth
    if (!user) {
      router.replace("/signin");
      return;
    }
    if (user.role === "ADMIN") {
      router.replace("/admin");
      return;
    }
    if (!user.active) return; // blocked screen rendered below
    // local learning profile follows the signed-in account
    if (profile && profile.email !== user.email) {
      resetAll();
      return;
    }
    if (!profile) {
      signIn(user.name, user.email);
      return;
    }
    if (!onboarded) {
      router.replace("/onboarding");
      return;
    }
    reconcileStreak();
  }, [hydrated, loaded, user, profile, onboarded, router, reconcileStreak, signIn, resetAll]);

  // snapshot sync for the admin dashboard, once per app load
  const sessions = useApp((s) => s.sessions);
  const skills = useApp((s) => s.skills);
  const streak = useApp((s) => s.streak);
  useEffect(() => {
    if (hydrated && loaded && user?.role === "STUDENT" && profile && onboarded) {
      syncProgress({ profile, skills, sessions, streak });
    }
    // once per load, when everything is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, loaded, Boolean(user), Boolean(profile), onboarded]);

  if (loaded && user && !user.active) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-sm space-y-4">
          <div className="font-display text-xl font-semibold text-accent">Lumen Français</div>
          <p className="text-sm text-ink-2">
            {L(lang,
              "Votre accès a été désactivé par l'administrateur. Contactez-le pour le réactiver.",
              "Your access has been disabled by the admin. Contact them to restore it.")}
          </p>
          <button
            onClick={async () => { await logoutAuth(); router.replace("/signin"); }}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            {L(lang, "Se déconnecter", "Log out")}
          </button>
        </div>
      </div>
    );
  }

  if (!hydrated || !loaded || !user || user.role === "ADMIN" || !profile || !onboarded) {
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
        <div className="mt-3 flex items-center gap-2 px-2">
          <LangToggle />
          <Badge tone={user.plan === "PREMIUM" ? "gold" : "ink"}>{user.plan === "PREMIUM" ? "Premium" : "Free"}</Badge>
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
        <div className="space-y-2 px-2 pt-4">
          <button
            onClick={async () => { await logoutAuth(); router.replace("/signin"); }}
            className="text-xs font-semibold text-ink-3 hover:text-warn"
          >
            {L(lang, "Se déconnecter", "Log out")} ({user.name})
          </button>
          <div className="text-[11px] leading-relaxed text-ink-3">
            {L(lang, "Estimations pédagogiques — pas des résultats officiels.", "Pedagogical estimates — not official results.")}
          </div>
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
