"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-white p-5 ${className}`}>{children}</div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{children}</div>
  );
}

export function Btn({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled,
  type,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost" | "gold" | "quiet";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-accent text-white hover:bg-accent-2",
    ghost: "border border-line bg-white text-ink hover:border-accent hover:text-accent",
    gold: "bg-gold-soft text-gold border border-gold/30 hover:border-gold",
    quiet: "text-ink-2 hover:text-accent",
  }[variant];
  if (href && !disabled) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Bar({
  value,
  max = 100,
  className = "",
  tone = "accent",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "accent" | "gold" | "ok" | "warn";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = { accent: "bg-accent", gold: "bg-gold", ok: "bg-ok", warn: "bg-warn" }[tone];
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-paper-2 ${className}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`bar-ease h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Ring({
  value,
  max,
  size = 128,
  label,
  sub,
}: {
  value: number;
  max: number;
  size?: number;
  label: string;
  sub?: string;
}) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-paper-2)" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={pct >= 1 ? "var(--color-ok)" : "var(--color-accent)"}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          className="bar-ease"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-semibold leading-none">{label}</div>
        {sub && <div className="mt-1 text-[11px] text-ink-3">{sub}</div>}
      </div>
    </div>
  );
}

export function Badge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "gold" | "ok" | "warn" | "ink" }) {
  const styles = {
    accent: "bg-accent-soft text-accent",
    gold: "bg-gold-soft text-gold",
    ok: "bg-ok-soft text-ok",
    warn: "bg-warn-soft text-warn",
    ink: "bg-paper-2 text-ink-2",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>{children}</span>;
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`text-ink-3 ${compact ? "text-[11px]" : "text-xs"} leading-relaxed`}>
      Lumen Français is an independent training tool, not affiliated with IRCC, Le français des
      affaires (CCI Paris Île-de-France), or France Éducation international. Scores shown are{" "}
      <strong>pedagogical estimates</strong>, not official results, and nothing here is immigration
      advice. If anything conflicts,{" "}
      <a href="https://www.canada.ca" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
        canada.ca
      </a>{" "}
      prevails.
    </p>
  );
}
