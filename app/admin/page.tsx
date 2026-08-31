"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, logoutAuth } from "@/lib/use-auth";
import { nowMs } from "@/lib/dates";
import { Badge, Btn, Card } from "@/components/ui";

interface StudentRow {
  id: string;
  name: string;
  email: string;
  plan: "FREE" | "PREMIUM";
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  snapshot: {
    streakCurrent: number;
    streakLongest: number;
    minutesTotal: number;
    sessionsCount: number;
    weakestSkill: string;
    exam: string;
    targetNCLC: number;
    estimates: Record<string, number>;
    lastActive: string;
  } | null;
}

const SKILL_SHORT: Record<string, string> = { listening: "CO", reading: "CE", writing: "EE", speaking: "EO" };

export default function AdminPage() {
  const router = useRouter();
  const { user, loaded } = useAuth();
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", plan: "FREE" });
  const [formErr, setFormErr] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/students");
    if (res.ok) {
      const d = await res.json();
      setStudents(d.students);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (!user || user.role !== "ADMIN") {
      router.replace("/signin");
      return;
    }
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [loaded, user, router, load]);

  async function patch(id: string, body: { plan?: string; active?: boolean }) {
    setBusyId(id);
    await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await load();
    setBusyId(null);
  }

  async function removeStudent(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    await load();
    setBusyId(null);
  }

  async function createStudent(e: React.FormEvent) {
    e.preventDefault();
    setFormErr("");
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json();
      setFormErr(d.error === "email-taken" ? "This email already has an account." : "Check the fields: valid email + password of 8+ characters.");
      return;
    }
    setForm({ name: "", email: "", password: "", plan: "FREE" });
    setCreating(false);
    await load();
  }

  if (!loaded || !user || user.role !== "ADMIN") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-ink-3">Loading admin…</div>;
  }

  const total = students?.length ?? 0;
  const premium = students?.filter((s) => s.plan === "PREMIUM").length ?? 0;
  const activeCount = students?.filter((s) => s.active).length ?? 0;
  const activeThisWeek =
    students?.filter((s) => {
      const d = s.snapshot?.lastActive;
      return d && nowMs() - new Date(d).getTime() < 7 * 86400000;
    }).length ?? 0;

  return (
    <div className="min-h-screen bg-paper">
      {/* Admin chrome */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <span className="font-display text-lg font-semibold text-accent">Lumen Français</span>
            <Badge tone="warn">Admin</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-3">{user.email}</span>
            <button
              onClick={async () => { await logoutAuth(); router.replace("/signin"); }}
              className="font-semibold text-ink-2 hover:text-warn"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Students</h1>
          <p className="mt-1 text-sm text-ink-2">
            Grant or revoke access, switch plans (freemium), and follow every student&apos;s progress snapshot.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Students", value: total },
            { label: "Active accounts", value: activeCount },
            { label: "Premium", value: premium },
            { label: "Active this week", value: activeThisWeek },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <div className="font-display text-3xl font-semibold">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-ink-3">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Create student */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-2">Add a student</h2>
            <Btn onClick={() => setCreating(!creating)} variant="ghost" className="!px-3 !py-1.5 text-xs">
              {creating ? "Close" : "+ New student"}
            </Btn>
          </div>
          {creating && (
            <form onSubmit={createStudent} className="mt-4 grid gap-3 sm:grid-cols-5">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="First name"
                className="rounded-lg border border-line px-3 py-2 text-sm"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                type="email"
                className="rounded-lg border border-line px-3 py-2 text-sm"
              />
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Temp password (8+)"
                className="rounded-lg border border-line px-3 py-2 text-sm"
              />
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
              >
                <option value="FREE">Free</option>
                <option value="PREMIUM">Premium</option>
              </select>
              <Btn type="submit">Create</Btn>
              {formErr && <p className="text-sm text-warn sm:col-span-5">{formErr}</p>}
            </form>
          )}
        </Card>

        {/* Table */}
        <Card className="overflow-x-auto !p-0">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b-2 border-line text-left text-xs uppercase tracking-wider text-ink-3">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Exam / target</th>
                <th className="px-4 py-3">Streak</th>
                <th className="px-4 py-3">Minutes</th>
                <th className="px-4 py-3">Weakest</th>
                <th className="px-4 py-3">Last active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students === null ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-ink-3">Loading…</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-ink-3">No students yet — share the signup link or create one above.</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className={`border-b border-line last:border-0 ${!s.active ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-ink-3">{s.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={s.plan === "PREMIUM" ? "gold" : "ink"}>{s.plan === "PREMIUM" ? "Premium" : "Free"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={s.active ? "ok" : "warn"}>{s.active ? "Active" : "Disabled"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-2">
                      {s.snapshot?.exam ? `${s.snapshot.exam} · NCLC ${s.snapshot.targetNCLC}` : "—"}
                    </td>
                    <td className="font-display px-4 py-3 font-semibold">
                      {s.snapshot ? `${s.snapshot.streakCurrent} (max ${s.snapshot.streakLongest})` : "—"}
                    </td>
                    <td className="font-display px-4 py-3">{s.snapshot?.minutesTotal ?? "—"}</td>
                    <td className="px-4 py-3">{s.snapshot?.weakestSkill ? SKILL_SHORT[s.snapshot.weakestSkill] ?? s.snapshot.weakestSkill : "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-3">{s.snapshot?.lastActive || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          disabled={busyId === s.id}
                          onClick={() => patch(s.id, { plan: s.plan === "PREMIUM" ? "FREE" : "PREMIUM" })}
                          className="rounded border border-line px-2 py-1 text-xs font-semibold hover:border-gold hover:text-gold disabled:opacity-50"
                        >
                          {s.plan === "PREMIUM" ? "→ Free" : "→ Premium"}
                        </button>
                        <button
                          disabled={busyId === s.id}
                          onClick={() => patch(s.id, { active: !s.active })}
                          className="rounded border border-line px-2 py-1 text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-50"
                        >
                          {s.active ? "Disable" : "Enable"}
                        </button>
                        {confirmDelete === s.id ? (
                          <>
                            <button
                              disabled={busyId === s.id}
                              onClick={() => removeStudent(s.id)}
                              className="rounded bg-warn px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                            >
                              Confirm delete
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="rounded px-2 py-1 text-xs text-ink-3">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(s.id)}
                            className="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-3 hover:border-warn hover:text-warn"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        <p className="text-xs text-ink-3">
          Freemium: Free = full daily loop + 1 scored writing and 1 scored speaking task per day.
          Premium = unlimited scored productions, long section mocks, OpenAI coach. Progress data is a
          snapshot synced from the student&apos;s device after each session.
        </p>
      </main>
    </div>
  );
}
