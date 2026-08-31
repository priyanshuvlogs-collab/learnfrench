"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Kicker } from "@/components/ui";
import { useApp } from "@/lib/store";

export default function SignInPage() {
  const router = useRouter();
  const signIn = useApp((s) => s.signIn);
  const onboarded = useApp((s) => s.onboarded);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setErr("Your first name is needed — the coach will address you by name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Invalid email address.");
    signIn(name.trim(), email.trim());
    router.push(onboarded ? "/today" : "/onboarding");
  }

  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-16">
        <Kicker>Sign in · Connexion</Kicker>
        <h1 className="mt-2 font-display text-3xl font-semibold">Reprenons le travail.</h1>
        <p className="mt-1 text-sm italic text-ink-3">“Let&apos;s get back to work.”</p>
        <p className="mt-3 text-sm text-ink-2">
          The interface is in English by default — you learn French by reading both languages side by
          side, and can switch to full French anytime. Demo version: your data stays in{" "}
          <strong>this browser</strong> (no server). In production: email magic link or Google.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">First name <span className="font-normal text-ink-3">· Prénom</span></span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent"
              placeholder="Amina"
              autoComplete="given-name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Email <span className="font-normal text-ink-3">· Courriel</span></span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent"
              placeholder="amina@example.com"
              autoComplete="email"
            />
          </label>
          {err && <p className="text-sm text-warn">{err}</p>}
          <button type="submit" className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white hover:bg-accent-2">
            Continue · Continuer
          </button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
