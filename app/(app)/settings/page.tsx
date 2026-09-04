"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Exam, TargetNCLC } from "@/lib/types";
import { todayKey } from "@/lib/dates";
import { Btn, Card } from "@/components/ui";

const STORAGE_KEY = "lumen-francais-v1";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile)!;
  const updateProfile = useApp((s) => s.updateProfile);
  const resetAll = useApp((s) => s.resetAll);
  const streak = useApp((s) => s.streak);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumen-francais-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file: File) {
    setImportError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || !("state" in parsed)) {
          throw new Error("format");
        }
        localStorage.setItem(STORAGE_KEY, text);
        // recharger pour que le store se réhydrate depuis la sauvegarde
        window.location.reload();
      } catch {
        setImportError("Ce fichier n'est pas une sauvegarde Lumen Français valide.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Réglages</h1>
        <p className="mt-1 text-sm text-ink-2">{profile.name} · {profile.email}</p>
      </header>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Examen &amp; cible</h2>
        <label className="block text-sm">
          <span className="font-semibold">Examen</span>
          <select
            value={profile.exam}
            onChange={(e) => updateProfile({ exam: e.target.value as Exam })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          >
            <option value="TEF">TEF Canada</option>
            <option value="TCF">TCF Canada</option>
            <option value="UNDECIDED">Pas encore décidé</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">Cible NCLC (chacune des 4 compétences)</span>
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
          <span className="font-semibold">Date d&apos;examen</span>
          <input
            type="date"
            value={profile.examDate ?? ""}
            onChange={(e) => updateProfile({ examDate: e.target.value || undefined })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          />
        </label>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Plan quotidien</h2>
        <label className="block text-sm">
          <span className="font-semibold">Minutes prévues par jour</span>
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
          <span className="font-semibold">Intention d&apos;implémentation (quand + où)</span>
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
            onChange={(e) => updateProfile({ notificationsOptIn: e.target.checked })}
            className="h-4 w-4"
          />
          <span>
            <span className="font-semibold">Un rappel par jour, maximum</span>
            <span className="block text-xs text-ink-3">Format : « 8 minutes. Compétence faible : écriture. Squelette de la tâche B. » Jamais de culpabilisation.</span>
          </span>
        </label>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Règles des gels — dites dès le jour 1</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
          <li>• 2 gels par mois, réinitialisés le 1er ({streak.freezesLeft} restant{streak.freezesLeft > 1 ? "s" : ""} ce mois-ci).</li>
          <li>• Utilisés automatiquement si vous manquez UN jour après une chaîne de 7+.</li>
          <li>• Une chaîne cassée garde son record. Le protocole de reprise fait 8 minutes, sans leçon.</li>
          <li>• 5 minutes concentrées = journée qualifiante. Jamais d&apos;examen blanc obligatoire pour sauver une chaîne.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Confidentialité &amp; données</h2>
        <p className="mt-2 text-sm text-ink-2">
          Version de démonstration : toutes vos données (profil, sessions, productions) vivent dans le stockage local de ce
          navigateur. Rien n&apos;est envoyé à un serveur. En production : Postgres chiffré, export et suppression sur demande.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Btn onClick={exportData} variant="ghost">Exporter mes données (JSON)</Btn>
          <Btn onClick={() => fileRef.current?.click()} variant="ghost">Importer une sauvegarde</Btn>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = "";
            }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-3">
          L&apos;export contient tout : profil, chaîne, cartes, carnet, productions. L&apos;import remplace les données
          actuelles de ce navigateur — faites un export d&apos;abord si vous hésitez.
        </p>
        {importError && <p className="mt-2 text-xs font-semibold text-warn">{importError}</p>}
        <div className="mt-4">
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-warn">Tout effacer (profil, chaîne, historique) ?</span>
              <Btn
                onClick={() => {
                  resetAll();
                  router.push("/");
                }}
                variant="ghost"
                className="border-warn text-warn"
              >
                Oui, effacer
              </Btn>
              <Btn onClick={() => setConfirmReset(false)} variant="quiet">Annuler</Btn>
            </div>
          ) : (
            <Btn onClick={() => setConfirmReset(true)} variant="ghost">Réinitialiser mes données</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}
