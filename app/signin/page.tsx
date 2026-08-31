"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Kicker } from "@/components/ui";
import { refreshAuth } from "@/lib/use-auth";

const ERRORS: Record<string, string> = {
  "invalid-credentials": "Wrong email or password. / Courriel ou mot de passe incorrect.",
  "account-disabled": "Your access has been disabled by the admin. / Votre accès a été désactivé par l'administrateur.",
  "email-taken": "An account already exists with this email — log in instead. / Un compte existe déjà avec ce courriel.",
  "password-too-short": "Password must be at least 8 characters. / Mot de passe : 8 caractères minimum.",
  "invalid-email": "Invalid email address. / Adresse courriel invalide.",
  "name-required": "Your first name is needed. / Votre prénom est nécessaire.",
  generic: "Something went wrong — try again. / Une erreur est survenue — réessayez.",
};

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr("");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(ERRORS[data.error] ?? ERRORS.generic);
        return;
      }
      await refreshAuth();
      router.push(data.user.role === "ADMIN" ? "/admin" : "/today");
    } catch {
      setErr(ERRORS.generic);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-14">
        <Kicker>{mode === "login" ? "Sign in · Connexion" : "Sign up · Inscription"}</Kicker>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          {mode === "login" ? "Reprenons le travail." : "On commence aujourd'hui."}
        </h1>
        <p className="mt-1 text-sm italic text-ink-3">
          {mode === "login" ? "“Let's get back to work.”" : "“We start today.”"}
        </p>

        <div className="mt-6 flex overflow-hidden rounded-lg border border-line text-sm font-semibold">
          <button
            onClick={() => { setMode("login"); setErr(""); }}
            className={`flex-1 px-4 py-2.5 ${mode === "login" ? "bg-accent text-white" : "bg-white text-ink-2 hover:text-accent"}`}
          >
            Log in
          </button>
          <button
            onClick={() => { setMode("signup"); setErr(""); }}
            className={`flex-1 px-4 py-2.5 ${mode === "signup" ? "bg-accent text-white" : "bg-white text-ink-2 hover:text-accent"}`}
          >
            Create account — free
          </button>
        </div>

        {mode === "signup" && (
          <div className="mt-4 rounded-xl bg-accent-soft p-4 text-sm leading-relaxed text-accent">
            <strong>Free plan:</strong> daily 20-minute block, listening &amp; reading drills, basic
            grammar (être/avoir), SRS cards, mini-mocks, and 1 scored writing + 1 scored speaking
            task per day. <strong>Premium</strong> (granted by the admin) unlocks unlimited scored
            productions, long section mocks and the OpenAI coach.
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
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
          )}
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
          <label className="block">
            <span className="text-sm font-semibold">Password <span className="font-normal text-ink-3">· Mot de passe</span></span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent"
              placeholder={mode === "signup" ? "8+ characters" : "••••••••"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>
          {err && <p className="text-sm text-warn">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white hover:bg-accent-2 disabled:opacity-50"
          >
            {busy ? "…" : mode === "login" ? "Log in · Se connecter" : "Create my free account"}
          </button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
