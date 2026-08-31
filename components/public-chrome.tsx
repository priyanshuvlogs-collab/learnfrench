import Link from "next/link";
import { Disclaimer } from "./ui";

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-accent">
          Lumen Français
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-4">
          <Link href="/method" className="hidden px-2 py-1 text-ink-2 hover:text-accent sm:block">
            Méthode
          </Link>
          <Link href="/tables" className="px-2 py-1 text-ink-2 hover:text-accent">
            Tableaux officiels
          </Link>
          <Link href="/pricing" className="hidden px-2 py-1 text-ink-2 hover:text-accent sm:block">
            Tarifs
          </Link>
          <Link
            href="/signin"
            className="rounded-lg bg-accent px-3.5 py-1.5 font-semibold text-white hover:bg-accent-2"
          >
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-5xl space-y-4 px-5 py-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-2">
          <span className="font-display font-semibold text-accent">Lumen Français</span>
          <Link href="/method" className="hover:text-accent">Méthode</Link>
          <Link href="/tables" className="hover:text-accent">Tableaux officiels</Link>
          <Link href="/pricing" className="hover:text-accent">Tarifs</Link>
          <a href="https://www.lefrancaisdesaffaires.fr" target="_blank" rel="noopener noreferrer" className="hover:text-accent">TEF (officiel)</a>
          <a href="https://www.france-education-international.fr" target="_blank" rel="noopener noreferrer" className="hover:text-accent">TCF (officiel)</a>
        </div>
        <Disclaimer />
      </div>
    </footer>
  );
}
