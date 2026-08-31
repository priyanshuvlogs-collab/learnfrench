"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Exam, TargetNCLC } from "@/lib/types";
import { L, useLang } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { enableNotifications } from "@/lib/notify";
import { logoutAuth, useAuth } from "@/lib/use-auth";
import { Badge, Btn, Card } from "@/components/ui";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile)!;
  const updateProfile = useApp((s) => s.updateProfile);
  const resetAll = useApp((s) => s.resetAll);
  const streak = useApp((s) => s.streak);
  const lang = useLang();
  const { user } = useAuth();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">{L(lang, "Réglages", "Settings")}</h1>
        <p className="mt-1 text-sm text-ink-2">{profile.name} · {profile.email}</p>
      </header>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Compte", "Account")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={user?.plan === "PREMIUM" ? "gold" : "ink"}>
            {user?.plan === "PREMIUM" ? "Premium" : L(lang, "Gratuit", "Free")}
          </Badge>
          <span className="text-sm text-ink-2">
            {user?.plan === "PREMIUM"
              ? L(lang, "Productions notées illimitées, blancs longs, coach IA.", "Unlimited scored tasks, long mocks, AI coach.")
              : L(lang,
                  "1 production écrite + 1 orale notées par jour. L'administrateur peut activer Premium.",
                  "1 scored writing + 1 speaking task per day. The admin can enable Premium.")}
          </span>
        </div>
        <Btn
          onClick={async () => {
            await logoutAuth();
            router.push("/signin");
          }}
          variant="ghost"
        >
          {L(lang, "Se déconnecter", "Log out")}
        </Btn>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Langue de l'interface", "Interface language")}</h2>
        <LangToggle />
        <p className="text-sm text-ink-2">
          {L(lang,
            "L'anglais est la langue principale de l'interface : vous apprenez le français en lisant les deux langues côte à côte (textes, consignes, cartes). Passez tout en français quand vous êtes prêt — c'est un excellent exercice.",
            "English is the main interface language: you learn French by reading both languages side by side (texts, prompts, cards). Switch everything to French when you're ready — that itself is great practice.")}
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Examen & cible", "Exam & target")}</h2>
        <label className="block text-sm">
          <span className="font-semibold">{L(lang, "Examen", "Exam")}</span>
          <select
            value={profile.exam}
            onChange={(e) => updateProfile({ exam: e.target.value as Exam })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          >
            <option value="TEF">TEF Canada</option>
            <option value="TCF">TCF Canada</option>
            <option value="UNDECIDED">{L(lang, "Pas encore décidé", "Not decided yet")}</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{L(lang, "Cible NCLC (chacune des 4 compétences)", "Target NCLC (each of the 4 skills)")}</span>
          <select
            value={profile.targetNCLC}
            onChange={(e) => updateProfile({ targetNCLC: Number(e.target.value) as TargetNCLC })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          >
            <option value={5}>NCLC 5</option>
            <option value={7}>NCLC 7</option>
            <option value={8}>NCLC 8</option>
            <option value={9}>NCLC 9</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{L(lang, "Date d'examen", "Exam date")}</span>
          <input
            type="date"
            value={profile.examDate ?? ""}
            onChange={(e) => updateProfile({ examDate: e.target.value || undefined })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          />
        </label>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Plan quotidien", "Daily plan")}</h2>
        <label className="block text-sm">
          <span className="font-semibold">{L(lang, "Minutes prévues par jour", "Planned minutes per day")}</span>
          <select
            value={profile.dailyMinutes}
            onChange={(e) => updateProfile({ dailyMinutes: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          >
            <option value={10}>10 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={40}>40 minutes</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{L(lang, "Intention d'implémentation (quand + où)", "Implementation intention (when + where)")}</span>
          <input
            value={profile.intention.time}
            onChange={(e) => updateProfile({ intention: { ...profile.intention, time: e.target.value } })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          />
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={profile.notificationsOptIn}
            onChange={async (e) => {
              if (e.target.checked) {
                const granted = await enableNotifications();
                updateProfile({ notificationsOptIn: granted });
              } else {
                updateProfile({ notificationsOptIn: false });
              }
            }}
            className="h-4 w-4"
          />
          <span>
            <span className="font-semibold">{L(lang, "Un rappel par jour, maximum", "One reminder per day, maximum")}</span>
            <span className="block text-xs text-ink-3">
              {L(lang,
                "Format : « 8 minutes. Compétence faible : écriture. Squelette de la tâche B. » Jamais de culpabilisation.",
                "Format: “8 minutes. Weakest skill: writing. Task B skeleton.” Never guilt copy.")}
            </span>
          </span>
        </label>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Règles des gels — dites dès le jour 1", "Freeze rules — stated on day 1")}</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
          <li>• {L(lang, `2 gels par mois, réinitialisés le 1er (${streak.freezesLeft} restant${streak.freezesLeft > 1 ? "s" : ""} ce mois-ci).`, `2 freezes per month, reset on the 1st (${streak.freezesLeft} left this month).`)}</li>
          <li>• {L(lang, "Utilisés automatiquement si vous manquez UN jour après une chaîne de 7+.", "Used automatically if you miss ONE day after a 7+ streak.")}</li>
          <li>• {L(lang, "Une chaîne cassée garde son record. Le protocole de reprise fait 8 minutes, sans leçon.", "A broken chain keeps its record. The resume protocol is 8 minutes, no lecture.")}</li>
          <li>• {L(lang, "5 minutes concentrées = journée qualifiante. Jamais d'examen blanc obligatoire pour sauver une chaîne.", "5 focused minutes = a qualifying day. Never a mandatory mock to save a streak.")}</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">{L(lang, "Confidentialité & données", "Privacy & data")}</h2>
        <p className="mt-2 text-sm text-ink-2">
          {L(lang,
            "Version de démonstration : toutes vos données (profil, sessions, productions) vivent dans le stockage local de ce navigateur. Rien n'est envoyé à un serveur. En production : Postgres chiffré, export et suppression sur demande.",
            "Demo version: all your data (profile, sessions, submissions) lives in this browser's local storage. Nothing is sent to a server. In production: encrypted Postgres, export and deletion on request.")}
        </p>
        <div className="mt-4">
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-warn">{L(lang, "Tout effacer (profil, chaîne, historique) ?", "Erase everything (profile, streak, history)?")}</span>
              <Btn
                onClick={() => {
                  resetAll();
                  router.push("/");
                }}
                variant="ghost"
                className="border-warn text-warn"
              >
                {L(lang, "Oui, effacer", "Yes, erase")}
              </Btn>
              <Btn onClick={() => setConfirmReset(false)} variant="quiet">{L(lang, "Annuler", "Cancel")}</Btn>
            </div>
          ) : (
            <Btn onClick={() => setConfirmReset(true)} variant="ghost">{L(lang, "Réinitialiser mes données", "Reset my data")}</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}
