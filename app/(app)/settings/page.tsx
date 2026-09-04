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
        window.location.reload();
      } catch {
        setImportError("This file is not a valid Lumen Français backup.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-ink-2">{profile.name} · {profile.email}</p>
      </header>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Exam &amp; target</h2>
        <label className="block text-sm">
          <span className="font-semibold">Exam</span>
          <select
            value={profile.exam}
            onChange={(e) => updateProfile({ exam: e.target.value as Exam })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          >
            <option value="TEF">TEF Canada</option>
            <option value="TCF">TCF Canada</option>
            <option value="UNDECIDED">Not decided yet</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-semibold">NCLC target (each of the 4 skills)</span>
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
          <span className="font-semibold">Exam date</span>
          <input
            type="date"
            value={profile.examDate ?? ""}
            onChange={(e) => updateProfile({ examDate: e.target.value || undefined })}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5"
          />
        </label>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Daily plan</h2>
        <label className="block text-sm">
          <span className="font-semibold">Planned minutes per day</span>
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
          <span className="font-semibold">Implementation intention (when + where)</span>
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
            <span className="font-semibold">One reminder a day, maximum</span>
            <span className="block text-xs text-ink-3">Format: “8 minutes. Weak skill: writing. Task B skeleton.” Never shame.</span>
          </span>
        </label>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Freeze rules — said on day 1</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
          <li>• 2 freezes a month, reset on the 1st ({streak.freezesLeft} left this month).</li>
          <li>• Used automatically if you miss ONE day after a 7+ streak.</li>
          <li>• A broken streak keeps its record. The resume protocol is 8 minutes, no lecture.</li>
          <li>• 5 focused minutes = a qualifying day. Never a mock exam to save a streak.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Privacy &amp; data</h2>
        <p className="mt-2 text-sm text-ink-2">
          Demo version: all your data (profile, sessions, productions) lives in this browser&apos;s local
          storage. Nothing is sent to a server. In production: encrypted Postgres, export and deletion on request.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Btn onClick={exportData} variant="ghost">Export my data (JSON)</Btn>
          <Btn onClick={() => fileRef.current?.click()} variant="ghost">Import a backup</Btn>
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
          Export includes everything: profile, streak, cards, notebook, productions. Import replaces the
          current data in this browser — export first if you are unsure.
        </p>
        {importError && <p className="mt-2 text-xs font-semibold text-warn">{importError}</p>}
        <div className="mt-4">
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-warn">Erase everything (profile, streak, history)?</span>
              <Btn
                onClick={() => {
                  resetAll();
                  router.push("/");
                }}
                variant="ghost"
                className="border-warn text-warn"
              >
                Yes, erase
              </Btn>
              <Btn onClick={() => setConfirmReset(false)} variant="quiet">Cancel</Btn>
            </div>
          ) : (
            <Btn onClick={() => setConfirmReset(true)} variant="ghost">Reset my data</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}
