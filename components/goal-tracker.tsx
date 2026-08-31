"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { weeklyProgress } from "@/lib/goals";
import { canNotify, enableNotifications, notify, notifyPermission } from "@/lib/notify";
import { L, useLang } from "@/lib/i18n";
import { Badge, Bar, Btn, Card } from "./ui";

export function GoalTracker() {
  const goals = useApp((s) => s.goals);
  const setGoals = useApp((s) => s.setGoals);
  const sessions = useApp((s) => s.sessions);
  const profile = useApp((s) => s.profile)!;
  const updateProfile = useApp((s) => s.updateProfile);
  const lang = useLang();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goals);

  const p = weeklyProgress(sessions);
  const perm = notifyPermission();
  const notifsOn = profile.notificationsOptIn && perm === "granted";

  const rows = [
    {
      key: "weeklySessions" as const,
      label: L(lang, "Sessions qualifiantes", "Qualifying sessions"),
      value: p.sessions,
      target: goals.weeklySessions,
    },
    {
      key: "weeklyWritingTasks" as const,
      label: L(lang, "Productions écrites", "Writing tasks"),
      value: p.writingTasks,
      target: goals.weeklyWritingTasks,
    },
    {
      key: "weeklySpeakingMinutes" as const,
      label: L(lang, "Minutes d'expression orale", "Speaking minutes"),
      value: p.speakingMinutes,
      target: goals.weeklySpeakingMinutes,
    },
  ];

  async function toggleNotifications() {
    if (notifsOn) {
      updateProfile({ notificationsOptIn: false });
      return;
    }
    const granted = await enableNotifications();
    updateProfile({ notificationsOptIn: granted });
    if (granted) {
      notify(
        "Lumen Français",
        L(lang,
          "Notifications activées. Vous serez prévenu à chaque session enregistrée et à chaque objectif atteint — jamais de culpabilisation.",
          "Notifications on. You'll be notified for every recorded session and every reached goal — never guilt copy.")
      );
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">
          {L(lang, "Objectifs de la semaine (7 jours glissants)", "Weekly goals (rolling 7 days)")}
        </h2>
        <div className="flex items-center gap-2">
          {rows.every((r) => r.value >= r.target) && <Badge tone="gold">{L(lang, "Semaine complète", "Week complete")}</Badge>}
          <button onClick={() => { setDraft(goals); setEditing(!editing); }} className="text-xs font-semibold text-ink-3 hover:text-accent">
            {editing ? L(lang, "Fermer", "Close") : L(lang, "Modifier", "Edit")}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span>{r.label}</span>
              <span className={`font-display font-semibold tabular-nums ${r.value >= r.target ? "text-ok" : ""}`}>
                {r.value} / {editing ? "" : r.target}
                {editing && (
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={draft[r.key]}
                    onChange={(e) => setDraft({ ...draft, [r.key]: Math.max(1, Math.min(99, Number(e.target.value) || 1)) })}
                    className="ml-1 w-14 rounded border border-line px-1.5 py-0.5 text-sm"
                    aria-label={r.label}
                  />
                )}
              </span>
            </div>
            <Bar value={r.value} max={r.target} tone={r.value >= r.target ? "ok" : "accent"} />
          </div>
        ))}
      </div>

      {editing && (
        <Btn onClick={() => { setGoals(draft); setEditing(false); }} className="mt-3">
          {L(lang, "Enregistrer les objectifs", "Save goals")}
        </Btn>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <p className="text-xs text-ink-3">
          {notifsOn
            ? L(lang, "Notifications actives : une par session enregistrée + objectifs atteints.", "Notifications on: one per recorded session + reached goals.")
            : canNotify()
              ? perm === "denied"
                ? L(lang, "Notifications bloquées par le navigateur — réactivez-les dans les réglages du site.", "Notifications blocked by the browser — re-enable them in site settings.")
                : L(lang, "Soyez prévenu à chaque session et objectif atteint.", "Get notified for every session and reached goal.")
              : L(lang, "Notifications non prises en charge par ce navigateur.", "Notifications not supported in this browser.")}
        </p>
        {canNotify() && perm !== "denied" && (
          <Btn onClick={toggleNotifications} variant={notifsOn ? "ghost" : "primary"} className="!px-3 !py-1.5 text-xs">
            {notifsOn ? L(lang, "Désactiver", "Turn off") : L(lang, "Activer les notifications", "Enable notifications")}
          </Btn>
        )}
      </div>
    </Card>
  );
}
